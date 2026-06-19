// Netlify event-triggered function — fires automatically after every successful
// contact-form submission (the "submission-created" name is the trigger; do not
// rename). It sends a branded auto-reply to the visitor who filled in the form.
//
// DORMANT BY DEFAULT: without RESEND_API_KEY it no-ops, so nothing breaks. The
// owner notification (the email that lands in *your* inbox) is configured
// separately in the Netlify dashboard — see FORMS.md. This file only adds the
// confirmation email sent back to the visitor.
//
// Environment variables (Site configuration → Environment variables):
//   RESEND_API_KEY      – required to send. Create one at https://resend.com.
//   AUTOREPLY_FROM      – verified sender, e.g. "Alpha Digital Solutions <hello@alphadigitalsol.com>".
//                         Requires a verified domain in Resend; falls back to
//                         Resend's shared test sender until you set it.
//   AUTOREPLY_REPLY_TO  – where the visitor's reply goes (default below).
//   AUTOREPLY_BCC       – optional: silently copy the firm on every auto-reply.

const BRAND = "Alpha Digital Solutions";
const PHONE = "+1 647 365 0782";
const WEBSITE = "https://alphadigitalsol.com";
const DEFAULT_REPLY_TO = "contact@alphadigitalsol.com";

// Brand palette (kept inline — email clients ignore external/<style> CSS).
const NAVY = "#1C1A17";
const ORANGE = "#F98513";
const LIGHT = "#F4F1EC";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export const handler = async (event) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return ok("auto-reply disabled (no RESEND_API_KEY)");

  // Netlify delivers the submission as { payload: { data, email, ... } }.
  let data = {};
  try {
    const parsed = JSON.parse(event.body || "{}");
    data = parsed.payload?.data ?? parsed.data ?? {};
  } catch {
    return ok("unparseable payload — skipped");
  }

  const to = String(data.email ?? "").trim();
  const honeypot = String(data["bot-field"] ?? "").trim();
  // Only reply to a plausible address, and never to a honeypot-tripped bot.
  if (!EMAIL_RE.test(to) || honeypot) return ok("no valid recipient — skipped");

  const name = String(data.name ?? "").trim();
  const firstName = name ? name.split(/\s+/)[0] : "there";
  const message = String(data.message ?? "").trim();

  const from = process.env.AUTOREPLY_FROM || `${BRAND} <onboarding@resend.dev>`;
  const replyTo = process.env.AUTOREPLY_REPLY_TO || DEFAULT_REPLY_TO;
  const bcc = process.env.AUTOREPLY_BCC;

  const subject = `Thanks for contacting ${BRAND}`;
  const text = [
    `Hi ${firstName},`,
    "",
    `Thanks for getting in touch with ${BRAND}. We've received your enquiry and a senior strategist will be in touch within one business day.`,
    "",
    message ? `For your records, here's what you sent us:\n"${message}"` : "",
    "",
    `If it's urgent, call us on ${PHONE}.`,
    "",
    "Kind regards,",
    `The ${BRAND} team`,
    WEBSITE,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = renderHtml({ firstName, message });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        ...(bcc ? { bcc: [bcc] } : {}),
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      // Never fail the submission over a best-effort email — just log it.
      console.error("Auto-reply send failed:", res.status, await res.text());
      return ok("send failed (logged)");
    }
    return ok("auto-reply sent");
  } catch (err) {
    console.error("Auto-reply error:", err);
    return ok("send error (logged)");
  }
};

const ok = (body) => ({ statusCode: 200, body });

function renderHtml({ firstName, message }) {
  const quote = message
    ? `<tr><td style="padding:0 32px 24px;">
         <p style="margin:0 0 8px;font:600 12px/1.4 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7177;">Your message</p>
         <blockquote style="margin:0;padding:14px 18px;background:${LIGHT};border-left:3px solid ${ORANGE};font:400 15px/1.6 Arial,sans-serif;color:${NAVY};">${esc(message)}</blockquote>
       </td></tr>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f4f6f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e7eaee;">
        <tr><td style="background:${NAVY};padding:26px 32px;">
          <span style="font:700 20px/1.2 Arial,sans-serif;color:#ffffff;letter-spacing:.02em;">${BRAND}</span>
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${ORANGE};margin-left:6px;"></span>
        </td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0 0 14px;font:700 22px/1.3 Arial,sans-serif;color:${NAVY};">Thanks, ${esc(firstName)} — message received</h1>
          <p style="margin:0 0 16px;font:400 15px/1.7 Arial,sans-serif;color:#3f454b;">
            We've received your enquiry and a senior strategist will be in touch
            <strong>within one business day</strong>. We look forward to helping your organic growth compound.
          </p>
        </td></tr>
        ${quote}
        <tr><td style="padding:0 32px 28px;">
          <p style="margin:0;font:400 15px/1.7 Arial,sans-serif;color:#3f454b;">
            If it's urgent, call us on
            <a href="tel:${PHONE.replace(/\s/g, "")}" style="color:${ORANGE};font-weight:700;text-decoration:none;">${PHONE}</a>.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #e7eaee;background:#fbfcfd;">
          <p style="margin:0;font:400 13px/1.6 Arial,sans-serif;color:#6b7177;">
            Kind regards,<br><strong style="color:${NAVY};">The ${BRAND} team</strong><br>
            <a href="${WEBSITE}" style="color:#6b7177;">${WEBSITE.replace(/^https?:\/\//, "")}</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font:400 11px/1.5 Arial,sans-serif;color:#9aa0a6;">This is an automated confirmation — please don't reply to this address.</p>
    </td></tr>
  </table>
</body></html>`;
}
