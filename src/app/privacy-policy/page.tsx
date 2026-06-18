import type { Metadata } from "next";
import { LegalPageView } from "@/components/LegalPageView";
import { legalPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = legalPages.find((p) => p.slug === "privacy-policy")!;

export const metadata: Metadata = buildMetadata("/privacy-policy", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function PrivacyPolicyPage() {
  return <LegalPageView page={page} />;
}
