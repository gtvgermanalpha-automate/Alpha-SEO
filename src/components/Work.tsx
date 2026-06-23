import Link from "next/link";
import { caseStudies } from "@/lib/content";
import { CaseStudyCard } from "@/components/CaseStudyCard";

/** Home "Selected work" preview — three featured case studies in the work grid.
 *  Ported from the original static site. */
export function Work() {
  const featured = caseStudies.slice(0, 3);
  return (
    <section className="section section-soft" id="work">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Selected work</span>
          <h2>Measurable outcomes, <span className="highlight">documented</span>.</h2>
        </div>
        <div className="work-grid">
          {featured.map((c) => (
            <CaseStudyCard key={c.slug} study={c} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.25rem" }}>
          <Link className="btn btn-ghost" href="/case-studies">View all case studies</Link>
        </div>
      </div>
    </section>
  );
}
