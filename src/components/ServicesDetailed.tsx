import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { services } from "@/lib/content";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

/** Services list — the five SEO pillars, each linking to its detail page.
 *  Ported from the original static site (.services-list / .service-list-card). */
export function ServicesDetailed() {
  return (
    <section className="section">
      <div className="container">
        <div className="services-list">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="service-list-card" id={s.slug}>
              <div className="slc-icon"><Icon name={s.icon as IconName} /></div>
              <div className="slc-content">
                <span className="slc-pillar">Pillar {String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <div className="slc-tags">
                  {s.points.slice(0, 4).map((p) => <span key={p}>{p}</span>)}
                </div>
              </div>
              <div className="slc-cta"><span>View full service</span><Arrow /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
