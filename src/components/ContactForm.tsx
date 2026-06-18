"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import { businessTypes, siteConfig } from "@/lib/content";

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** reCAPTCHA v2 site key. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY to switch the widget
 *  on; while it's unset the form behaves exactly as before (honeypot only). The
 *  matching SITE_RECAPTCHA_SECRET + data-netlify-recaptcha in __forms.html are what
 *  make Netlify actually reject failed challenges — see FORMS.md. */
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type Grecaptcha = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  getResponse: (id?: number) => string;
  reset: (id?: number) => void;
};
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const fieldClass =
  "w-full rounded-none border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-accent focus-visible:outline-none focus:ring-1 focus:ring-accent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  // Render the reCAPTCHA v2 widget once Google's script is ready — only when a
  // site key is configured. Re-runs on `status` so the widget re-appears after the
  // success screen resets to the form. Polls because the script loads async.
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || status === "success") return;
    let timer: ReturnType<typeof setTimeout>;
    const render = () => {
      const el = recaptchaRef.current;
      if (!el || el.childElementCount > 0) return; // gone, or already rendered
      if (window.grecaptcha?.render) {
        widgetId.current = window.grecaptcha.render(el, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: () => setRecaptchaError(null),
          "expired-callback": () => setRecaptchaError(null),
        });
      } else {
        timer = setTimeout(render, 250);
      }
    };
    if (!document.getElementById("recaptcha-api")) {
      const s = document.createElement("script");
      s.id = "recaptcha-api";
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    render();
    return () => clearTimeout(timer);
  }, [status]);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const consent = data.get("consent");

    if (name.length < 2) next.name = "Please enter your name.";
    if (!emailRe.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Please add a few details (10+ characters).";
    if (!consent) next.consent = "Please tick the box so we can reply.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // reCAPTCHA (only when configured): require a completed challenge before we send.
    let token = "";
    if (RECAPTCHA_SITE_KEY) {
      token = window.grecaptcha?.getResponse(widgetId.current ?? undefined) ?? "";
      if (!token) {
        setRecaptchaError("Please confirm you're not a robot.");
        recaptchaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setRecaptchaError(null);
    }

    // Deliver via Netlify Forms (zero-config on Netlify). The matching hidden form
    // in public/__forms.html lets Netlify detect the fields at deploy time; here we
    // POST the submission to it over AJAX so the page never reloads.
    setStatus("submitting");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, typeof value === "string" ? value : ""));
      body.set("form-name", "contact");
      if (token) body.set("g-recaptcha-response", token);

      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);

      form.reset();
      window.grecaptcha?.reset(widgetId.current ?? undefined);
      setStatus("success");
    } catch {
      // reCAPTCHA tokens are single-use — reset so the visitor can retry.
      window.grecaptcha?.reset(widgetId.current ?? undefined);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center border border-line bg-white p-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-accent text-accent">
          <Check className="h-7 w-7" strokeWidth={1.5} aria-hidden />
        </span>
        <h3 className="mt-6 font-display text-2xl text-ink">Thank you — message received</h3>
        <p className="mt-3 max-w-sm text-sm text-muted">
          One of our accountants will be in touch within one business day. We look forward to
          helping your business thrive.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setErrors({});
            formRef.current?.reset();
          }}
          className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      name="contact"
      method="POST"
      action="/__forms.html"
      data-netlify="true"
      onSubmit={handleSubmit}
      noValidate
      className="border border-line bg-white p-7 sm:p-8"
    >
      {/* Netlify Forms identifier (supports the no-JS native POST fallback). */}
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot: hidden from real users; bots that fill it are silently rejected. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name} required>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass}
          />
        </Field>

        <Field label="Email address" htmlFor="email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.co.uk"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
          />
        </Field>

        <Field label="Phone (optional)" htmlFor="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="07123 456789" className={fieldClass} />
        </Field>

        <Field label="Business type" htmlFor="businessType">
          <select id="businessType" name="businessType" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select an option
            </option>
            {businessTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="How can we help?" htmlFor="message" error={errors.message} required>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us a little about your business and what you need…"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`${fieldClass} resize-y`}
          />
        </Field>
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            name="consent"
            type="checkbox"
            value="yes"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 rounded-none border-line accent-accent focus-visible:outline-none"
          />
          <span>
            I agree to MMR Accountants contacting me about my enquiry. We&apos;ll never share your details.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-xs font-medium text-red-700">
            {errors.consent}
          </p>
        )}
      </div>

      {RECAPTCHA_SITE_KEY && (
        <div className="mt-5">
          <div ref={recaptchaRef} className="g-recaptcha" />
          {recaptchaError && (
            <p className="mt-1.5 text-xs font-medium text-red-700">{recaptchaError}</p>
          )}
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" strokeWidth={1.6} aria-hidden />
          <span>
            Sorry — we couldn&apos;t send your message just now. Please email{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              {siteConfig.contact.email}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              {siteConfig.contact.phoneDisplay}
            </a>{" "}
            and we&apos;ll be glad to help.
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-bronze px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors duration-300 hover:bg-bronze-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            Send Enquiry
            <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink"
      >
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
