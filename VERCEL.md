# Deploying on Vercel (migration from Netlify)

This site now targets **Vercel** instead of Netlify. Vercel runs Next.js
natively, so the `/admin` CMS, the GitHub-commit publishing flow, the `src/proxy.ts`
login gate, image optimisation (`sharp`) and SSR all work with **no adapter and no
`netlify.toml`**.

## What changed in the codebase

- **Forms → Formspree.** The contact + audit forms now POST to Formspree
  (`src/lib/forms.ts`), replacing Netlify Forms. No backend, no database. Full
  setup in [`FORMS.md`](FORMS.md).
- **Removed** `netlify.toml`, `netlify/functions/submission-created.mjs`,
  `public/__forms.html`, and the unused `@netlify/blobs` dependency.
- **Unchanged & Vercel-native:** `src/proxy.ts` (Next 16 middleware — the `/admin`
  gate), the whole CMS under `src/app/admin` + `src/app/api/admin`, and
  `src/lib/github.ts` (commits content to GitHub).

## Stand the project up on Vercel

1. **Import the repo.** Vercel → **Add New… → Project** → import
   `gtvgermanalpha-automate/Alpha-SEO` from GitHub.
2. **Framework:** auto-detected as **Next.js**. Leave Build Command
   (`next build` / `npm run build`), Output and Install at their defaults — no
   overrides needed.
3. **Production branch:** `main` (Project → Settings → Git). This is the only
   branch that deploys to production.
4. **Environment variables** (Project → Settings → Environment Variables) — set for
   **Production** (and Preview if you want previews to work):

   | Variable | Value |
   |---|---|
   | `ADMIN_PASSWORD` | your CMS password |
   | `ADMIN_SESSION_SECRET` | a fresh random string — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `GITHUB_TOKEN` | token with **Contents: Read & write** on the repo (prefer a no-expiry GitHub App installation token) |
   | `GITHUB_REPO` | `gtvgermanalpha-automate/Alpha-SEO` |
   | `GITHUB_BRANCH` | `main` |
   | `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | your Formspree endpoint (see [`FORMS.md`](FORMS.md)) |

5. **Deploy.** The first build runs automatically; confirm it's green and that
   `/admin` loads and a CMS round-trip works (log in → edit → save → it commits to
   GitHub → redeploys).

## Forms

Set up Formspree and the endpoint env var per [`FORMS.md`](FORMS.md), then send a
test enquiry on the deployed URL and click Formspree's first-submission
confirmation link.

## Point the domain (`alphadigitalsol.com`)

The domain currently resolves to Netlify. To cut over:

1. Vercel → Project → **Settings → Domains** → add `alphadigitalsol.com` (and
   `www`). Pick the primary to match `settings.json → url` (non-www).
2. At the **domain registrar's DNS**, replace the Netlify records with the exact
   records **Vercel shows you** (typically an `A` record on the apex →
   `76.76.21.21`, and a `CNAME` on `www` → `cname.vercel-dns.com` — but always use
   the values in Vercel's dashboard, as they can change).
3. Wait for DNS to propagate; Vercel auto-issues SSL. Verify apex + `www` both
   resolve over HTTPS.

> **Safe cutover:** deploy and fully verify on the Vercel preview/`*.vercel.app`
> URL **before** switching DNS. The old Netlify deploy keeps serving until DNS
> moves, so there's no downtime — flip DNS only once Vercel looks correct.

## Note on builds

On Vercel, every push to `main` (including each CMS save) triggers a production
deploy. The free (Hobby) tier allows ~100 deploys/day, so frequent edits are far
less constrained than Netlify's monthly build-minute pool. A **draft/publish CMS
workflow** (save batches edits without deploying; one explicit "Publish" deploys)
is planned next to cut deploys further and add editorial control.

> ⚠ Vercel's **Hobby** tier is for non-commercial use. For a business site, use
> **Vercel Pro** (~$20/mo) to be compliant.
