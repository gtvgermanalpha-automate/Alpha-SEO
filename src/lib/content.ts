/**
 * Central content + configuration for the MMR Accountants site.
 * Keeping copy here keeps components clean and lets JSON-LD / nav reuse the same source.
 * All copy below is original.
 */
import reviewsData from "@/content/reviews.json";
import settingsData from "@/content/settings.json";
import copyData from "@/content/copy.json";
import sectionsData from "@/content/sections.json";
import navData from "@/content/nav.json";
import legalData from "@/content/legal.json";
import type { Review } from "@/lib/cms/schemas";
import type { SiteSettings, SiteCopy } from "@/lib/cms/siteSchema";

/** Site identity, contact details, both offices, social + hero image.
 *  CMS-editable in src/content/settings.json. */
export const siteConfig: SiteSettings = settingsData as SiteSettings;

export type ServiceArt = "tax" | "advisory" | "bookkeeping" | "vat" | "payroll" | "formation";

export type Service = {
  slug: string;
  art: ServiceArt;
  icon: string; // lucide icon name (resolved in the component)
  title: string;
  description: string;
  points: string[];
};

export const services: Service[] = sectionsData.services as Service[];

export type WhyPoint = {
  icon: string;
  title: string;
  description: string;
};

export const whyPoints: WhyPoint[] = sectionsData.whyPoints as WhyPoint[];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = sectionsData.processSteps as ProcessStep[];

/** Google reviews + rating summary — CMS-editable in src/content/reviews.json */
export type { Review } from "@/lib/cms/schemas";
export const reviews: Review[] = reviewsData.reviews as Review[];
export const reviewsMeta = {
  eyebrow: reviewsData.eyebrow,
  title: reviewsData.title,
  intro: reviewsData.intro,
  rating: reviewsData.rating,
};

/** Outbound "find us on Google" link. Point this at the real Google Business
 *  Profile once it exists; until then it runs a brand search (no fabricated listing). */
export const googleReviewsUrl =
  "https://www.google.com/maps/search/Alpha+Digital+Solutions+Toronto";

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = sectionsData.faqs as Faq[];

export const businessTypes: string[] = sectionsData.businessTypes;

/** Animated counters in the “Trusted by UK Businesses” band */
export const trustStats = [
  { value: 312, suffix: "%", prefix: "+", label: "Peak organic traffic growth" },
  { value: 247, suffix: "", label: "Editorial links earned" },
  { value: 84, suffix: "", label: "Local markets launched" },
  { value: 24, suffix: "h", label: "Response on every email" },
] as const;

/** Regulators & software platforms — trust badges under the hero. (Professional-
 *  body accreditations ICAEW / ACCA / AAT are shown in the Testimonials section
 *  instead, so ACCA is not duplicated here.) */
export const partners: string[] = sectionsData.partners;

/** Headline statistics — animated with react-countup on scroll */
export const stats = [
  { end: 312, suffix: "%", label: "Peak organic traffic growth" },
  { end: 247, suffix: "", label: "Editorial links earned" },
  { end: 84, suffix: "", label: "Local markets launched" },
  { end: 24, suffix: "h", label: "Email response time" },
] as const;

/* ============================================================
   Navigation — routes with dropdown children (anchor into pages)
   ============================================================ */
export type NavChild = { label: string; href: string };
export type MegaItem = { title: string; description: string; icon: string; href: string };
export type MegaCategory = { label: string; icon: string; items: MegaItem[] };
export type NavLink = { label: string; href: string; children?: NavChild[]; mega?: MegaCategory[] };

/** Top nav + two-pane mega-menus (the four menus are inlined per link).
 *  CMS-editable in src/content/nav.json. */
export const navLinks: NavLink[] = navData.navLinks as NavLink[];

/* ============================================================
   Section copy — every eyebrow, heading, subtitle, paragraph and
   button label, CMS-editable in src/content/copy.json. (Icons,
   illustrations and the data arrays above stay typed in this file.)
   ============================================================ */
export const copy: SiteCopy = copyData as SiteCopy;

/* ============================================================
   Legal / policy pages — editable content for Privacy, Terms & Cookies.
   NOTE: standard professional wording for a UK accountancy practice;
   have it reviewed by the firm's solicitor before going live.
   ============================================================ */
export type LegalSection = { heading: string; body: string[]; bullets?: string[] };
export type LegalPage = {
  slug: string;
  crumb: string;
  title: string;
  intro: string;
  updated: string;
  metaTitle: string;
  metaDescription: string;
  sections: LegalSection[];
};

export const legalPages: LegalPage[] = legalData.pages as LegalPage[];

/* ============================================================
   Detail pages (Services / Industries / How we help)
   SEO-rich, CMS-editable content lives in src/content/*.json,
   is assembled in detailContent.ts, and re-exported here so
   @/lib/content remains the single import surface.
   ============================================================ */
export * from "./detailContent";

/* ============================================================
   Blog / News — posts editable in src/content/blog.json, typed
   and assembled in blog.ts, re-exported here.
   ============================================================ */
export * from "./blog";

/* ============================================================
   Case studies — client success stories, editable in
   src/content/case-studies.json, typed in caseStudies.ts.
   ============================================================ */
export * from "./caseStudies";

/* ============================================================
   Team — the people page, editable in src/content/team.json.
   ============================================================ */
export * from "./team";
