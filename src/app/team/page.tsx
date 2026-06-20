import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { CustomSchema } from "@/components/CustomSchema";
import { Icon, type IconName } from "@/components/ui/Icon";
import { team } from "@/lib/content";

export const metadata: Metadata = buildMetadata("/team", {
  defaultTitle: "About Alpha",
  defaultDescription:
    "A senior-led, white-hat SEO agency in Toronto — humble, results-over-hype, NDA-ready, with a 30-day rolling commitment and no lock-in.",
});

const GUARANTEES = [
  "A dedicated lead from start to finish",
  "Pre-approval on every change before it ships",
  "24-hour response on every email",
  "30-day cancellation — no long contracts",
  "White-hat tactics only — every move defensible",
  "NDA-ready from day one",
];

const DISCIPLINE_ICONS: IconName[] = ["Settings2", "BookOpen", "Award", "MapPin", "MessagesSquare", "TrendingUp"];

export default function TeamPage() {
  return (
    <>
      <PageHero crumb="About" title={team.heading} subtitle={team.intro} image="/hero-team.jpg" imageAlt="The Alpha Digital Solutions team at work" />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How we&apos;re set up</span>
            <h2>Senior-led, by <span className="highlight">discipline</span></h2>
          </div>
          <div className="values-grid values-grid-4">
            {team.members.map((m, i) => (
              <div className="value-card" key={`${m.name}-${i}`}>
                <div className="value-card-icon"><Icon name={DISCIPLINE_ICONS[i % DISCIPLINE_ICONS.length]} /></div>
                {m.role ? <span className="slc-pillar">{m.role}</span> : null}
                <h3>{m.name}</h3>
                <p>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">No surprises</span>
            <h2>What you&apos;ll <span className="highlight">always get</span></h2>
          </div>
          <ul className="deliverables-list">
            {GUARANTEES.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </section>

      <CtaBand />
      <CustomSchema route="/team" />
    </>
  );
}
