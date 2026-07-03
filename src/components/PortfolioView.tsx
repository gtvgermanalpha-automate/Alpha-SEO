import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { portfolioProjects } from "@/lib/portfolio";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** /portfolio — social-media + brand design projects (details only, no attribution). */
export function PortfolioView() {
  return (
    <>
      <PageHero
        crumb="Portfolio"
        title="Social & brand design work that earns attention."
        subtitle="A selection of social media and brand design projects — cohesive grids, on-brand content and communities built from the ground up."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h2>Projects, <span className="highlight">start to finish</span>.</h2>
          </div>

          <div className="portfolio-list">
            {portfolioProjects.map((p) => (
              <article className="portfolio-card" key={p.slug}>
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
              </article>
            ))}
          </div>

          <p className="portfolio-note">
            More social, brand and design work is available on request — <a href="/contact">get in touch</a> to see the full set.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
