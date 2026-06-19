import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { CtaBand } from "@/components/CtaBand";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { CustomSchema } from "@/components/CustomSchema";
import { siteConfig, caseStudyHref, type CaseStudy } from "@/lib/content";
import { jsonLd } from "@/lib/jsonLd";

const PARENT = { label: "Case Studies", href: "/case-studies" };

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const url = `${siteConfig.url}${caseStudyHref(study.slug)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteConfig.url}/case-studies` },
      { "@type": "ListItem", position: 3, name: study.title, item: url },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.metaDescription,
    ...(study.date ? { datePublished: study.date, dateModified: study.date } : {}),
    articleSection: study.industry,
    ...(study.image ? { image: study.image.startsWith("http") ? study.image : `${siteConfig.url}${study.image}` } : {}),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.contact.phone,
      ...(siteConfig.logoLinear ? { logo: { "@type": "ImageObject", url: `${siteConfig.url}${siteConfig.logoLinear}` } } : {}),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <>
      <PageHero crumb={study.title} parent={PARENT} title={study.title} subtitle={study.summary} />

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <BackgroundFX variant="subtle" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span>
                Client: <span className="text-ink">{study.client}</span>
              </span>
              <span>
                Industry: <span className="text-ink">{study.industry}</span>
              </span>
            </div>

            {study.image ? (
              <figure className="mt-8 aspect-[16/8] overflow-hidden rounded-2xl border border-line bg-blue/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={study.image} alt={study.imageAlt ?? ""} className="h-full w-full object-contain p-8 sm:p-10" />
              </figure>
            ) : null}

            {study.results.length ? (
              <div className="mt-8 rounded-2xl border border-line bg-cream/50 p-6 sm:p-7">
                <h2 className="font-display text-lg text-ink">Results</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {study.results.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={3} aria-hidden />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {study.body.length ? <MarkdownContent className="mt-10">{study.body.join("\n\n")}</MarkdownContent> : null}

            <div className="mt-12">
              <Link
                href={PARENT.href}
                className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
                All case studies
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <CustomSchema route={caseStudyHref(study.slug)} />
    </>
  );
}
