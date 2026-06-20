import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Md } from "@/components/ArticleBody";
import { CustomSchema } from "@/components/CustomSchema";
import { siteConfig, caseStudyHref, type CaseStudy } from "@/lib/content";
import { jsonLd } from "@/lib/jsonLd";

/** Split a "Label: value" result into a highlight chip (value is the big number). */
function splitResult(r: string): { num: string; label: string } {
  const idx = r.indexOf(":");
  if (idx === -1) return { num: r.trim(), label: "" };
  return { label: r.slice(0, idx).trim(), num: r.slice(idx + 1).trim() };
}

/** Single case-study page. Ported from the original static site
 *  (.article-page-header + article-hero + highlights + article-body). */
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
      <section className="page-header article-page-header">
        <div className="container">
          <Link className="btn-back" href="/case-studies">&#8592; Back to case studies</Link>
          <span className="eyebrow">{study.industry}</span>
          <h1>{study.title}</h1>
          <div className="article-meta">
            <span>Client: {study.client}</span>
            {study.date ? <span>{study.date}</span> : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container-article">
          {study.image ? (
            <div className="article-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={study.image} alt={study.imageAlt ?? ""} loading="lazy" />
            </div>
          ) : null}

          {study.results.length ? (
            <div className="project-detail-highlights">
              {study.results.slice(0, 3).map((r, i) => {
                const { num, label } = splitResult(r);
                return (
                  <div className="highlight-chip" key={i}>
                    <span className="highlight-chip-value">{num}</span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="article-body">
            <Md>{study.body.join("\n\n")}</Md>
          </div>

          <div className="article-back-footer">
            <Link className="btn btn-primary" href="/case-studies">&#8592; Back to case studies</Link>
          </div>
        </div>
      </section>

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <CustomSchema route={caseStudyHref(study.slug)} />
    </>
  );
}
