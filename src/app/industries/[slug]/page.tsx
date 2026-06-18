import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPageView } from "@/components/DetailPageView";
import { industryPages, findDetailPage } from "@/lib/detailContent";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export function generateStaticParams() {
  return industryPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findDetailPage("industry", slug);
  if (!page) return {};
  return buildMetadata(`/industries/${slug}`, {
    defaultTitle: page.metaTitle,
    defaultDescription: page.metaDescription,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findDetailPage("industry", slug);
  if (!page) notFound();
  return <DetailPageView page={page} />;
}
