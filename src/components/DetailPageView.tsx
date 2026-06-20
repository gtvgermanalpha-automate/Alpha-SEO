import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { FaqList } from "@/components/FaqList";
import { CustomSchema } from "@/components/CustomSchema";
import { jsonLd } from "@/lib/jsonLd";
import { siteConfig, services } from "@/lib/content";
import { detailHref, type DetailPage } from "@/lib/detailContent";

/** Pick a relevant icon for a content card from its heading keywords, so the
 *  grid reads with a distinct icon per card rather than a wall of prose. */
const ICON_RULES: [RegExp, IconName][] = [
  [/deliver|receive|report|dashboard|document/, "LineChart"],
  [/cadence|engagement|sprint|how it works|how we|process/, "Zap"],
  [/crawl|index|render|schema|architecture|performance|core web|technical/, "Settings2"],
  [/content|on-page|keyword|topical|metadata|reader|write|brief|snippet/, "BookOpen"],
  [/link|authority|backlink|digital pr|outreach|domain|vouch|mention/, "Award"],
  [/local|map|citation|google business|gbp|region|near/, "MapPin"],
  [/community|reddit|forum|quora|aeo|answer|cite|citation/, "MessagesSquare"],
  [/cover|included|layer|channel|area|scope|audit/, "ShieldCheck"],
  [/strateg|grow|scal|result|outcome|engine/, "TrendingUp"],
];

function sectionIcon(heading: string, fallback: IconName): IconName {
  const h = heading.toLowerCase();
  for (const [re, name] of ICON_RULES) if (re.test(h)) return name;
  return fallback;
}

/** Shared renderer for a service-pillar detail page. Ported from the original
 *  static site (.service-detail-hero + features-deep-grid + deliverables + FAQ). */
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
        <div className="container">
          <Link className="btn-back" href="/services">&#8592; Back to all services</Link>
          {pillarNum ? <span className="pillar-eyebrow">Pillar {pillarNum}</span> : null}
          <span className="eyebrow">{page.crumb}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{page.eyebrow}</span>
            <h2>What&apos;s included</h2>
          </div>
          <div className="features-deep-grid">
            {page.sections.map((s) => (
              <div className="feature-deep" key={s.heading}>
                <div className="feature-deep-icon"><Icon name={sectionIcon(s.heading, pageIcon)} /></div>
                <h4>{s.heading}</h4>
                <p>{s.body[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.highlights.length ? (
        <section className="section">
          <div className="container container-narrow">
            <div className="section-head">
              <span className="eyebrow">What you receive</span>
              <h2>Concrete deliverables</h2>
            </div>
            <ul className="deliverables-list">
              {page.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </section>
      ) : null}

      {page.related.length ? (
        <section className="section section-soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Explore</span>
              <h2>Related services</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {page.related.map((r) => (
                <Link key={r.href} href={r.href} className="btn btn-ghost">{r.label}</Link>
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
