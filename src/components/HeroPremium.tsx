import Link from "next/link";
import { copy } from "@/lib/content";

const TRUST = [
  "24h response on every email",
  "1 dedicated point of contact per project",
  "Free initial site audit before you commit",
  "100% pre-approval — you see everything before it ships",
];
const BADGES = ["White-hat only", "Senior-led team", "5-star client-rated", "NDA-ready", "30-day rolling · no lock-in"];

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

/** Home hero — fireball orb (team photo + stepped-rotating ring) + headline,
 *  CTAs, trust strip and credential badges. Ported from the original static site. */
export function HeroPremium() {
  const h = copy.hero;
  return (
    <section className="hero hero-seo">
      <div className="hero-orb" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="hero-orb-disc"><img src="/hero-team.jpg" alt="" /></div>
        <svg className="hero-orb-ring" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <circle cx="100" cy="100" r="97" stroke="rgba(249,133,19,.5)" strokeWidth="1.5" strokeDasharray="1.5 11" />
          <circle cx="100" cy="3" r="4.5" fill="#f98513" />
          <circle cx="197" cy="100" r="3" fill="#fba04d" />
          <circle cx="100" cy="197" r="3" fill="#fba04d" />
          <circle cx="3" cy="100" r="3" fill="#fba04d" />
        </svg>
      </div>
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <h1>{h.headlineLead} <span className="highlight">{h.headlineAccent}</span></h1>
            <p className="lead">{h.paragraph}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/services">{h.primaryCta}</Link>
              <Link className="btn btn-ghost" href="/case-studies">{h.secondaryCta}</Link>
            </div>
            <Link href="/contact" className="hero-audit-link">
              Or get a free SEO audit
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <div className="hero-trust">
              {TRUST.map((t) => (
                <div className="hero-trust-item" key={t}><Check /><span>{t}</span></div>
              ))}
            </div>
            <div className="hero-badges">
              {BADGES.map((b) => (
                <span className="hero-badge" key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
