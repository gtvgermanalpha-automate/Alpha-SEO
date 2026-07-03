import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PillarIllustration } from "@/components/ui/PillarIllustration";
import { FaqList } from "@/components/FaqList";
import { CustomSchema } from "@/components/CustomSchema";
import { jsonLd } from "@/lib/jsonLd";
import { siteConfig, services } from "@/lib/content";
import { detailHref, type DetailPage } from "@/lib/detailContent";
import { SECTION_ILLUSTRATIONS } from "@/lib/detailIllustrations";

/** Cadence bullets are written "01 Label — description". */
const STEP_RE = /^(\d{2})\s+([\s\S]*)$/;

/** Scope/deliverable bullets are written "Label — description" (or plain text). */
function splitLabel(text: string): { label: string; desc: string } {
  const i = text.indexOf(" — ");
  return i === -1 ? { label: "", desc: text } : { label: text.slice(0, i), desc: text.slice(i + 3) };
}

/** Shared renderer for a service-pillar detail page — an article-style layout that
 *  renders each section's full prose + bullets (as feature lists or a numbered
 *  cadence), a highlight-chip hero, related links and FAQ. */
export function DetailPageView({ page }: { page: DetailPage }) {
  const url = `${siteConfig.url}${detailHref(page.kind, page.slug)}`;
  const pageIcon = page.icon as IconName;
  const pillarIdx = services.findIndex((s) => s.slug === page.slug);
  const pillarNum = pillarIdx >= 0 ? String(pillarIdx + 1).padStart(2, "0") : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
      { "@type": "ListItem", position: 3, name: page.crumb, item: url },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    serviceType: page.crumb,
    areaServed: ["CA", "US", "GB", "AU"],
    url,
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.contact.phone,
    },
  };

  const faqSchema = page.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const schemas = [breadcrumbSchema, serviceSchema, faqSchema].filter(Boolean);

  return (
    <>
      <section className="page-header service-detail-hero">
        <div className={`container${page.slug === "social-media-marketing" ? " page-header-grid" : ""}`}>
          <div className="page-header-text">
            <Link className="btn-back" href="/services">&#8592; Back to all services</Link>
            <div className="detail-hero-icon"><Icon name={pageIcon} /></div>
            {pillarNum ? <span className="pillar-eyebrow">Pillar {pillarNum} · {page.crumb}</span> : null}
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            {page.highlights.length ? (
              <ul className="detail-chips">
                {page.highlights.map((h) => <li className="detail-chip" key={h}>{h}</li>)}
              </ul>
            ) : null}
          </div>
          {page.slug === "social-media-marketing" ? (
            <div className="page-header-art">
              <PillarIllustration name="social-hero" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container detail-body">
          {page.sections.map((s, i) => {
            const bullets = s.bullets ?? [];
            const isSteps = bullets.some((b) => STEP_RE.test(b));
            const illus = SECTION_ILLUSTRATIONS[page.slug]?.[i];
            return (
              <div className="detail-section-row" data-reveal key={s.heading}>
                <div className="detail-section">
                  <h2>{s.heading}</h2>
                  {s.body.map((para, bi) => <p key={bi}>{para}</p>)}

                  {bullets.length ? (
                    isSteps ? (
                      <ol className="detail-steps">
                        {bullets.map((b) => {
                          const m = b.match(STEP_RE);
                          const num = m ? m[1] : "•";
                          const { label, desc } = splitLabel(m ? m[2] : b);
                          return (
                            <li key={b}>
                              <span className="step-num">{num}</span>
                              <div>{label ? <strong>{label} — </strong> : null}{desc}</div>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <ul className="detail-features">
                        {bullets.map((b) => {
                          const { label, desc } = splitLabel(b);
                          return (
                            <li key={b}>
                              <span className="df-marker" aria-hidden />
                              <div>{label ? <strong>{label} — </strong> : null}{desc}</div>
                            </li>
                          );
                        })}
                      </ul>
                    )
                  ) : null}
                </div>
                {illus ? (
                  <div className="detail-media">
                    <PillarIllustration name={illus} accentIcon={pageIcon} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {page.related.length ? (
        <section className="section section-soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Explore</span>
              <h2>Related services</h2>
            </div>
            <div className="detail-related">
              {page.related.map((r) => (
                <Link key={r.href} href={r.href} className="detail-related-card">
                  <span>{r.label}</span>
                  <span aria-hidden className="detail-related-arrow">&#8594;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.faqs.length ? (
        <section className="section">
          <div className="container container-narrow">
            <div className="section-head">
              <span className="eyebrow">Common questions</span>
              <h2>{page.crumb} FAQ</h2>
            </div>
            <FaqList faqs={page.faqs} />
          </div>
        </section>
      ) : null}

      <CtaBand />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      ))}
      <CustomSchema route={detailHref(page.kind, page.slug)} />
    </>
  );
}
