import type { Metadata } from "next";
import { PortfolioView } from "@/components/PortfolioView";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = buildMetadata("/portfolio", {
  defaultTitle: "Portfolio — Social & Brand Design Work",
  defaultDescription:
    "Selected social media and brand design projects: cohesive Instagram grids, on-brand content and communities built from the ground up.",
});

export default function PortfolioPage() {
  return <PortfolioView />;
}
