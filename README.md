# Alpha Digital Solutions — SEO agency website

Marketing site for **Alpha Digital Solutions**, a full-service SEO agency in
Toronto. Single-page app (one HTML file, JS-toggled "pages"), hand-authored —
no build step.

- **Live domain:** https://alphadigitalsol.com
- **Stack (current):** static HTML + CSS + vanilla JS. Navy + soft-gold brand.
- **Entry file:** `seo.html` (served at `/` via `netlify.toml`).

## Structure

```
seo.html        — the whole site (14 JS-toggled "pages")
style.css       — all styles (cache-busted: style.css?v=N)
script.js       — all behaviour (cache-busted: script.js?v=N)
robots.txt      — crawlers + sitemap reference
sitemap.xml     — single canonical URL
assets/         — logo, hero image, OG card, tool-logo marquee SVGs
netlify.toml    — static deploy config (root rewrite "/" → seo.html)
```

## Local preview

Serve the folder over HTTP (the SPA needs a server, not `file://`):

```bash
python -m http.server 5180
# then open http://localhost:5180/seo.html
```

## Deploy (Netlify)

1. Connect this GitHub repo to a Netlify site — Netlify auto-deploys on every push.
2. No build command needed; publish directory is the repo root (see `netlify.toml`).
3. Add the custom domain `alphadigitalsol.com` in Netlify (DNS at Namecheap →
   point to Netlify); Netlify provisions a free auto-renewing SSL certificate.

## Roadmap

Planned rebuild to **Next.js + a git-backed CMS** (mirroring the MMR Accountants
project) so content is editable from an `/admin` panel, with edits committed to
this repo and auto-deployed by Netlify.
