import type { PillarIllustName } from "@/components/ui/PillarIllustration";

/**
 * One bespoke illustration per service-detail section, in section order.
 * "roadmap"/"report" are shared cadence/deliverables scenes (badged with the
 * pillar's own icon in DetailPageView) — every other name is unique to its point.
 */
export const SECTION_ILLUSTRATIONS: Record<string, PillarIllustName[]> = {
  "technical-seo": ["audit", "engineering-layers", "roadmap", "report"],
  "on-page-seo": ["reader-doc", "fork-path", "content-map", "roadmap", "report"],
  "social-media-marketing": ["social-grid", "content-calendar", "engagement-bubbles", "report"],
  "local-seo": ["map-pins", "storefront-profile", "roadmap", "report"],
  "reddit-community": ["community-network", "ai-citation", "roadmap", "report"],
};
