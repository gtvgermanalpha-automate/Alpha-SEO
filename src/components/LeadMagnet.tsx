import { AuditForm } from "@/components/AuditForm";

const PERKS = [
  "200+ point technical & on-page diagnostic",
  "Competitor gap analysis on three rivals",
  "Prioritised 90-day action roadmap",
  "No sales pitch, no commitment",
];

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

/** Lead-magnet band — a free-audit pitch + request form. Ported from the
 *  original static site (.lead-magnet). */
export function LeadMagnet() {
  return (
    <section className="lead-magnet">
      <div className="container">
        <div className="lm-grid">
          <div className="lm-text">
            <span className="eyebrow">Free · senior-led · 48-hour turnaround</span>
            <h2>Get a comprehensive SEO audit of your domain</h2>
            <p className="lead">
              A senior strategist reviews your technical health, on-page architecture, content depth, link
              profile and competitor positioning — then sends back a prioritised report with the
              highest-impact moves for the next 90 days.
            </p>
            <div className="lm-perks">
              {PERKS.map((p) => (
                <div className="lm-perk" key={p}><Check /><span>{p}</span></div>
              ))}
            </div>
          </div>
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
