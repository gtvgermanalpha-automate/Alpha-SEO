import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { CtaBand } from "@/components/CtaBand";
import { blogPosts, blogHref, formatBlogDate } from "@/lib/content";
import { CustomSchema } from "@/components/CustomSchema";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = buildMetadata("/blog", {
  defaultTitle: "News & Blog",
  defaultDescription:
    "Tax, accounting and business insights from MMR Accountants — plain-English guides on limited companies, HMRC, student loans and useful HMRC tools.",
});

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        crumb="Blog"
        title="News & insights"
        subtitle="Plain-English guides and updates on tax, accounting and running a business in the UK — from the team at MMR Accountants."
        illus="growth"
      />

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <BackgroundFX variant="subtle" />
        <Container className="relative">
          <ul className="grid gap-7 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {blogPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={blogHref(p.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-xl hover:shadow-ink/5"
                >
                  {p.image ? (
                    <div className="aspect-[16/9] overflow-hidden border-b border-line bg-blue/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.imageAlt ?? ""}
                        className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      <span className="rounded-full bg-blue px-3 py-1 text-accent">{p.category}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden />
                        <time dateTime={p.date}>{formatBlogDate(p.date)}</time>
                      </span>
                    </div>

                    <h2 className="mt-5 font-display text-lg leading-snug text-ink">{p.title}</h2>
                    <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{p.excerpt}</p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent">
                      Read article
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
      <CustomSchema route="/blog" />
    </>
  );
}
