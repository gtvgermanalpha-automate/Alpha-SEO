import type { Metadata } from "next";
import { LegalPageView } from "@/components/LegalPageView";
import { legalPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = legalPages.find((p) => p.slug === "terms")!;

export const metadata: Metadata = buildMetadata("/terms", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function TermsPage() {
  return <LegalPageView page={page} />;
}
