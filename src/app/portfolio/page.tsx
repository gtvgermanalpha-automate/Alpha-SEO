import type { Metadata } from "next";
import { PortfolioView } from "@/components/PortfolioView";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = buildMetadata("/portfolio", {
  defaultTitle: "Portfolio — Real Work Across Every Service",
  defaultDescription:
    "Explore projects behind each of our five service pillars — technical SEO, content, social media marketing, local SEO and community & AEO.",
});

export default function PortfolioPage() {
  return <PortfolioView />;
}
