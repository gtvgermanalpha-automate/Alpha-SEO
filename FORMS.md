# Contact form — submissions, notifications, spam & auto-reply

The contact form is powered by **Netlify Forms**, so **there is no database to run
and no backend to host**. Every enquiry is captured by Netlify automatically:

- It's **stored** in your Netlify dashboard (and exportable to CSV).
- It can be **emailed to you** the moment it arrives (one-time setup, below).
- Optionally, the visitor can get an **auto-reply** confirming you received it.

How it's wired (for reference):

- [`src/components/ContactForm.tsx`](src/components/ContactForm.tsx) — the real, styled,
  validated form. It POSTs over AJAX so the page never reloads.
- [`public/__forms.html`](public/__forms.html) — a hidden static form Netlify's
  build bot scans to register the `contact` form and its fields. **Keep its field
  names in sync with the component.**
- A built-in **honeypot** (`bot-field`) silently drops basic spam bots.

> ⚠️ Netlify processes forms on the **deployed site only** — submissions do **not**
> work on `npm run dev`. Always test on the live URL.

---

## 1. Get submissions emailed to you  ← the important one

By default Netlify *stores* submissions but doesn't email them. Turn on an email
notification once, in the dashboard:

1. Netlify → your site → **Forms** (top nav).
2. Open **Form notifications** — in the current UI this is under
   **Project configuration → Notifications → Form submission notifications**
   (older sites: **Site settings → Forms → Form notifications**).
3. **Add notification → Email notification.**
4. Fill in:
   - **Event to listen for:** *New form submission*
   - **Form:** `contact`
   - **Email to notify:** the address you want enquiries sent to. For more than
     one recipient, separate addresses with a comma
     (e.g. `info@mmraccountants.co.uk, owner@mmraccountants.co.uk`).
5. **Save.**

From now on, every enquiry is emailed there **and** kept in the dashboard as a
backup. To change the recipient later, edit or delete that same notification.

> Tip: point it at a monitored shared inbox (e.g. `info@…`) rather than a personal
> address, so cover is maintained when someone's on leave.

---

## 2. Read & export past submissions

Netlify → your site → **Forms → `contact`**. You'll see every submission with its
fields. Use **Export to CSV** for a spreadsheet, or delete spam entries here.

**Free plan:** 100 submissions/month + 10 MB of stored uploads, with spam
filtering included. Beyond that, Netlify prompts you to upgrade the Forms level.

---

## 3. Spam protection

**Already on — honeypot.** A hidden `bot-field` that humans never see. Bots that
auto-fill every field trip it and are silently discarded. Zero friction, no setup.

**Optional — reCAPTCHA v2.** A stronger layer (the *"I'm not a robot"* checkbox)
for the smarter bots a honeypot misses. The code is already in place but **dormant
until you add keys** — so add it only **if spam actually starts getting through**
(it adds a small step for every real visitor too).

To activate:

1. Go to <https://www.google.com/recaptcha/admin> and register a site:
   - **Type:** reCAPTCHA **v2** → *"I'm not a robot" Checkbox*.
   - **Domains:** add `mmruk.netlify.app` **and** your custom domain (and
     `localhost` if you want to test locally).
   - Copy the **Site key** and the **Secret key**.
2. In Netlify → **Site configuration → Environment variables**, add three
   (Site key and `SITE_RECAPTCHA_KEY` are the *same* value):
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | your Site key |
   | `SITE_RECAPTCHA_KEY` | your Site key |
   | `SITE_RECAPTCHA_SECRET` | your Secret key |
3. In [`public/__forms.html`](public/__forms.html), add `data-netlify-recaptcha="true"`
   to the `<form>` tag (there's a comment there showing exactly where).
4. **Redeploy.** The checkbox now appears on the form, and Netlify rejects any
   submission that fails the challenge.

> Both halves are required: the env vars draw & key the widget, and the
> `data-netlify-recaptcha` attribute is what makes Netlify actually *enforce* it.
> For UK/GDPR, mention reCAPTCHA (a Google service) in your privacy policy.

---

## 4. Auto-reply to the visitor

Netlify's own notifications only email **you**. To send the **person who filled in
the form** an instant branded confirmation, this site includes a Netlify function,
[`netlify/functions/submission-created.mjs`](netlify/functions/submission-created.mjs),
that fires on every submission and sends the email via **[Resend](https://resend.com)**.
It's **dormant until you add an API key** — without one it does nothing, so the
form is unaffected.

To activate:

1. Create a free **Resend** account and **verify your sending domain**
   (Resend → *Domains* → add `mmraccountants.co.uk` and add the DNS records it
   gives you). This lets you send *from* your own domain.
2. Resend → **API Keys** → create one, copy it.
3. In Netlify → **Site configuration → Environment variables**, add:
   | Variable | Value | Notes |
   |---|---|---|
   | `RESEND_API_KEY` | your Resend key | **Required** to send. |
   | `AUTOREPLY_FROM` | `MMR Accountants <hello@mmraccountants.co.uk>` | Must be on the verified domain. |
   | `AUTOREPLY_REPLY_TO` | `info@mmraccountants.co.uk` | Where the visitor's reply lands. |
   | `AUTOREPLY_BCC` | `info@mmraccountants.co.uk` | *Optional* — copy the firm on each auto-reply. |
4. **Redeploy.**

Now each visitor gets a styled "message received" email (brand colours, their own
message quoted back, your phone number). The wording lives in the function's
`renderHtml()` / `text` — edit there to change it.

> **Before you verify a domain**, leave `AUTOREPLY_FROM` unset: the function falls
> back to Resend's shared test sender so you can trial it end-to-end first.
> A failed send is logged and **never** blocks or fails the actual submission.

---

## Troubleshooting

- **No emails arriving** → confirm the **Email notification** (section 1) exists and
  the address is right; check spam. Remember it only works on the **deployed** site.
- **Form not in the dashboard** → the build bot didn't detect it. Confirm
  `public/__forms.html` deployed and its field names match the component, then
  redeploy.
- **reCAPTCHA shows but spam still gets through** → you set the env vars but didn't
  add `data-netlify-recaptcha="true"` to `__forms.html` (step 3).
- **reCAPTCHA "ERROR for site owner: Invalid site key"** → the domain isn't listed
  in the reCAPTCHA admin console, or the site key is wrong.
- **Auto-reply not sending** → check the function log (Netlify → **Logs → Functions
  → submission-created**). Usual causes: missing `RESEND_API_KEY`, or `AUTOREPLY_FROM`
  not on a verified domain.
