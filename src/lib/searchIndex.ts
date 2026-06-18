/**
 * Build-time content index, shared by the public /search page and the admin
 * global search. Each doc carries both the public `url` and the admin
 * `editorHref` so one index serves both. `scoreSearch` is a tiny dependency-free
 * ranker (title×3 / description×2 / body×1).
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
  team,
  type DetailPage,
  type BlogPost,
  type LegalPage,
  type CaseStudy,
} from "@/lib/content";
import { detailFileFor } from "@/lib/seo/targets";

export type SearchDoc = {
  id: string;
  title: string;
  description: string;
  body: string;
  url: string;
  group: string;
  /** Admin editor for this content, if any. */
  editorHref: string | null;
  collection: string | null;
};

const trim = (s: string, n = 600) => (s.length > n ? `${s.slice(0, n)}…` : s);
const join = (parts: (string | undefined)[]) => parts.filter(Boolean).join(" ");

const GROUP_BY_KIND: Record<DetailPage["kind"], string> = {
  service: "Services",
  industry: "Industries",
  approach: "How we help",
};

function detailDoc(p: DetailPage): SearchDoc {
  const file = detailFileFor(p);
  const body = join([
    p.intro,
    ...p.highlights,
    ...p.sections.flatMap((s) => [s.heading, ...s.body, ...(s.bullets ?? [])]),
    ...p.faqs.flatMap((f) => [f.question, f.answer]),
  ]);
  return {
    id: `${file}:${p.slug}`,
    title: p.title,
    description: p.metaDescription,
    body: trim(body),
    url: detailHref(p.kind, p.slug),
    group: GROUP_BY_KIND[p.kind],
    editorHref: `/admin/edit/${file}/${p.slug}`,
    collection: file,
  };
}

function blogDoc(post: BlogPost): SearchDoc {
  const body = join([
    post.excerpt,
    ...post.sections.flatMap((s) => [s.heading, ...s.body, ...(s.bullets ?? []), ...(s.links ?? []).map((l) => l.label)]),
  ]);
  return {
    id: `blog:${post.slug}`,
    title: post.title,
    description: post.metaDescription || post.excerpt,
    body: trim(body),
    url: blogHref(post.slug),
    group: "Blog",
    editorHref: `/admin/edit/blog/${post.slug}`,
    collection: "blog",
  };
}

function caseStudyDoc(c: CaseStudy): SearchDoc {
  return {
    id: `case-studies:${c.slug}`,
    title: c.title,
    description: c.summary,
    body: trim(join([c.client, c.industry, c.summary, ...c.results, ...c.body])),
    url: caseStudyHref(c.slug),
    group: "Case studies",
    editorHref: `/admin/edit/case-studies/${c.slug}`,
    collection: "case-studies",
  };
}

function legalDoc(page: LegalPage): SearchDoc {
  const body = join([page.intro, ...page.sections.flatMap((s) => [s.heading, ...s.body, ...(s.bullets ?? [])])]);
  return {
    id: `legal:${page.slug}`,
    title: page.title,
    description: page.metaDescription,
    body: trim(body),
    url: `/${page.slug}`,
    group: "Legal",
    editorHref: "/admin/legal",
    collection: "legal",
  };
}

function copyPageDoc(key: keyof typeof copy.pages, url: string): SearchDoc {
  const p = copy.pages[key];
  return {
    id: `page:${key}`,
    title: p.title,
    description: p.metaDescription,
    body: join([p.title, p.subtitle, p.metaDescription]),
    url,
    group: "Pages",
    editorHref: "/admin/copy",
    collection: "copy",
  };
}

const staticDocs: SearchDoc[] = [
  {
    id: "page:home",
    title: "Home",
    description: siteConfig.description,
    body: join([copy.hero.headlineLead, copy.hero.headlineAccent, copy.hero.paragraph]),
    url: "/",
    group: "Pages",
    editorHref: "/admin/copy",
    collection: "copy",
  },
  copyPageDoc("services", "/services"),
  copyPageDoc("whyMmr", "/why-mmr"),
  copyPageDoc("industries", "/industries"),
  copyPageDoc("howWeWork", "/how-we-work"),
  copyPageDoc("faq", "/faq"),
  copyPageDoc("contact", "/contact"),
  {
    id: "page:how-we-help",
    title: "How We Help",
    description: "Proactive tax planning and an advisory partnership beyond compliance.",
    body: "how we help proactive tax planning advisory partnership growth",
    url: "/how-we-help",
    group: "Pages",
    editorHref: null,
    collection: null,
  },
  {
    id: "page:blog",
    title: "News & Blog",
    description: "Tax, accounting and business insights from MMR Accountants.",
    body: "news blog insights tax accounting articles",
    url: "/blog",
    group: "Blog",
    editorHref: null,
    collection: null,
  },
  {
    id: "page:case-studies",
    title: "Case Studies",
    description: "Client success stories — real results for UK businesses.",
    body: "case studies client success stories results",
    url: "/case-studies",
    group: "Pages",
    editorHref: null,
    collection: null,
  },
  {
    id: "page:team",
    title: team.heading,
    description: team.intro,
    body: join([team.intro, ...team.members.flatMap((m) => [m.name, m.role, m.bio])]),
    url: "/team",
    group: "Pages",
    editorHref: "/admin/team",
    collection: "team",
  },
];

export const searchDocs: SearchDoc[] = [
  ...staticDocs,
  ...allDetailPages.map(detailDoc),
  ...caseStudies.map(caseStudyDoc),
  ...blogPosts.map(blogDoc),
  ...legalPages.map(legalDoc),
];

export type SearchResult = { doc: SearchDoc; snippet: string };

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Word-boundary matcher for a term — so "vat" matches "VAT" but not "private". */
const boundary = (term: string) => new RegExp(`\\b${escapeRegExp(term)}`, "i");

function makeSnippet(doc: SearchDoc, terms: string[]): string {
  const text = doc.description || doc.body;
  let idx = -1;
  for (const term of terms) {
    const m = boundary(term).exec(text);
    if (m && (idx < 0 || m.index < idx)) idx = m.index;
  }
  if (idx < 0) return trim(text, 160);
  const start = Math.max(0, idx - 60);
  const slice = text.slice(start, start + 160).trim();
  return `${start > 0 ? "…" : ""}${slice}${start + 160 < text.length ? "…" : ""}`;
}

/** Rank docs against a query (word-boundary match; title×3 / desc×2 / body×1). */
export function scoreSearch(query: string, docs: SearchDoc[] = searchDocs): SearchResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const regexes = terms.map(boundary); // non-global → safe to reuse across docs

  const scored: { doc: SearchDoc; snippet: string; score: number }[] = [];
  for (const doc of docs) {
    let score = 0;
    for (const re of regexes) {
      if (re.test(doc.title)) score += 3;
      if (re.test(doc.description)) score += 2;
      if (re.test(doc.body)) score += 1;
    }
    if (score > 0) scored.push({ doc, snippet: makeSnippet(doc, terms), score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ doc, snippet }) => ({ doc, snippet }));
}
