# MMR Accountants — Marketing Website

A premium, fully responsive marketing site for a UK chartered accountancy firm,
built with the modern Next.js App Router.

## Tech stack

- **Next.js 16** (App Router, TypeScript, static prerendering)
- **Tailwind CSS v4** (CSS-first theme tokens)
- **Framer Motion** (scroll reveals, staggered cards, animated counters, accordion)
- **Lucide Icons**

## Pages

Routes share one layout (header, footer, side rails, contact dock):

- `/` — home: hero with the Google-reviews + ACCA badges, then trusted-by,
  services, why MMR, industries, process, testimonials, FAQ and a closing CTA.
- `/services`, `/why-mmr`, `/industries`, `/how-we-help`, `/how-we-work`, `/faq`,
  `/contact` — each a focused page with a decorative blue breadcrumb banner
  (`PageHero`) and the relevant sections.
- Detail pages under `/services/[slug]`, `/industries/[slug]`, `/how-we-help/[slug]`.

The navbar uses **dropdown mega-menus** (desktop hover panels / mobile accordion);
dropdown items deep-link to anchored sections (e.g. `/services#payroll`).

**Floating chrome:** a bottom-right **contact speed-dial** that fans out *Call us* +
*Live chat* (the scripted assistant) on hover/tap, plus a once-per-session
"request a callback" popup on the home page.

## Getting started

> **Note for this machine:** Node 22 is installed at `C:\Program Files\nodejs`
> but is not on the system `PATH`, and the network does SSL inspection. The
> commands below prepend Node to `PATH` and tell Node to trust the Windows
> certificate store (`--use-system-ca`), which is only needed when installing
> packages or downloading fonts.

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
$env:NODE_OPTIONS = "--use-system-ca"

npm install        # install dependencies
npm run dev        # start the dev server  -> http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
```

If Node is already on your `PATH` and you are on a normal network, the plain
`npm run dev` / `npm run build` commands work without the two `$env:` lines.

## Project structure

```
src/
  app/
    layout.tsx            Shared chrome (Header, Footer, ContactDock) + SEO + JSON-LD
    page.tsx              Home
    services/, industries/, how-we-help/, how-we-work/, why-mmr/, faq/, contact/
    globals.css           Tailwind v4 theme (navy/orange/light-blue palette, fonts, keyframes)
    sitemap.ts · robots.ts · opengraph-image.tsx
  components/
    Header (mega-menu), HeroPremium, PageHero, CtaBand, TrustedBy, Services,
    WhyChoose, Industries, HowWeWork, Testimonials, FAQ, Contact + ContactForm,
    Footer, ContactDock + ChatPanel, LeadPopup, DetailPageView
    admin/                the /admin CMS editors
    ui/                   Reveal, Container, Button, Icon, SpotArt, brands, …
  content/                CMS-editable JSON (settings, copy, sections, nav, legal,
                          reviews, services, industries-1/2, approach)
  lib/
    content.ts            Single import surface (re-exports content + detail pages)
    cms/                  schemas + validation for the CMS
```

## Customising

- **Most copy + content** is CMS-editable at **`/admin`** (see `ADMIN.md`) and lives
  in `src/content/*.json`.
- **Brand colours, fonts, animations** -> the `@theme` block in `src/app/globals.css`.
- **Domain / SEO** -> `siteConfig.url` in `settings.json` (drives metadata, sitemap, OG, JSON-LD).

## Notes

- **Contact form** is wired to **Netlify Forms** (`public/__forms.html` + AJAX in
  `ContactForm.tsx`), with optional reCAPTCHA and a visitor auto-reply. See **`FORMS.md`**
  for receiving enquiries and the optional setup.
- **Header illustrations** are licence-clean unDraw SVGs, recoloured to the brand
  navy, in `public/illustrations/`.
- All animations respect `prefers-reduced-motion`.
- The site is fully static-prerendered for fast loading and strong Lighthouse scores.
- Delivery / handover steps are in **`HANDOVER.md`**.
