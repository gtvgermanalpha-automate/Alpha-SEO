"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { copy, services } from "@/lib/content";

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 border-b border-line bg-blue py-20 sm:py-28">
      <Container>
        <SectionHeading {...copy.services.heading} />

        <ul data-reveal-stagger className="mt-16 flex flex-wrap justify-center gap-6">
          {services.map((service) => (
            <li
              id={service.slug}
              key={service.title}
              className="w-full scroll-mt-28 sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)]"
            >
              <InteractiveCard className="flex h-full flex-col rounded-2xl border border-line bg-white p-7">
                {(active) => (
                  <>
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-xl transition-all duration-300 ${
                        active ? "scale-105 bg-ink text-white" : "bg-blue text-accent"
                      }`}
                    >
                      <Icon name={service.icon as IconName} className="h-7 w-7" strokeWidth={1.8} aria-hidden />
                    </span>

                    <h3 className="mt-6 text-xl text-ink">{service.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{service.description}</p>

                    <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-line pt-5">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-ink/80">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-50 text-accent">
                            <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className={`mt-6 inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                        active ? "text-accent" : "text-ink hover:text-accent"
                      }`}
                    >
                      Learn more
                      <ArrowRight
                        className={`h-3.5 w-3.5 text-accent transition-transform duration-300 ${active ? "translate-x-1" : ""}`}
                        aria-hidden
                      />
                    </Link>
                  </>
                )}
              </InteractiveCard>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="text-muted">{copy.services.ctaText}</p>
          <ButtonLink href="/contact" variant="primary" withArrow>
            {copy.services.ctaButton}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
