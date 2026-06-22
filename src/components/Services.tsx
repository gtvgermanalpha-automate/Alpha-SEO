import Link from "next/link";
import { copy, services } from "@/lib/content";

/** Per-pillar background photo (Unsplash, from the original static site). */
const CARD_BG: Record<string, string> = {
  "technical-seo": "photo-1551288049-bebda4e38f71",
  "on-page-seo": "photo-1455390582262-044cdead277a",
  "off-page-seo": "photo-1518770660439-4636190af475",
  "local-seo": "photo-1524661135-423995f22d0b",
  "reddit-community": "photo-1611162617213-7d7a39e9b1d7",
};
const bg = (slug: string) =>
  `https://images.unsplash.com/${CARD_BG[slug] ?? CARD_BG["technical-seo"]}?w=720&q=68&auto=format&fit=crop`;

/** Short category tag shown on each card (like the reference thumbnails). */
const CARD_TAG: Record<string, string> = {
  "technical-seo": "Technical SEO",
  "on-page-seo": "On-Page & Content",
  "off-page-seo": "Off-Page & Authority",
  "local-seo": "Local SEO",
  "reddit-community": "Community & AEO",
};

/** Benefit-led headline per card — distinct from the category tag above (like
 *  the reference cards: a descriptive outcome, not the discipline name). */
const CARD_HEADLINE: Record<string, string> = {
  "technical-seo": "Fix the technical issues holding your rankings back",
  "on-page-seo": "Pages and content built to rank and convert",
  "off-page-seo": "Earn editorial links that actually move rankings",
  "local-seo": "Own the map pack in every market you serve",
  "reddit-community": "Get cited in communities and AI answer engines",
};

/** Two honest, service-descriptive highlights per pillar (what the engagement
 *  covers — not client results). Editable here. */
const CARD_STATS: Record<string, { num: string; label: string }[]> = {
  "technical-seo": [
    { num: "200+", label: "Point technical audit" },
    { num: "8", label: "Core engineering layers" },
  ],
  "on-page-seo": [
    { num: "47", label: "On-page ranking levers" },
    { num: "100%", label: "Original, briefed content" },
  ],
  "off-page-seo": [
    { num: "DR60+", label: "Editorial placements" },
    { num: "0", label: "PBNs — every link earned" },
  ],
  "local-seo": [
    { num: "Top-3", label: "Local-pack targeting" },
    { num: "GBP", label: "Profile + citations" },
  ],
  "reddit-community": [
    { num: "AEO", label: "Answer-engine ready" },
    { num: "24/7", label: "Community presence" },
  ],
};

/** Five SEO pillar cards — image background + category tag, prominent heading and
 *  two highlights (reference-style). Lighter accent that deepens on hover. */
export function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{copy.services.heading.eyebrow}</span>
          <h2>{copy.services.heading.title}</h2>
        </div>
        <div className="services-grid services-grid-5">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="service-card pillar-card">
              <div className="service-card-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bg(s.slug)} alt="" loading="lazy" />
              </div>
              <div className="pillar-card-head">
                <h3>{CARD_HEADLINE[s.slug] ?? s.title}</h3>
                <span className="pillar-tag">{CARD_TAG[s.slug] ?? "SEO"}</span>
              </div>
              <div className="case-mini-stats">
                {(CARD_STATS[s.slug] ?? []).map((st, i) => (
                  <div className="mini-stat" key={i}>
                    <span className="ms-num">{st.num}</span>
                    <span className="ms-label">{st.label}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="section-head" style={{ maxWidth: "none", textAlign: "center", margin: "2.75rem 0 0" }}>
          <p className="lead" style={{ marginBottom: "1.25rem" }}>{copy.services.ctaText}</p>
          <Link className="btn btn-accent" href="/contact">{copy.services.ctaButton}</Link>
        </div>
      </div>
    </section>
  );
}
