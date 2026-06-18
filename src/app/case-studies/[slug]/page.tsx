import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/CaseStudyView";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { caseStudies, findCaseStudy } from "@/lib/content";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (!study) return {};
  return buildMetadata(`/case-studies/${slug}`, {
    defaultTitle: study.metaTitle,
    defaultDescription: study.metaDescription,
    ogType: "article",
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyView study={study} />;
}
