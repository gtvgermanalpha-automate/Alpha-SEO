/**
 * Blog / insights content for Alpha Digital Solutions.
 *
 * Editable copy lives in `src/content/blog.json` — a top-level array of slugged
 * posts, the same convention as the Services / Industries detail collections, so
 * it is CMS-ready. This module types that copy, sorts posts newest-first, and
 * exposes lookup helpers. Re-exported from `@/lib/content` so that module stays
 * the single import surface for the rest of the app.
 */
import blogRaw from "@/content/blog.json";

/** A link in a post's "useful links" list. */
export type BlogLink = { label: string; href: string };

/** A simple data table inside a post. */
export type BlogTable = { headers: string[]; rows: string[][] };

/** One block of a post — a heading with paragraphs, plus optional bullets,
 *  links or a data table. Any of the optional parts may be present. */
export type BlogSection = {
  heading?: string;
  body: string[];
  bullets?: string[];
  links?: BlogLink[];
  table?: BlogTable;
  /** Optional in-body image (uploaded via the CMS) + its alt text. */
  image?: string;
  imageAlt?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date string, e.g. "2018-08-01". */
  date: string;
  author: string;
  category: string;
  /** Hero / thumbnail image — a path under /public (defaults to a brand
   *  illustration; the client can upload a real photo via the CMS). */
  image?: string;
  imageAlt?: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  sections: BlogSection[];
};

export const blogHref = (slug: string) => `/blog/${slug}`;

/** General-guidance disclaimer shown at the foot of every post. Similar in
 *  spirit to the Services / Industries detail-page disclaimer, but intentionally
 *  distinct — it omits a fixed tax year because posts are dated. */
export const blogDisclaimer =
  "This article is general guidance, not advice, and may reflect tax rules and figures that have since changed. Please get in touch for advice tailored to your circumstances.";

/** Posts, newest first (stable for equal dates — preserves file order). */
export const blogPosts: BlogPost[] = [...(blogRaw as unknown as BlogPost[])].sort((a, b) =>
  a.date === b.date ? 0 : a.date < b.date ? 1 : -1,
);

export function findBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** "1 August 2018" — friendly UK date for display. */
export function formatBlogDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-CA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
