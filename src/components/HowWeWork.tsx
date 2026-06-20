import { Icon, type IconName } from "@/components/ui/Icon";
import { processSteps, whyPoints } from "@/lib/content";

/** Process page body — the five-step approach (auto-numbered process rows) plus
 *  operating principles. Ported from the original static site. */
export function HowWeWork() {
  const principles = whyPoints ?? [];
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="process-list">
            {processSteps.map((s) => (
              <div className="process-row" key={s.step}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {principles.length ? (
        <section className="section section-soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Our operating principles</span>
              <h2>Principles applied across <span className="highlight">each project</span></h2>
            </div>
            <div className="values-grid values-grid-4">
              {principles.map((p) => (
                <div className="value-card" key={p.title}>
                  <div className="value-card-icon"><Icon name={p.icon as IconName} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
