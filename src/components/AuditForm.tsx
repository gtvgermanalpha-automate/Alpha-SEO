"use client";

import { useState } from "react";
import { FORMSPREE_ENDPOINT, submitToFormspree } from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

const FOCUS = [
  "Technical SEO health",
  "Content & topical authority",
  "Backlink profile & authority",
  "Local SEO & multi-location",
  "Full-funnel organic strategy",
];

/** Lead-magnet "request a free SEO audit" form. Submits to Formspree via fetch
 *  (no backend); spam is handled by the `_gotcha` honeypot + Formspree filtering. */
export function AuditForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, typeof value === "string" ? value : ""));
      // Subject line so audit requests are easy to spot in the inbox / Formspree.
      body.set("_subject", "New SEO audit request — alphadigitalsol.com");
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
      <div className="lm-form">
        <h3>Request received</h3>
        <p>Thanks — a senior strategist will review your domain and send your prioritised audit within 48 hours.</p>
      </div>
    );
  }

  return (
    <form className="lm-form" name="audit" method="POST" action={FORMSPREE_ENDPOINT} onSubmit={handleSubmit} noValidate>
      <h3>Request your audit</h3>
      {/* Honeypot: hidden from real users; bots that fill it are dropped by Formspree. */}
      <p hidden><label>Leave this field empty<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></p>
      <div className="field"><input type="text" name="name" placeholder="Your name" required /></div>
      <div className="field"><input type="email" name="email" placeholder="Work email" required /></div>
      <div className="field"><input type="text" name="website" placeholder="Domain to audit (e.g. company.com)" required /></div>
      <div className="field">
        <select name="audit_focus" defaultValue="" required>
          <option value="" disabled>Primary focus area</option>
          {FOCUS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request free audit"}
      </button>
      {status === "error" && (
        <div className="lm-note" role="alert">Something went wrong — please email contact@alphadigitalsol.com and we&apos;ll sort it.</div>
      )}
      <div className="lm-note">Your data stays with our team. No third-party sharing, ever.</div>
    </form>
  );
}
