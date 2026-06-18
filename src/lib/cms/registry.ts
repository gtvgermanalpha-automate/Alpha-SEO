/**
 * Registry of CMS-editable collections. Drives both the admin dashboard and the
 * generalised content API (`/api/admin/content/[file]`).
 *
 * - mode "list":   the JSON file is an array of slugged entries; edited per-entry
 *                  (merge-by-slug) via /admin/edit/[file]/[slug].
 * - mode "object": the JSON file is a single object; edited whole via `editPath`.
 */
import { validateFile } from "@/lib/detailSchema";
import { validateReviews } from "@/lib/cms/schemas";
import { validateSettings, validateCopy } from "@/lib/cms/siteSchema";
import { validateSections } from "@/lib/cms/itemsSchema";
import { validateNav } from "@/lib/cms/navSchema";
import { validateLegal } from "@/lib/cms/legalSchema";
import { validateBlog } from "@/lib/cms/blogSchema";
import { validateSeo } from "@/lib/cms/seoSchema";
import { validateCaseStudies } from "@/lib/cms/caseStudySchema";
import { validateTeam } from "@/lib/cms/teamSchema";

export type CollectionMode = "list" | "object";

export type Collection = {
  id: string;
  label: string;
  file: string; // repo-relative path
  mode: CollectionMode;
  validate: (data: unknown) => { ok: true } | { ok: false; errors: string[] };
  editPath?: string; // admin route for object collections
};

export const collections: Collection[] = [
  { id: "settings", label: "Site & contact details", file: "src/content/settings.json", mode: "object", validate: validateSettings, editPath: "/admin/settings" },
  { id: "copy", label: "Section text & headings", file: "src/content/copy.json", mode: "object", validate: validateCopy, editPath: "/admin/copy" },
  { id: "sections", label: "Section items (services, industries, FAQs…)", file: "src/content/sections.json", mode: "object", validate: validateSections, editPath: "/admin/sections" },
  { id: "nav", label: "Navigation & menus", file: "src/content/nav.json", mode: "object", validate: validateNav, editPath: "/admin/nav" },
  { id: "legal", label: "Legal pages (privacy, terms, cookies)", file: "src/content/legal.json", mode: "object", validate: validateLegal, editPath: "/admin/legal" },
  { id: "reviews", label: "Google reviews", file: "src/content/reviews.json", mode: "object", validate: validateReviews, editPath: "/admin/reviews" },
  { id: "seo", label: "SEO & search", file: "src/content/seo.json", mode: "object", validate: validateSeo, editPath: "/admin/seo" },
  { id: "services", label: "Services", file: "src/content/services.json", mode: "list", validate: validateFile },
  { id: "industries-1", label: "Industries — set A", file: "src/content/industries-1.json", mode: "list", validate: validateFile },
  { id: "industries-2", label: "Industries — set B", file: "src/content/industries-2.json", mode: "list", validate: validateFile },
  { id: "approach", label: "How we help", file: "src/content/approach.json", mode: "list", validate: validateFile },
  { id: "blog", label: "Blog posts", file: "src/content/blog.json", mode: "list", validate: validateBlog },
  { id: "case-studies", label: "Case studies", file: "src/content/case-studies.json", mode: "list", validate: validateCaseStudies },
  { id: "team", label: "Team page", file: "src/content/team.json", mode: "object", validate: validateTeam, editPath: "/admin/team" },
];

const byId: Record<string, Collection> = Object.fromEntries(collections.map((c) => [c.id, c]));

export function getCollection(id: string): Collection | undefined {
  return byId[id];
}
