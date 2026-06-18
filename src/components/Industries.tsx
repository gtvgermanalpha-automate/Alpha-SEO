"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { copy, industries } from "@/lib/content";

export function Industries() {
  return (
    <section id="industries" className="relative scroll-mt-24 border-b border-line bg-blue py-20 sm:py-28">
      <Container>
        <SectionHeading {...copy.industries.heading} />

        <ul data-reveal-stagger className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <li id={industry.slug} key={industry.title} className="scroll-mt-28">
              <InteractiveCard className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6">
                {(active) => (
                  <>
                    <ArrowUpRight
                      className={`absolute right-5 top-5 h-5 w-5 transition-colors duration-300 ${
                        active ? "text-accent" : "text-line"
                      }`}
                      aria-hidden
                    />
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-xl transition-all duration-300 ${
                        active ? "scale-105 bg-ink text-white" : "bg-blue text-accent"
                      }`}
                    >
                      <Icon name={industry.icon as IconName} className="h-6 w-6" strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base text-ink">{industry.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{industry.description}</p>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className={`mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                        active ? "text-accent" : "text-ink hover:text-accent"
                      }`}
                    >
                      Learn more
                      <ArrowRight
                        className={`h-3 w-3 text-accent transition-transform duration-300 ${active ? "translate-x-1" : ""}`}
                        aria-hidden
                      />
                    </Link>
                  </>
                )}
              </InteractiveCard>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
