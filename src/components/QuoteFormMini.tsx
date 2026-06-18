"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { businessTypes } from "@/lib/content";

type Errors = Partial<Record<"name" | "email", string>>;
type Status = "idle" | "submitting" | "success";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldClass =
  "w-full rounded-none border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-bronze focus-visible:outline-none focus:ring-1 focus:ring-bronze";

export function QuoteFormMini() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    // Front-end demo — wire to a server action / email service to deliver.
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 900);
  }

  if (status === "success") {
    return (
      <div className="border border-ink bg-white p-6 shadow-xl shadow-ink/10">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-bronze text-bronze">
          <Check className="h-6 w-6" strokeWidth={1.5} aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl text-ink">Quote request received</h3>
        <p className="mt-2 text-sm text-muted">
          Thank you — we&apos;ll be in touch within one business day with your tailored quote.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="border border-ink bg-white p-6 shadow-xl shadow-ink/10"
    >
      <span className="eyebrow text-bronze">Free · No obligation</span>
      <h3 className="mt-2 font-display text-2xl text-ink">Get your quote</h3>

      <div className="mt-5 flex flex-col gap-3">
        <div>
          <label htmlFor="q-name" className="sr-only">
            Full name
          </label>
          <input
            id="q-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            aria-invalid={!!errors.name}
            className={fieldClass}
          />
          {errors.name && <p className="mt-1 text-xs font-medium text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="q-email" className="sr-only">
            Email address
          </label>
          <input
            id="q-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            aria-invalid={!!errors.email}
            className={fieldClass}
          />
          {errors.email && <p className="mt-1 text-xs font-medium text-red-700">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="q-type" className="sr-only">
            Business type
          </label>
          <select id="q-type" name="businessType" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Business type
            </option>
            {businessTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-4 inline-flex w-full items-center justify-center gap-2.5 bg-ink px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-bronze disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            Get my quote
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted">Reply within one business day</p>
    </form>
  );
}
