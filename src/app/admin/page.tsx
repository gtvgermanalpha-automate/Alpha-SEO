import Link from "next/link";
import { Search, Type, LayoutGrid, Menu as MenuIcon, Newspaper, Briefcase, Users, Star, FileText, Settings } from "lucide-react";
import { githubConfigured } from "@/lib/github";
import servicesRaw from "@/content/services.json";
import blogRaw from "@/content/blog.json";
import caseStudiesRaw from "@/content/case-studies.json";
import { NewEntryButton } from "@/components/admin/NewBlogButton";
import { PublishBar } from "@/components/admin/PublishBar";

export const dynamic = "force-dynamic";

type ListItem = { slug: string; title: string };

const COLLECTIONS: { file: string; label: string; pages: ListItem[]; anchor?: string }[] = [
  { file: "services", label: "Services", pages: servicesRaw as unknown as ListItem[] },
  { file: "blog", label: "Blog", pages: blogRaw as unknown as ListItem[], anchor: "blog" },
  { file: "case-studies", label: "Case studies", pages: caseStudiesRaw as unknown as ListItem[], anchor: "case-studies" },
];

const blogCount = (blogRaw as unknown[]).length;
const csCount = (caseStudiesRaw as unknown[]).length;

const CARDS = [
  { label: "SEO & search", href: "/admin/seo", icon: Search, sub: "Titles, descriptions, indexing, social" },
  { label: "Page text", href: "/admin/copy", icon: Type, sub: "Headings & copy on every page" },
  { label: "Sections", href: "/admin/sections", icon: LayoutGrid, sub: "Services, FAQs…" },
  { label: "Navigation", href: "/admin/nav", icon: MenuIcon, sub: "Menus & mega-menus" },
  { label: "Blog", href: "#blog", icon: Newspaper, sub: `${blogCount} post${blogCount === 1 ? "" : "s"}` },
  { label: "Case studies", href: "#case-studies", icon: Briefcase, sub: `${csCount} case stud${csCount === 1 ? "y" : "ies"}` },
  { label: "Team", href: "/admin/team", icon: Users, sub: "People page" },
  { label: "Reviews", href: "/admin/reviews", icon: Star, sub: "Google reviews" },
  { label: "Legal", href: "/admin/legal", icon: FileText, sub: "Privacy, terms, cookies" },
  { label: "Site settings", href: "/admin/settings", icon: Settings, sub: "Contact, logos, social" },
];

export default function AdminDashboard() {
  const canSave = githubConfigured();

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Edit your site content, SEO and blog. <strong>Save</strong> keeps each change as a draft — nothing goes live
        until you click <strong>Publish changes</strong>, which pushes everything to the live site at once.
      </p>

      {!canSave && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Saving is currently disabled</p>
          <p className="mt-1">
            Set <code className="font-mono">GITHUB_TOKEN</code> and <code className="font-mono">GITHUB_REPO</code>{" "}
            in the environment to load and publish content. See <code className="font-mono">ADMIN.md</code>.
          </p>
        </div>
      )}

      {/* Draft/publish control — shows pending count + the Publish button when there are unpublished edits. */}
      <PublishBar />

      {/* Quick cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group flex items-start gap-4 rounded-xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-bronze hover:shadow-md"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue text-accent transition-colors group-hover:bg-ink group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-base font-bold text-ink">{c.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{c.sub}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Per-entry lists (detail pages + blog) */}
      <div className="mt-12 space-y-8">
        {COLLECTIONS.map((collection) => (
          <section key={collection.file} id={collection.anchor} className="scroll-mt-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-muted">{collection.label}</h2>
              {collection.file === "blog" && <NewEntryButton file="blog" noun="post" />}
              {collection.file === "case-studies" && <NewEntryButton file="case-studies" noun="case study" />}
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {collection.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/admin/edit/${collection.file}/${page.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm shadow-sm transition-all hover:border-bronze hover:shadow-md"
                  >
                    <span className="font-semibold text-ink">{page.title}</span>
                    <span className="shrink-0 font-mono text-xs text-muted">/{page.slug} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
