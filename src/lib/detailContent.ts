/**
 * Detail-page content for Services, Industries and "How we help".
 *
 * The editable copy lives in the JSON files under `src/content/*.json` (so the
 * client — or a future CMS — can edit prose without touching code). This module
 * imports that copy and attaches the structural bits the app needs (kind, icon,
 * breadcrumb label, internal links). Re-exported from `@/lib/content`.
 */
import servicesRaw from "@/content/services.json";
import type { DetailFaq, DetailSection, RawDetail } from "./detailSchema";

// The editable shape (RawDetail) and its validators now live in ./detailSchema
// so the CMS can validate saves against the same contract. Re-exported here to
// keep `@/lib/content` the single import surface for the rest of the app.
export type { DetailFaq, DetailSection } from "./detailSchema";
export type DetailKind = "service";

export type RelatedLink = { label: string; href: string };

export type DetailPage = RawDetail & {
  kind: DetailKind;
  icon: string;
  /** Concise label for breadcrumbs and related-link cards. */
  crumb: string;
  related: RelatedLink[];
  updated: string;
};

const UPDATED = "Last reviewed: June 2026";

/** URL segment per kind. */
const SEGMENT: Record<DetailKind, string> = {
  service: "services",
};

export const detailHref = (kind: DetailKind, slug: string) => `/${SEGMENT[kind]}/${slug}`;

/** Lucide icon name per slug (all present in ui/Icon.tsx). */
const ICONS: Record<string, string> = {
  "technical-seo": "Settings2",
  "on-page-seo": "BookOpen",
  "off-page-seo": "Award",
  "local-seo": "MapPin",
  "reddit-community": "MessagesSquare",
};

/** Concise breadcrumb / related-card label per slug (the long SEO H1 stays in `title`). */
const SHORT_LABEL: Record<string, string> = {
  "technical-seo": "Technical SEO",
  "on-page-seo": "On-Page SEO",
  "off-page-seo": "Off-Page SEO",
  "local-seo": "Local SEO",
  "reddit-community": "Community & AEO",
};

/** Internal links per page (SEO + navigation). Hrefs resolve to real detail pages. */
const RELATED: Record<string, string[]> = {
  "technical-seo": ["/services/on-page-seo", "/services/off-page-seo"],
  "on-page-seo": ["/services/technical-seo", "/services/off-page-seo"],
  "off-page-seo": ["/services/on-page-seo", "/services/reddit-community"],
  "local-seo": ["/services/technical-seo", "/services/on-page-seo"],
  "reddit-community": ["/services/off-page-seo", "/services/on-page-seo"],
};

/** slug → concise label, used to label related links by their href. */
const labelBySlug = SHORT_LABEL;
const slugFromHref = (href: string) => href.split("/").pop() ?? href;

/** Drop any trailing " | Alpha" / " | Alpha Digital Solutions" — layout's title
 *  template appends " | Alpha Digital Solutions" once, so a JSON suffix doubles up. */
const stripBrand = (t: string) => t.replace(/\s*\|\s*Alpha(?:\s+Digital\s+Solutions)?\s*$/i, "").trim();

function build(raw: RawDetail[], kind: DetailKind): DetailPage[] {
  return raw.map((r) => ({
    ...r,
    metaTitle: stripBrand(r.metaTitle),
    kind,
    icon: ICONS[r.slug] ?? "Sparkles",
    crumb: SHORT_LABEL[r.slug] ?? r.title,
    updated: UPDATED,
    related: (RELATED[r.slug] ?? []).map((href) => ({
      href,
      label: labelBySlug[slugFromHref(href)] ?? href,
    })),
  }));
}

export const servicePages: DetailPage[] = build(servicesRaw as unknown as RawDetail[], "service");

export const allDetailPages: DetailPage[] = [...servicePages];

export function findDetailPage(kind: DetailKind, slug: string): DetailPage | undefined {
  return allDetailPages.find((p) => p.kind === kind && p.slug === slug);
}
