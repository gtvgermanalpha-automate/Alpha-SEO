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
  `https://images.unsplash.com/${CARD_BG[slug] ?? CARD_BG["technical-seo"]}?w=540&q=65&auto=format&fit=crop`;

/** Five SEO pillar cards — image background + bold heading; intensifies + gold
 *  arrow on hover. Ported from the original static site. */
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
              <h3>{s.title}</h3>
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
