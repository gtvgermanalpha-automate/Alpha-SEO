"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useTapActivate } from "@/components/ui/useTapActivate";
import { copy, partners } from "@/lib/content";

function PartnerBadge({ name }: { name: string }) {
  const { active, bind } = useTapActivate();
  return (
    <li
      {...bind}
      className={`flex items-center justify-center gap-2.5 border bg-white px-4 py-5 transition-all duration-300 ${
        active ? "-translate-y-0.5 border-accent/40 shadow-sm" : "border-line"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 bg-accent transition-transform duration-300 ${active ? "scale-150" : ""}`}
        aria-hidden
      />
      <span
        className={`font-display text-lg font-extrabold tracking-tight transition-colors duration-300 ${
          active ? "text-ink" : "text-ink/75"
        }`}
      >
        {name}
      </span>
    </li>
  );
}

export function TrustedBy() {
  return (
    <section
      id="trusted"
      className="relative scroll-mt-24 border-y border-line bg-blue py-14 sm:py-16"
      aria-label="Accreditations and integrations"
    >
      <Container>
        <Reveal className="text-center">
          <p className="eyebrow text-muted">{copy.trustedBy.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {partners.map((p) => (
              <PartnerBadge key={p} name={p} />
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
