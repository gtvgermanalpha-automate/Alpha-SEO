import Link from "next/link";
import { caseStudyHref, type CaseStudy } from "@/lib/content";

/** Split a "Label: value" result string into a mini-stat (value is the big number). */
function toStat(result: string): { num: string; label: string } {
  const idx = result.indexOf(":");
  if (idx === -1) return { num: result.trim(), label: "" };
  return { label: result.slice(0, idx).trim(), num: result.slice(idx + 1).trim() };
}

/** Featured case-study card — image + navy gradient overlay, title, industry tag
 *  and two outcome stats. Ported from the original static site
 *  (.work-card.case-detailed). Shared by the home "Selected work" strip and the
 *  /case-studies list. */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const stats = study.results.slice(0, 2).map(toStat);
  return (
    <Link href={caseStudyHref(study.slug)} className="work-card case-detailed">
      {/* Background photo removed for now (owner will upload new ones) — the card
          shows its aster base + gradient. To restore: add back a
          <div className="work-image"><img src={study.image} … /></div> here. */}
      <div className="work-meta">
        <div className="work-meta-head">
          <h3>{study.title}</h3>
          <span className="work-tag">{study.industry}</span>
        </div>
        <div className="case-mini-stats">
          {stats.map((s, i) => (
            <div className="mini-stat" key={i}>
              <span className="ms-num">{s.num}</span>
              <span className="ms-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
