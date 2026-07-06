import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PillarIllustration, type PillarIllustName } from "@/components/ui/PillarIllustration";
import { services } from "@/lib/content";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/** Concise category tag per pillar (matches the breadcrumb labels used elsewhere). */
const CATEGORY_TAG: Record<string, string> = {
  "technical-seo": "Technical SEO",
  "on-page-seo": "On-Page & Content",
  "social-media-marketing": "Social Media",
  "local-seo": "Local SEO",
  "reddit-community": "Community & AEO",
};

/** Where each category's "Explore projects" link goes. Social Media Marketing has
 *  its own project deep-dive (real, supplied work); the others point to our
 *  documented case studies until pillar-specific project decks exist. */
const CATEGORY_HREF: Record<string, string> = {
  "technical-seo": "/case-studies",
  "on-page-seo": "/case-studies",
  "social-media-marketing": "/portfolio/social-media-marketing",
  "local-seo": "/case-studies",
  "reddit-community": "/case-studies",
};

/** Bespoke illustration per non-SMM category (SMM uses a real supplied project photo). */
const CATEGORY_ILLUS: Record<string, PillarIllustName> = {
  "technical-seo": "engineering-layers",
  "on-page-seo": "content-map",
  "local-seo": "storefront-profile",
  "reddit-community": "ai-citation",
};

/** /portfolio — a hub showcasing real work across every service pillar; Social
 *  Media Marketing's card links through to a full project-by-project deep-dive. */
export function PortfolioView() {
  return (
    <>
      <PageHero
        crumb="Portfolio"
        title="Real work, across every growth channel."
        subtitle="Explore projects behind each of our five service pillars — from technical SEO recoveries to the social and brand design work we showcase in full."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Every pillar</span>
            <h2>Pick a discipline, <span className="highlight">see the work</span>.</h2>
          </div>

          <div className="portfolio-hub-grid">
            {services.map((s) => {
              const href = CATEGORY_HREF[s.slug] ?? "/case-studies";
              const illus = CATEGORY_ILLUS[s.slug];
              const isSocial = s.slug === "social-media-marketing";
              return (
                <article className="portfolio-hub-card" key={s.slug} data-reveal>
                  <div className={`portfolio-hub-media${isSocial ? " portfolio-hub-collage" : ""}`}>
                    {isSocial ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/portfolio/evolution-magazine.webp" alt="Evolution Magazine — dark editorial social design" loading="lazy" width={324} height={405} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/portfolio/elevon-pakistan.webp" alt="Elevon Pakistan — cricket World Cup social design" loading="lazy" width={324} height={405} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/portfolio/pstve-glo.webp" alt="Pstve Glo — scented-candle brand design" loading="lazy" width={324} height={405} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/portfolio/evolution-tile-02.webp" alt="Evolution Magazine — AI story social design" loading="lazy" width={324} height={405} />
                      </>
                    ) : (
                      <PillarIllustration name={illus ?? "report"} accentIcon={s.icon as IconName} />
                    )}
                  </div>
                  <div className="portfolio-hub-body">
                    <span className="portfolio-hub-tag">{CATEGORY_TAG[s.slug] ?? "SEO"}</span>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <Link href={href} className="portfolio-hub-link">
                      Explore projects <Arrow />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
