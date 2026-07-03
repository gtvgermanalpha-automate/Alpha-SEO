import type { Metadata } from "next";
import { SocialPortfolioView } from "@/components/SocialPortfolioView";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = buildMetadata("/portfolio/social-media-marketing", {
  defaultTitle: "Social Media Marketing Portfolio",
  defaultDescription:
    "Selected social media and brand design projects: cohesive Instagram grids, on-brand content and communities built from the ground up.",
});

export default function SocialMediaPortfolioPage() {
  return <SocialPortfolioView />;
}
