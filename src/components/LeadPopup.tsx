"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, PhoneCall, X } from "lucide-react";
import { siteConfig } from "@/lib/content";

/** Shown once per browser session, a few seconds after the visitor lands on the
 *  home page. A compact "request a callback" form that posts to the Netlify
 *  `callback` form (see public/__forms.html). sessionStorage keeps it from
 *  re-appearing on refresh; it returns on a fresh visit. */
const SESSION_KEY = "mmr_callback_popup";
const SHOW_DELAY = 5000;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const reduce = useReducedMotion();
  const dismissed = useRef(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      if (!dismissed.current) {
        setOpen(true);
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    }, SHOW_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    dismissed.current = true;
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nm = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (nm.length < 2) return setError("Please enter your name.");
    if (!emailRe.test(email)) return setError("Please enter a valid email address.");
    setError(null);
    setStatus("submitting");
    try {
      const body = new URLSearchParams();
      data.forEach((v, k) => body.append(k, typeof v === "string" ? v : ""));
      body.set("form-name", "callback");
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error();
      setName(nm);
      setStatus("success");
      setTimeout(close, 3200);
    } catch {
      setStatus("idle");
      setError("Something went wrong — please call us instead.");
    }
  }

  const fieldClass =
    "w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-accent focus-visible:outline-none focus:ring-1 focus:ring-accent";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-popup-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header band */}
            <div className="relative overflow-hidden bg-brand-blue-deep px-7 pb-7 pt-8 text-ink">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-brand-dotgrid opacity-50" />
              <div className="relative">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-accent shadow-sm ring-1 ring-ink/10">
                  <PhoneCall className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                </span>
                <h2 id="lead-popup-title" className="mt-4 font-display text-2xl font-bold leading-tight">
                  Speak to an accountant
                </h2>
                <p className="mt-1.5 text-sm text-ink/80">
                  Leave your details and a qualified accountant will call you back within one business day — no obligation.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              {status === "success" ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-accent text-accent">
                    <Check className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-ink">
                    Thanks{name ? `, ${name.split(" ")[0]}` : ""} — request received
                  </h3>
                  <p className="mt-2 text-sm text-muted">We&apos;ll be in touch very soon. Talk to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <input ref={firstField} name="name" type="text" autoComplete="name" placeholder="Full name" className={fieldClass} />
                  <input name="email" type="email" autoComplete="email" placeholder="Email address" className={fieldClass} />
                  <input name="phone" type="tel" autoComplete="tel" placeholder="Phone (optional)" className={fieldClass} />
                  <p className="hidden" aria-hidden>
                    <label>
                      Leave empty<input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>
                  {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-bronze px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-ink transition-colors hover:bg-bronze-600 disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Request my callback"
                    )}
                  </button>
                  <p className="text-center text-xs text-muted">
                    or call{" "}
                    <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="font-semibold text-accent hover:underline">
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
