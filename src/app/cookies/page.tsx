import type { Metadata } from "next";
import { LegalPageView } from "@/components/LegalPageView";
import { legalPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = legalPages.find((p) => p.slug === "cookies")!;

export const metadata: Metadata = buildMetadata("/cookies", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function CookiesPage() {
  return <LegalPageView page={page} />;
}
