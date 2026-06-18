/**
 * Per-page metadata builder. Every page calls this so the SEO team's overrides
 * in src/content/seo.json (canonical, robots noindex/nofollow, OG/Twitter
 * title/description/image) flow through automatically.
 *
 * Title/description stay the page's OWN values (so the "%s | MMR Accountants"
 * template still applies); OG/Twitter fall back to them when not overridden.
 * A robots block is emitted ONLY when overriding — Next replaces the robots
 * object per route, so when present it must be complete; when absent the page
 * inherits the root's index/follow.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";
import seoData from "@/content/seo.json";
import type { SeoMap, SeoOverride } from "@/lib/cms/seoSchema";

const seoMap = seoData as SeoMap;

export type BuildMetadataOpts = {
  /** The page's own title. */
  defaultTitle?: string;
  defaultDescription?: string;
  ogType?: "website" | "article";
  /** ISO date — only used when ogType is "article". */
  publishedTime?: string;
  /** Set the title as { absolute } (skip the "%s | brand" template) — for the home page. */
  absoluteTitle?: boolean;
};

export function buildMetadata(route: string, opts: BuildMetadataOpts = {}): Metadata {
  const o: SeoOverride = seoMap[route] ?? {};
  const { defaultTitle, defaultDescription, ogType = "website", publishedTime, absoluteTitle } = opts;

  // Title/description: a per-page override (seo.json) wins over the page's own.
  const effectiveTitle = o.metaTitle?.trim() || defaultTitle;
  const effectiveDescription = o.metaDescription?.trim() || defaultDescription;
  // OG/Twitter fall back to the effective title/description.
  const ogTitle = o.ogTitle?.trim() || effectiveTitle;
  const ogDescription = o.ogDescription?.trim() || effectiveDescription;
  // Default to the site-wide generated OG image (app/opengraph-image.tsx); since
  // a page setting its own openGraph object suppresses that file-convention image,
  // we must re-supply it here. A per-page override wins.
  const ogImage = o.ogImage?.trim() || "/opengraph-image";

  const ogBase = {
    url: `${siteConfig.url}${route === "/" ? "" : route}`,
    siteName: siteConfig.name,
    locale: "en_GB",
    ...(ogTitle ? { title: ogTitle } : {}),
    ...(ogDescription ? { description: ogDescription } : {}),
    ...(ogImage ? { images: [ogImage] } : {}),
  };

  const md: Metadata = {
    alternates: { canonical: o.canonical?.trim() || route },
    openGraph:
      ogType === "article"
        ? { ...ogBase, type: "article", ...(publishedTime ? { publishedTime } : {}) }
        : { ...ogBase, type: "website" },
    twitter: {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };

  if (effectiveTitle !== undefined) md.title = absoluteTitle ? { absolute: effectiveTitle } : effectiveTitle;
  if (effectiveDescription !== undefined) md.description = effectiveDescription;

  if (o.noindex || o.nofollow) {
    const index = !o.noindex;
    const follow = !o.nofollow;
    // Mirror the root's rich-result directives so toggling nofollow on a still-
    // indexable page never strips max-image-preview / max-snippet.
    md.robots = {
      index,
      follow,
      googleBot: { index, follow, "max-image-preview": "large", "max-snippet": -1 },
    };
  }

  return md;
}
