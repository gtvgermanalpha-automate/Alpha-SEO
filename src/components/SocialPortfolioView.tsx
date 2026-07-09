import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { CustomSchema } from "@/components/CustomSchema";
import { ProofPanel } from "@/components/ProofPanel";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { portfolioProjects } from "@/lib/portfolio";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Aggregate, real numbers only — sums of the per-project deck metrics
 *  (23.7K + 3,550 followers; 949 + 193 posts) and the Pstve Glo analytics
 *  screenshot (41,177 views, 98.7% non-followers — receipts in the proof
 *  section below the band). Rendered as animated count-ups. */
const RESULTS: { value: number; suffix: string; decimals?: number; label: string }[] = [
  { value: 27, suffix: "K+", label: "Followers grown across client accounts" },
  { value: 1140, suffix: "+", label: "Posts designed & written in-house" },
  { value: 41, suffix: "K+", label: "Organic views in one tracked window" },
  { value: 98.7, suffix: "%", decimals: 1, label: "Of that reach from non-followers" },
];

/** /portfolio/social-media-marketing — the SMM pillar's own project deep-dive:
 *  animated results, engagement proof with receipts, featured projects with
 *  design-grid galleries, and a compact strip for the smaller brand projects. */
export function SocialPortfolioView() {
  const featured = portfolioProjects.filter((p) => p.tier === "featured");
  const compact = portfolioProjects.filter((p) => p.tier === "compact");

  return (
    <>
      <section className="page-header">
        <div className="container">
          <Link className="btn-back" href="/portfolio">&#8592; Back to portfolio</Link>
          <span className="eyebrow">Portfolio · Social Media Marketing</span>
          <h1>Social &amp; brand design work that <span className="highlight">earns attention</span>.</h1>
          <p>
            A selection of social media and brand design projects — cohesive grids, on-brand content and
            communities built from the ground up.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="portfolio-results" data-reveal>
            {RESULTS.map((r) => (
              <div className="highlight-chip" key={r.label}>
                <span className="highlight-chip-value grad-num">
                  <AnimatedCounter value={r.value} suffix={r.suffix} decimals={r.decimals ?? 0} />
                </span>
                <span className="highlight-chip-label">{r.label}</span>
              </div>
            ))}
          </div>
          <p className="portfolio-results-note">
            Numbers from the project decks and the client accounts&apos; own analytics — receipts below.
          </p>
        </div>
      </section>

      <section className="section section-tight" id="proof">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Insights &amp; engagement</span>
            <h2>Proof, <span className="highlight">not promises</span>.</h2>
          </div>
          <ProofPanel />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h2>Projects, <span className="highlight">start to finish</span>.</h2>
          </div>

          <div className="portfolio-list">
            {featured.map((p) => (
              <article className="portfolio-card" key={p.slug}>
                <div className="portfolio-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt} loading="lazy" width={560} height={700} />
                </div>

                <div className="portfolio-body">
                  <div className="portfolio-card-head">
                    <span className="portfolio-tag">{p.category}</span>
                    <h3>{p.title}</h3>
                  </div>

                  <div className="portfolio-stats">
                    {p.metrics.map((m, i) => (
                      <div className="p-stat" key={i}>
                        <span className="p-stat-num">{m.value}</span>
                        <span className="p-stat-label">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <p className="portfolio-summary">{p.summary}</p>

                  <ul className="portfolio-highlights">
                    {p.highlights.map((h) => (
                      <li key={h}><Check />{h}</li>
                    ))}
                  </ul>
                </div>

                {p.designs.length ? (
                  <div className="pf-gallery">
                    {p.designs.map((d) => (
                      <figure className={`pf-tile${d.layout ? ` pf-tile-${d.layout}` : ""}`} key={d.src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={d.src} alt={d.alt} loading="lazy" />
                      </figure>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Also delivered</span>
            <h2>More brand &amp; campaign work.</h2>
          </div>

          <div className="compact-grid">
            {compact.map((p) => {
              const duo = p.designs.length > 0;
              return (
                <article className="compact-card" key={p.slug} data-reveal>
                  <div className={`compact-media${duo ? " compact-media-duo" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.imageAlt} loading="lazy" />
                    {duo
                      ? p.designs.map((d) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={d.src} src={d.src} alt={d.alt} loading="lazy" />
                        ))
                      : null}
                  </div>
                  <div className="compact-body">
                    <span className="portfolio-tag">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                    <div className="compact-metrics">
                      {p.metrics.map((m, i) => (
                        <span className="compact-metric" key={i}>
                          <strong>{m.value}</strong> {m.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="portfolio-note">
            More social, brand and design work is available on request — <a href="/contact">get in touch</a> to see the full set.
          </p>
        </div>
      </section>

      <CtaBand />
      <CustomSchema route="/portfolio/social-media-marketing" />
    </>
  );
}
