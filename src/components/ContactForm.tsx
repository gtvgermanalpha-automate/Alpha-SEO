"use client";

import { useRef, useState } from "react";
import { businessTypes, siteConfig } from "@/lib/content";
import { FORMSPREE_ENDPOINT, submitToFormspree } from "@/lib/forms";

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errStyle: React.CSSProperties = { marginTop: ".3rem", fontSize: "var(--small)", color: "var(--error)", fontWeight: 600 };

/** Contact form — original `.contact-form` markup, submitting to Formspree via
 *  fetch (no backend). Spam is handled by the `_gotcha` honeypot + Formspree's
 *  own filtering; enable reCAPTCHA from the Formspree dashboard if needed. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

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

    setStatus("submitting");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, typeof value === "string" ? value : ""));
      // Subject line so contact enquiries are easy to spot in the inbox / Formspree.
      body.set("_subject", "New contact enquiry — alphadigitalsol.com");

      const ok = await submitToFormspree(body);
      if (!ok) throw new Error("Submission rejected");

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form" style={{ textAlign: "center" }}>
        <h3 style={{ color: "var(--navy)" }}>Thank you — message received</h3>
        <p style={{ margin: ".8rem 0 1.4rem", color: "var(--ink-soft)" }}>
          A senior strategist will be in touch within one business day. We look forward to helping your organic growth compound.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setStatus("idle");
            setErrors({});
            formRef.current?.reset();
          }}
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
      action={FORMSPREE_ENDPOINT}
      onSubmit={handleSubmit}
      noValidate
      className="contact-form"
    >
      {/* Honeypot: hidden from real users; bots that fill it are dropped by Formspree. */}
      <p hidden><label>Leave this field empty<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Smith" aria-invalid={!!errors.name} />
          {errors.name ? <span style={errStyle}>{errors.name}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" aria-invalid={!!errors.email} />
          {errors.email ? <span style={errStyle}>{errors.email}</span> : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 647 555 0123" />
      </div>

      <div className="field">
        <label htmlFor="businessType">Primary focus area</label>
        <select id="businessType" name="businessType" defaultValue="">
          <option value="" disabled>Select a focus area</option>
          {businessTypes.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">How can we help?</label>
        <textarea id="message" name="message" placeholder="Tell us a little about your business and what you need…" aria-invalid={!!errors.message} />
        {errors.message ? <span style={errStyle}>{errors.message}</span> : null}
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", fontSize: "var(--small)", color: "var(--ink-soft)", margin: ".4rem 0" }}>
        <input name="consent" type="checkbox" value="yes" aria-invalid={!!errors.consent} style={{ width: "1.1rem", height: "1.1rem", marginTop: ".15rem", flex: "0 0 auto", accentColor: "var(--navy)" }} />
        <span>I agree to Alpha Digital Solutions contacting me about my enquiry. We&apos;ll never share your details.</span>
      </label>
      {errors.consent ? <span style={errStyle}>{errors.consent}</span> : null}

      {status === "error" ? (
        <div role="alert" style={{ margin: ".6rem 0", padding: ".9rem 1rem", border: "var(--bw) solid var(--error)", borderRadius: "var(--r-sm)", color: "var(--error)", fontSize: "var(--small)" }}>
          Sorry — we couldn&apos;t send your message just now. Please email{" "}
          <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "var(--error)", textDecoration: "underline" }}>{siteConfig.contact.email}</a>{" "}
          or call{" "}
          <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} style={{ color: "var(--error)", textDecoration: "underline" }}>{siteConfig.contact.phoneDisplay}</a>.
        </div>
      ) : null}

      <button type="submit" className="btn btn-accent" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
