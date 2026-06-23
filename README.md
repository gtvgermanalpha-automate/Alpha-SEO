# Alpha Digital Solutions — Marketing Website

A premium, fully responsive marketing site for **Alpha Digital Solutions**, a
full-service SEO agency in Toronto — built on the Next.js App Router with a
bespoke, git-backed CMS at `/admin`.

## Tech stack

- **Next.js 16** (App Router, TypeScript, static prerendering)
- **Tailwind CSS v4** (CSS-first theme tokens — see `src/app/globals.css`)
- **Framer Motion** + CSS scroll-reveals, animated counters, accordions
- **Brand palette:** Luster White `#F4F1EC` canvas · warm Ink `#1C1A17` text ·
  Habañero `#F98513` accent/CTA · Aster Flower Blue `#9BACD8` brand surfaces.

## Pages

Routes share one layout (header mega-menu, footer, contact dock):

- `/` — home: hero, tool marquee, the five SEO pillars, process, featured case
  studies, results stat-band, testimonials, insights preview, FAQ, CTA.
- `/services` + `/services/[slug]` — the **5 SEO pillars** (Technical · On-Page ·
  Off-Page · Local · Reddit & Community / AEO).
- `/process`, `/work` (case studies + `/case-studies/[slug]`), `/blog` (insights +
  `/blog/[slug]`), `/about`, `/team`, `/faq`, `/contact`, legal pages.

## Getting started

> Node lives at `C:\Program Files\nodejs` (not on `PATH`), and the network does SSL
> inspection — prepend Node to `PATH` and trust the system cert store when installing
> or building (downloads fonts/packages).

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
$env:NODE_OPTIONS = "--use-system-ca"

npm install        # install dependencies
npm run dev        # dev server -> http://localhost:3100  (preview-dev.cmd)
npm run build      # production build
npm run lint       # ESLint
```

## CMS

Most copy + content is editable at **`/admin`** (password-gated). Saving commits the
change to this GitHub repo, which triggers a Vercel deploy — live in ~1–2 minutes.
Content lives in `src/content/*.json`; see **`ADMIN.md`**. Env vars in **`.env.example`**.

## Project structure

```
src/
  app/        layout.tsx (chrome + SEO + JSON-LD), page.tsx (home), the routes
              above, globals.css (theme), sitemap.ts · robots.ts · opengraph-image.tsx,
              admin/ + api/admin/ (the CMS)
  components/ Hero, Services, Testimonials, FAQ, CtaBand, Footer, Header (mega-menu),
              admin/ (CMS editors), ui/ (Button, Container, Reveal, Icon, …)
  content/    CMS-editable JSON (settings, copy, sections, nav, services, case-studies,
              blog, team, reviews, legal, seo)
  lib/        content.ts (import surface), cms/ (schemas + validation), github.ts (commits),
              seo/ (metadata), searchIndex.ts (site search)
```

## Notes

- Contact/audit forms post to **Formspree** (AJAX, no backend) — see **`FORMS.md`**.
- All animations respect `prefers-reduced-motion`; the site is static-prerendered.
- Deploy: GitHub → Vercel (auto-deploy on push to the production branch) →
  `alphadigitalsol.com`. Migration + deploy notes in **`VERCEL.md`**.
```
