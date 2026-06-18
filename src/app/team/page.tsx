import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { CtaBand } from "@/components/CtaBand";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { CustomSchema } from "@/components/CustomSchema";
import { team } from "@/lib/content";

export const metadata: Metadata = buildMetadata("/team", {
  defaultTitle: "Team",
  defaultDescription: "Meet the chartered-standard accountants and advisers behind MMR Accountants.",
});

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamPage() {
  return (
    <>
      <PageHero crumb="Team" title={team.heading} subtitle={team.intro} illus="advisory" />

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <BackgroundFX variant="subtle" />
        <Container className="relative">
          <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {team.members.map((m, i) => (
              <li
                key={`${m.name}-${i}`}
                className="flex flex-col items-center rounded-2xl border border-line bg-white p-7 text-center shadow-sm shadow-ink/[0.02]"
              >
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image}
                    alt={m.imageAlt || m.name}
                    className="h-24 w-24 rounded-full border border-line object-cover"
                  />
                ) : (
                  <span className="grid h-24 w-24 place-items-center rounded-full bg-blue font-display text-2xl font-bold text-accent">
                    {initials(m.name)}
                  </span>
                )}
                <h2 className="mt-5 font-display text-lg text-ink">{m.name}</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{m.role}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{m.bio}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
      <CustomSchema route="/team" />
    </>
  );
}
