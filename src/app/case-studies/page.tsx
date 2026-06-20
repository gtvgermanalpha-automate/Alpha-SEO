import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CtaBand } from "@/components/CtaBand";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { CustomSchema } from "@/components/CustomSchema";
import { caseStudies } from "@/lib/content";

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
        title={<>Measurable SEO outcomes, <span className="highlight">documented</span>.</>}
        subtitle="A cross-section of engagements across SaaS, ecommerce, fintech, publishing and local services — numbers verified by our clients' analytics, not ours."
      />

      <section className="section">
        <div className="container">
          <div className="work-grid">
            {caseStudies.map((c) => (
              <CaseStudyCard key={c.slug} study={c} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
      <CustomSchema route="/case-studies" />
    </>
  );
}
