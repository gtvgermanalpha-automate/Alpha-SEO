import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { CtaBand } from "@/components/CtaBand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { approachPages, detailHref } from "@/lib/detailContent";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = buildMetadata("/how-we-help", {
  defaultTitle: "How We Help",
  defaultDescription:
    "More than compliance — proactive tax planning, cloud-first accounting and an advisory partnership that turns your numbers into confident decisions.",
});

export default function HowWeHelpPage() {
  return (
    <>
      <PageHero
        crumb="How we help"
        title="More than compliance — a partner in your growth"
        subtitle="Filing on time is the bare minimum. We plan ahead, keep your numbers live, and turn them into advice that actually moves the needle. Here is how we help."
        illus="growth"
      />
      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <BackgroundFX variant="subtle" />
        <Container className="relative">
          <ul className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2" data-reveal-stagger>
            {approachPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={detailHref(p.kind, p.slug)}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-xl hover:shadow-ink/5"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-cream text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-ink group-hover:text-white">
                    <Icon name={p.icon as IconName} className="h-6 w-6" strokeWidth={1.8} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-lg text-ink">{p.crumb}</h2>
                  <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-muted">{p.intro}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
