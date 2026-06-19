import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { CtaBand } from "@/components/CtaBand";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { CustomSchema } from "@/components/CustomSchema";
import { caseStudies, caseStudyHref } from "@/lib/content";

export const metadata: Metadata = buildMetadata("/case-studies", {
  defaultTitle: "Case Studies",
  defaultDescription:
    "Measurable SEO outcomes across SaaS, ecommerce, fintech and local services — migrations, technical recoveries, authority and content programmes.",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        crumb="Case Studies"
        title="Measurable SEO outcomes, documented"
        subtitle="A cross-section of engagements across SaaS, ecommerce, fintech, publishing and local services — numbers verified by our clients' analytics, not ours."
        illus="growth"
      />

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <BackgroundFX variant="subtle" />
        <Container className="relative">
          <ul className="grid gap-7 md:grid-cols-2" data-reveal-stagger>
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link
                  href={caseStudyHref(c.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-xl hover:shadow-ink/5"
                >
                  {c.image ? (
                    <div className="aspect-[16/9] overflow-hidden border-b border-line bg-blue/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image}
                        alt={c.imageAlt ?? ""}
                        className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-7">
                    <span className="self-start rounded-full bg-blue px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      {c.industry}
                    </span>
                    <h2 className="mt-4 font-display text-lg leading-snug text-ink">{c.title}</h2>
                    <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{c.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent">
                      Read case study
                      <ArrowRight
                        className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
      <CustomSchema route="/case-studies" />
    </>
  );
}
