/**
 * Default entries + slug helper for CMS "create" (list collections).
 * Only collections with a template here can be created via the CMS — currently
 * just the blog (services/industries/approach are fixed sets).
 */
import { siteConfig } from "@/lib/content";

/** URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** A valid, ready-to-edit default entry for a creatable list collection, or null. */
export function defaultEntryFor(file: string, slug: string, title: string): Record<string, unknown> | null {
  const safeTitle = title.trim() || "Untitled post";
  if (file === "blog") {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return {
      slug,
      title: safeTitle,
      date: today,
      author: siteConfig.name,
      category: "News",
      excerpt: "A short summary of this post — edit me.",
      metaTitle: safeTitle,
      metaDescription: "A short summary of this post for search engines — edit me.",
      sections: [{ heading: "", body: ["Write your post here."] }],
    };
  }
  if (file === "case-studies") {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return {
      slug,
      title: safeTitle,
      client: "Client name",
      industry: "Industry",
      date: today,
      summary: "A short summary of this case study — edit me.",
      results: ["Key result — edit me"],
      metaTitle: safeTitle,
      metaDescription: "A short summary of this case study for search engines — edit me.",
      body: ["## The challenge", "Describe the situation.", "## What we did", "Describe your work.", "## The result", "Describe the outcome."],
    };
  }
  return null;
}
