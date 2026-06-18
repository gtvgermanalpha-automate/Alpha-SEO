# Delivering the MMR Accountants site to the client

A complete, **no-long-term-support** handover: when this is done, every moving part
lives in **accounts the client owns**, with zero dependency on our accounts or
tokens. The client can edit content, receive enquiries, and renew the domain on
their own. After cutover we revoke our access.

> Execute this **after** design + content are finalised. Until then, keep working
> on `origin/main` as normal — nothing here changes day-to-day development.

---

## The model (read first)

The site has **three pillars**. Delivery = getting all three into the client's hands:

| Pillar | Today (ours) | After handover (client's) |
|---|---|---|
| **Domain** | Bought by client on **Hostinger** ✓ | Stays at Hostinger; DNS points to Netlify |
| **Source + CMS pipeline** | GitHub repo `Ahmedsandhu007/next-platform-starter` | Transferred to the client's GitHub |
| **Hosting + Forms** | Netlify site (our account, `mmruk.netlify.app`) | New site on the client's Netlify account |

**Hosting stays on Netlify — we only point the Hostinger domain at it.** The CMS
(commit-to-GitHub → auto-rebuild), the contact form (Netlify Forms + the auto-reply
function), and the Next.js runtime are all **Netlify-native**. Hostinger only
*registers* the domain in this project. Actually *hosting* on Hostinger would mean
rebuilding the forms backend and the deploy pipeline from scratch — out of scope.
*(If the client specifically wants everything on Hostinger, flag it — that's a
different, much larger job.)*

**Ongoing cost after handover:** effectively just the **domain renewal** at
Hostinger. Netlify free tier (100 form submissions/mo, 300 build-min/mo, 100 GB
bandwidth), GitHub free, and Let's Encrypt SSL all cover a site this size at £0.

---

## Decisions / info to collect from the client before starting

- [ ] **Client's GitHub account** (username/email) — to receive the repo.
- [ ] **Client's Netlify account** — create one if they don't have it (free).
- [ ] **Primary domain form** — apex `mmraccountants.co.uk` **or** `www.…`?
      (`settings.json → url` is currently `https://www.mmraccountants.co.uk`, so
      `www` is the default primary. Pick one and stay consistent.)
- [ ] **Email for enquiry notifications** (where the contact form sends).
- [ ] **Optional features at launch?** reCAPTCHA (needs free Google keys) and/or the
      visitor auto-reply (needs a Resend account). Default: leave **off** unless asked.
- [ ] **Hostinger email?** If they use `@mmraccountants.co.uk` mailboxes, keep DNS at
      Hostinger (Phase 5, option A) so MX records aren't disturbed.

---

## Pre-flight (do while finishing design)

- [ ] All content finalised **through the CMS** so the JSON in `src/content/` is final.
- [ ] **`settings.json → url` is the exact production domain.** This one field drives
      `metadataBase`, `sitemap.xml`, `robots.txt`, canonical tags, Open Graph and
      JSON-LD — get it right and all SEO is correct automatically.
- [ ] Final production build is green; whole site reviewed on `mmruk.netlify.app`.
- [ ] Everything committed and pushed — no local-only changes.
- [ ] *(Tidy, optional)* rename the repo `next-platform-starter` →
      `mmr-accountants-website` before transfer.

---

## Phase 1 — Client accounts
1. Client creates (or supplies) a **GitHub** account.
2. Client creates a **Netlify** account (free tier is enough).

## Phase 2 — Transfer the source (GitHub)
1. GitHub → the repo → **Settings → General → Danger Zone → Transfer ownership** →
   client's account/username. (Preserves all history.)
2. Client **accepts** the transfer email.
3. Record the new path `‹client›/mmr-accountants-website` — needed for `GITHUB_REPO`.

## Phase 3 — Stand the site up on the client's Netlify
1. Client's Netlify → **Add new site → Import an existing project** → authorise
   GitHub → pick the transferred repo.
2. Build settings auto-detect from `netlify.toml` (build `npm run build`, Node 22,
   functions dir). No manual config needed.
3. **Environment variables** (Site configuration → Environment variables) — set fresh
   secrets, do **not** reuse ours:
   | Variable | Value |
   |---|---|
   | `ADMIN_PASSWORD` | the client's chosen CMS password |
   | `ADMIN_SESSION_SECRET` | fresh random — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `GITHUB_TOKEN` | a **new fine-grained PAT on the client's GitHub**, repo-scoped, **Contents: Read and write**. ⚠️ Set **No expiration** — see the fragility note. |
   | `GITHUB_REPO` | `‹client›/mmr-accountants-website` |
   | `GITHUB_BRANCH` | `main` |
   | *(optional)* `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `SITE_RECAPTCHA_KEY` / `SITE_RECAPTCHA_SECRET` | only if enabling reCAPTCHA (FORMS.md §3) |
   | *(optional)* `RESEND_API_KEY` / `AUTOREPLY_FROM` / `AUTOREPLY_REPLY_TO` | only if enabling auto-reply (FORMS.md §4) |
4. Trigger the first deploy; confirm it's green.

## Phase 4 — Forms: land enquiries with the client
1. Netlify → **Forms → Form notifications → Add notification → Email notification** →
   form `contact` → the client's email. (FORMS.md §1.)
2. Submit a **test enquiry on the deployed URL**; confirm it arrives by email **and**
   shows in the Forms tab.
3. *(Optional)* enable reCAPTCHA / auto-reply per FORMS.md §3 / §4 with client-owned keys.

## Phase 5 — Point the domain (Hostinger → Netlify)
1. Client's Netlify site → **Domain management → Add a domain** →
   `mmraccountants.co.uk` (and `www`). Set the **primary** to match `settings.json`.
2. In **Hostinger → Domains → DNS / Nameservers**, choose one:
   - **Option A — keep DNS at Hostinger (recommended; preserves any Hostinger email):**
     - `A` record: host `@` → `75.2.60.5` (Netlify's load balancer)
     - `CNAME`: host `www` → `‹client-site›.netlify.app`
     - remove any leftover parking `A`/`CNAME` on `@`/`www`.
   - **Option B — let Netlify manage DNS:** set Hostinger **nameservers** to the ones
     Netlify shows. Simplest for SSL/redirects, but moves **all** DNS to Netlify —
     you must re-create MX/email records there.
3. Wait for DNS to propagate (minutes–48 h).
4. Netlify auto-issues **Let's Encrypt SSL**; then turn on **Force HTTPS**.
5. Confirm apex **and** `www` both resolve and redirect to the primary, over HTTPS.

## Phase 6 — Acceptance checklist
- [ ] Live domain loads over HTTPS; apex + `www` both reach the primary.
- [ ] Every page renders: home, each service/industry/how-we-help, legal, contact.
- [ ] **CMS round-trip:** log in at `‹domain›/admin` with the client's password →
      make a tiny edit → Save & publish → it commits to the **client's** repo and the
      site rebuilds with the change (~1–2 min).
- [ ] **Form round-trip:** real test submission → email reaches the client + appears
      in Netlify Forms.
- [ ] `‹domain›/sitemap.xml` and `‹domain›/robots.txt` show the **real domain**.
- [ ] Social share preview (OG image/title) looks right.
- [ ] 404 page, favicon and logos present.

## Phase 7 — Hand over the keys
Give the client:
- A **credentials sheet** (template below) — sent **securely** (password manager / not
  in the repo, not over plain email).
- Point them to **`ADMIN.md`** (how to use the CMS) and **`FORMS.md`** (enquiries,
  spam, auto-reply) — both already in the repo.
- One line on how updates work: *edit at `/domain/admin` → Save & publish → live in
  ~2 minutes.*

## Phase 8 — Cut the cord
- [ ] Delete (or keep briefly as rollback, then delete) **our** old Netlify site
      `mmruk.netlify.app`.
- [ ] **Revoke our GitHub token(s)** used during development.
- [ ] Remove ourselves as a collaborator on the client's repo (once they've confirmed
      they can manage it).
- [ ] Confirm the codebase holds **no real secrets** (only placeholders in
      `.env.example`).
- [ ] Final sign-off: client can independently **edit + publish + receive an enquiry**
      with no dependency on us.

---

## ⚠️ The one long-term fragility — tell the client

The CMS publishes by committing through a **GitHub token**. If that token ever
expires or is revoked, **"Save & publish" stops working** (the live site itself keeps
running fine — only editing breaks). With no support retainer:

- Generate the `GITHUB_TOKEN` with **No expiration**, and
- The 4-step regeneration is documented in **`ADMIN.md → Troubleshooting`**.

Everything else — hosting, the contact form, the domain, SSL — keeps running with no
tokens and no maintenance.

---

## Credentials sheet (template — fill at delivery, share securely)

| Item | Where / value |
|---|---|
| Domain registrar | Hostinger — client's login |
| GitHub repo | `github.com/‹client›/mmr-accountants-website` |
| Netlify site | `app.netlify.com` — client's team |
| Live site | `https://‹domain›` |
| CMS | `https://‹domain›/admin` — password = `ADMIN_PASSWORD` |
| Enquiry emails go to | `‹client email›` |
| reCAPTCHA / Resend | only if enabled |
