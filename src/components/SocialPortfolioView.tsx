import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { CustomSchema } from "@/components/CustomSchema";
import { portfolioProjects } from "@/lib/portfolio";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** /portfolio/social-media-marketing — the SMM pillar's own project deep-dive:
 *  every social + brand design project, in full (details + visuals, no attribution). */
export function SocialPortfolioView() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <Link className="btn-back" href="/portfolio">&#8592; Back to portfolio</Link>
          <span className="eyebrow">Portfolio · Social Media Marketing</span>
          <h1>Social &amp; brand design work that earns attention.</h1>
          <p>
            A selection of social media and brand design projects — cohesive grids, on-brand content and
            communities built from the ground up.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h2>Projects, <span className="highlight">start to finish</span>.</h2>
          </div>

          <div className="portfolio-list">
            {portfolioProjects.map((p) => (
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
              </article>
            ))}
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
