"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const FOCUS = [
  "Technical SEO health",
  "Content & topical authority",
  "Backlink profile & authority",
  "Local SEO & multi-location",
  "Full-funnel organic strategy",
];

/** Lead-magnet "request a free SEO audit" form. Submits to Netlify Forms via
 *  fetch (matching hidden form: public/__forms.html, name="audit"). */
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
      body.set("form-name", "audit");
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
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
    <form className="lm-form" name="audit" method="POST" action="/__forms.html" data-netlify="true" onSubmit={handleSubmit} noValidate>
      <h3>Request your audit</h3>
      <input type="hidden" name="form-name" value="audit" />
      {/* Honeypot: hidden from real users; bots that fill it are rejected. */}
      <p hidden><label>Leave this field empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
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
