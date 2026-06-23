# Contact + audit forms — submissions, notifications, spam & auto-reply

The site's two public forms — the **contact** form and the homepage **"free SEO
audit"** form — post directly to **[Formspree](https://formspree.io)**. There is
**no backend to host and no database to run**: Formspree captures every enquiry,
stores it, and emails it to you.

How it's wired (for reference):

- [`src/lib/forms.ts`](src/lib/forms.ts) — the shared endpoint + the AJAX submit
  helper. Both forms post here; the endpoint comes from
  `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (falls back to the project's existing form).
- [`src/components/ContactForm.tsx`](src/components/ContactForm.tsx) — the real,
  styled, validated contact form. POSTs over AJAX so the page never reloads.
- [`src/components/AuditForm.tsx`](src/components/AuditForm.tsx) — the lead-magnet
  audit-request form.
- Both forms send a distinct **`_subject`** line ("New contact enquiry…" /
  "New SEO audit request…") so you can tell them apart at a glance.
- A built-in **`_gotcha` honeypot** (a hidden field) silently drops basic spam bots.

> Unlike the old Netlify Forms setup, submissions **do** work from any deployed
> URL (preview or production) the moment the endpoint is live — there's no
> build-time form registration step.

---

## 1. One-time setup

1. Create a free **Formspree** account at <https://formspree.io>.
2. **+ New form** → name it (e.g. "Alpha — website"). Copy its endpoint URL — it
   looks like `https://formspree.io/f/xxxxxxx`.
3. In **Vercel → Project → Settings → Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | `https://formspree.io/f/xxxxxxx` (your endpoint) |

   Apply it to **Production** (and Preview if you want forms to work on previews),
   then **redeploy** — `NEXT_PUBLIC_*` values are baked in at build time.
4. **Confirm the form on first use.** The very first time the form receives a
   submission, Formspree emails the form owner a one-click **confirmation** link.
   Click it once and every future submission flows through automatically. Send a
   test enquiry on the deployed site to trigger it.

> Both forms can share one endpoint (they're tagged by `_subject`). If you'd
> rather keep them fully separate — e.g. different recipients — create a second
> Formspree form and split the components onto two endpoints.

---

## 2. Where enquiries go

- **Email:** Formspree emails each submission to the address on your Formspree
  account by default. Add or change recipients under the form's **Settings →
  Emails / Notifications** (a shared inbox like a team address is best).
- **Dashboard:** every submission is also kept in the Formspree dashboard and
  exportable to CSV.
- The visitor's **`email`** field is used as the email **reply-to**, so you can
  reply to an enquiry straight from your inbox.

**Free plan:** ~50 submissions/month with spam filtering included. Beyond that,
Formspree prompts you to upgrade.

---

## 3. Spam protection

**Already on — honeypot.** The hidden `_gotcha` field humans never see; bots that
auto-fill every field trip it and are silently discarded. Zero friction, no setup.
Formspree also runs its own spam filtering on top.

**Optional — reCAPTCHA / hCaptcha.** For stubborn spam, turn on a challenge in
**Formspree → your form → Settings → Spam protection**. It's handled entirely on
Formspree's side — **no code change and no env vars** (unlike the old setup).

---

## 4. Auto-reply to the visitor

To send the person who submitted the form an instant confirmation email, enable
Formspree's **Autoresponse** (form → **Settings → Autoresponse**): set the subject
and message and Formspree sends it automatically. This is a **paid-plan** feature
on Formspree.

> The previous Netlify function that sent a branded Resend auto-reply
> (`netlify/functions/submission-created.mjs`) was removed in the Vercel
> migration. If you'd prefer a fully branded, free auto-reply instead of
> Formspree's paid one, we can add a small Next.js API route that sends it via
> Resend — ask and we'll wire it up.

---

## Troubleshooting

- **No emails arriving** → check you clicked the **confirmation link** Formspree
  emailed on the first submission (§1.4); check the recipient under the form's
  Settings; check spam.
- **Submissions fail / "form not found"** → `NEXT_PUBLIC_FORMSPREE_ENDPOINT` is
  unset or wrong, or the project wasn't redeployed after setting it. Confirm the
  endpoint in the Formspree dashboard and redeploy.
- **Hit the monthly limit** → the free plan caps submissions (~50/mo); upgrade the
  Formspree plan or reduce spam.
