/**
 * SEO target registry — every indexable route the CMS can manage, with a
 * friendly label, its group, and the page's *current* default title/description
 * (used for the live Google-result preview in the SEO editor and as OG fallbacks).
 *
 * Derived from the same content exports `sitemap.ts` uses, so it stays in sync
 * automatically. `seoRouteSet` lets `validateSeo` reject overrides for unknown
 * routes (a typo can't create a dead entry).
 */
import {
  siteConfig,
  copy,
  allDetailPages,
  blogPosts,
  legalPages,
  detailHref,
  blogHref,
  caseStudies,
  caseStudyHref,
  type DetailPage,
} from "@/lib/content";

export type SeoTarget = {
  route: string;
  label: string;
  group: string;
  /** Brand-suffixed SERP title as Google would show it (for the preview). */
  defaultTitle: string;
  defaultDescription: string;
  /** The content editor for this route, if one exists (else SEO-only). */
  editorHref: string | null;
};

/** Title template applied site-wide ("%s | MMR Accountants"). */
export const brandTitle = (t: string) => `${t} | ${siteConfig.name}`;

/** Which list-collection file a detail page's content lives in (for editor deep-links). */
export function detailFileFor(_p: DetailPage): string {
  return "services";
}

const GROUP_BY_KIND: Record<DetailPage["kind"], string> = {
  service: "Services",
};

// Static-page defaults. Copy-page values come from copy.json; the three pages
// whose metadata is inline in their page file (/, /how-we-help, /blog) mirror it here.
const staticTargets: SeoTarget[] = [
  {
    route: "/",
    label: "Home",
    group: "Pages",
    defaultTitle: `${siteConfig.name} — Chartered Accountants for UK Businesses`,
    defaultDescription: siteConfig.description,
    editorHref: "/admin/copy",
  },
  { route: "/services", label: "Services", group: "Pages", defaultTitle: brandTitle(copy.pages.services.metaTitle), defaultDescription: copy.pages.services.metaDescription, editorHref: "/admin/copy" },
  { route: "/how-we-work", label: "How We Work", group: "Pages", defaultTitle: brandTitle(copy.pages.howWeWork.metaTitle), defaultDescription: copy.pages.howWeWork.metaDescription, editorHref: "/admin/copy" },
  {
    route: "/blog",
    label: "News & Blog",
    group: "Pages",
    defaultTitle: brandTitle("News & Blog"),
    defaultDescription:
      "Tax, accounting and business insights from MMR Accountants — plain-English guides on limited companies, HMRC, student loans and useful HMRC tools.",
    editorHref: null,
  },
  {
    route: "/case-studies",
    label: "Case Studies",
    group: "Pages",
    defaultTitle: brandTitle("Case Studies"),
    defaultDescription:
      "Real results for UK businesses — see how MMR Accountants has helped clients save tax, stay compliant and grow.",
    editorHref: null,
  },
  {
    route: "/team",
    label: "Team",
    group: "Pages",
    defaultTitle: brandTitle("Team"),
    defaultDescription: "Meet the chartered-standard accountants and advisers behind MMR Accountants.",
    editorHref: "/admin/team",
  },
  { route: "/faq", label: "FAQ", group: "Pages", defaultTitle: brandTitle(copy.pages.faq.metaTitle), defaultDescription: copy.pages.faq.metaDescription, editorHref: "/admin/copy" },
  { route: "/contact", label: "Contact", group: "Pages", defaultTitle: brandTitle(copy.pages.contact.metaTitle), defaultDescription: copy.pages.contact.metaDescription, editorHref: "/admin/copy" },
];

const detailTargets: SeoTarget[] = allDetailPages.map((p) => ({
  route: detailHref(p.kind, p.slug),
  label: p.crumb,
  group: GROUP_BY_KIND[p.kind],
  defaultTitle: brandTitle(p.metaTitle),
  defaultDescription: p.metaDescription,
  editorHref: `/admin/edit/${detailFileFor(p)}/${p.slug}`,
}));

const blogTargets: SeoTarget[] = blogPosts.map((post) => ({
  route: blogHref(post.slug),
  label: post.title,
  group: "Blog",
  defaultTitle: brandTitle(post.metaTitle),
  defaultDescription: post.metaDescription,
  editorHref: `/admin/edit/blog/${post.slug}`,
}));

const caseStudyTargets: SeoTarget[] = caseStudies.map((c) => ({
  route: caseStudyHref(c.slug),
  label: c.title,
  group: "Case studies",
  defaultTitle: brandTitle(c.metaTitle),
  defaultDescription: c.metaDescription,
  editorHref: `/admin/edit/case-studies/${c.slug}`,
}));

const legalTargets: SeoTarget[] = legalPages.map((page) => ({
  route: `/${page.slug}`,
  label: page.crumb,
  group: "Legal",
  defaultTitle: brandTitle(page.metaTitle),
  defaultDescription: page.metaDescription,
  editorHref: "/admin/legal",
}));

export const seoTargets: SeoTarget[] = [
  ...staticTargets,
  ...detailTargets,
  ...caseStudyTargets,
  ...blogTargets,
  ...legalTargets,
];

export const seoRouteSet: Set<string> = new Set(seoTargets.map((t) => t.route));

export const seoTargetByRoute: Record<string, SeoTarget> = Object.fromEntries(
  seoTargets.map((t) => [t.route, t]),
);
