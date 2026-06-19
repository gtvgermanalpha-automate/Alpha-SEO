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
  bookkeeping: "BookOpen",
  "tax-planning": "Receipt",
  vat: "Percent",
  payroll: "Users",
  "company-formation": "Building2",
  advisory: "TrendingUp",
  contractors: "Laptop",
  ecommerce: "ShoppingCart",
  startups: "Rocket",
  landlords: "Home",
  hospitality: "UtensilsCrossed",
  healthcare: "Stethoscope",
  construction: "HardHat",
  creative: "Palette",
  "proactive-tax-planning": "Receipt",
  "advisory-partnership": "LineChart",
};

/** Concise breadcrumb / related-card label per slug (the long SEO H1 stays in `title`). */
const SHORT_LABEL: Record<string, string> = {
  bookkeeping: "Bookkeeping & Accounts",
  "tax-planning": "Tax Planning & Returns",
  vat: "VAT & Making Tax Digital",
  payroll: "Payroll & Pensions",
  "company-formation": "Company Formation",
  advisory: "Business Advisory",
  contractors: "Contractors & Freelancers",
  ecommerce: "E-commerce & Retail",
  startups: "Startups & Tech",
  landlords: "Landlords & Property",
  hospitality: "Hospitality",
  healthcare: "Healthcare & Locums",
  construction: "Construction & CIS",
  creative: "Creative & Agencies",
  "proactive-tax-planning": "Proactive Tax Planning",
  "advisory-partnership": "Advisory & Growth",
};

/** Internal links per page (SEO + navigation). Hrefs resolve to real detail pages. */
const RELATED: Record<string, string[]> = {
  bookkeeping: ["/services/vat", "/services/tax-planning"],
  "tax-planning": ["/services/vat", "/services/advisory", "/how-we-help/proactive-tax-planning"],
  vat: ["/services/bookkeeping", "/industries/construction", "/industries/ecommerce"],
  payroll: ["/services/bookkeeping", "/industries/hospitality", "/industries/construction"],
  "company-formation": ["/services/bookkeeping", "/services/tax-planning", "/industries/startups"],
  advisory: ["/services/tax-planning", "/how-we-help/advisory-partnership", "/industries/startups"],
  contractors: ["/services/tax-planning", "/services/company-formation", "/services/payroll"],
  ecommerce: ["/services/vat", "/services/bookkeeping", "/services/advisory"],
  startups: ["/services/advisory", "/services/company-formation", "/services/tax-planning"],
  landlords: ["/services/tax-planning", "/how-we-help/proactive-tax-planning", "/services/advisory"],
  hospitality: ["/services/payroll", "/services/vat", "/services/bookkeeping"],
  healthcare: ["/services/tax-planning", "/services/payroll", "/services/company-formation"],
  construction: ["/services/vat", "/services/payroll", "/services/tax-planning"],
  creative: ["/services/advisory", "/services/tax-planning", "/services/vat"],
  "proactive-tax-planning": ["/services/tax-planning", "/services/vat", "/services/advisory"],
  "advisory-partnership": ["/services/advisory", "/services/tax-planning", "/industries/startups"],
};

/** slug → concise label, used to label related links by their href. */
const labelBySlug = SHORT_LABEL;
const slugFromHref = (href: string) => href.split("/").pop() ?? href;

/** Drop any trailing " | MMR" / " | MMR Accountants" — layout's title template
 *  appends " | MMR Accountants" once, so the JSON suffix would double it up. */
const stripBrand = (t: string) => t.replace(/\s*\|\s*MMR(?:\s+Accountants)?\s*$/i, "").trim();

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
