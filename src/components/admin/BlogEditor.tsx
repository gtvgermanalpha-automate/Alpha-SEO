"use client";

import { useEffect, useState } from "react";
import type { BlogPost, BlogSection, BlogLink } from "@/lib/blog";
import { ImageField } from "@/components/admin/ImageField";
import {
  Field,
  StringList,
  Labeled,
  RowControls,
  AddButton,
  moveItem,
  fieldClass,
  labelClass,
  BackLink,
  SaveButton,
  StatusBanner,
  Card,
} from "@/components/admin/fields";

type LoadState = "loading" | "ready" | "error";

export function BlogEditor({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [load, setLoad] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  // Load current content fresh from the repo (via the API → GitHub).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/content/blog`, { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { message?: string };
          if (active) {
            setLoad("error");
            setLoadError(data.message ?? `Failed to load content (${res.status}).`);
          }
          return;
        }
        const body = (await res.json()) as { data: BlogPost[] };
        const found = body.data.find((p) => p.slug === slug);
        if (!found) {
          if (active) {
            setLoad("error");
            setLoadError(`No post with slug “${slug}” was found in blog.json.`);
          }
          return;
        }
        if (active) {
          setPost(found);
          setLoad("ready");
        }
      } catch {
        if (active) {
          setLoad("error");
          setLoadError("Network error while loading content.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  function mutate(producer: (prev: BlogPost) => BlogPost) {
    setPost((prev) => (prev ? producer(prev) : prev));
    setSaved(false);
  }

  async function save() {
    if (!post) return;
    setSaving(true);
    setSaveError("");
    setIssues([]);

    // Rebuild in the original key order, dropping empty optional fields.
    const sections = post.sections.map((s) => {
      const section: BlogSection = { body: s.body.map((b) => b.trim()).filter(Boolean) };
      if (s.heading && s.heading.trim()) section.heading = s.heading.trim();
      const bullets = (s.bullets ?? []).map((b) => b.trim()).filter(Boolean);
      if (bullets.length) section.bullets = bullets;
      const links = (s.links ?? [])
        .map((l) => ({ label: l.label.trim(), href: l.href.trim() }))
        .filter((l) => l.label && l.href);
      if (links.length) section.links = links;
      if (s.table) section.table = s.table; // tables are preserved as-is
      if (s.image && s.image.trim()) section.image = s.image.trim();
      if (s.imageAlt && s.imageAlt.trim()) section.imageAlt = s.imageAlt.trim();
      return section;
    });

    const image = post.image?.trim();
    const imageAlt = post.imageAlt?.trim();
    const clean: BlogPost = {
      slug: post.slug,
      title: post.title.trim(),
      date: post.date.trim(),
      author: post.author.trim(),
      category: post.category.trim(),
      ...(image ? { image } : {}),
      ...(imageAlt ? { imageAlt } : {}),
      excerpt: post.excerpt.trim(),
      metaTitle: post.metaTitle.trim(),
      metaDescription: post.metaDescription.trim(),
      sections,
    };

    try {
      const res = await fetch(`/api/admin/content/blog`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: clean }),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { message?: string; errors?: string[] };
      if (res.ok) {
        setSaved(true);
        return;
      }
      if (res.status === 422 && Array.isArray(data.errors)) {
        setIssues(data.errors);
        setSaveError("Please fix the issues below, then save again.");
        return;
      }
      setSaveError(data.message ?? `Save failed (${res.status}).`);
    } catch {
      setSaveError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!post) return;
    if (!window.confirm(`Delete “${post.title || post.slug}”? This cannot be undone.`)) return;
    setDeleting(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/admin/content/blog?slug=${encodeURIComponent(post.slug)}`, { method: "DELETE" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (res.ok) {
        window.location.href = "/admin";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setSaveError(data.message ?? `Delete failed (${res.status}).`);
    } catch {
      setSaveError("Network error while deleting.");
    } finally {
      setDeleting(false);
    }
  }

  if (load === "loading") return <p className="text-sm text-muted">Loading content…</p>;

  if (load === "error" || !post) {
    return (
      <div>
        <BackLink />
        <div className="mt-4 border border-red-300 bg-red-50 p-4 text-sm text-red-800">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BackLink />
          <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">{post.title || "Untitled post"}</h1>
          <p className="mt-1 font-mono text-xs text-muted">blog.json · /blog/{post.slug}</p>
        </div>
        <SaveButton saving={saving} onClick={save} />
      </div>

      <StatusBanner saved={saved} error={saveError} issues={issues} />

      {/* Basics */}
      <Card title="Basics">
        <Field label="Title" value={post.title} role="title" onChange={(v) => mutate((p) => ({ ...p, title: v }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Date published">
            <input
              type="date"
              value={post.date}
              onChange={(e) => mutate((p) => ({ ...p, date: e.target.value }))}
              className={fieldClass}
            />
          </Labeled>
          <Field label="Author" value={post.author} role="author" onChange={(v) => mutate((p) => ({ ...p, author: v }))} />
        </div>
        <Field label="Category" value={post.category} role="category" onChange={(v) => mutate((p) => ({ ...p, category: v }))} />
        <ImageField
          label="Image (thumbnail + hero)"
          dir="blog"
          value={post.image ?? ""}
          onChange={(path) => mutate((p) => ({ ...p, image: path }))}
        />
        <Field
          label="Image description (alt text)"
          value={post.imageAlt ?? ""}
          role="imageAlt"
          onChange={(v) => mutate((p) => ({ ...p, imageAlt: v }))}
        />
        <Field
          label="Excerpt (card summary)"
          value={post.excerpt}
          role="excerpt"
          multiline
          onChange={(v) => mutate((p) => ({ ...p, excerpt: v }))}
        />
        <Labeled label="Slug / URL (cannot be changed here)">
          <input value={post.slug} readOnly disabled className={`${fieldClass} bg-neutral-100 text-muted`} />
        </Labeled>
      </Card>

      {/* SEO */}
      <Card title="Search engine listing">
        <Field
          label="Meta title"
          value={post.metaTitle}
          role="metaTitle"
          onChange={(v) => mutate((p) => ({ ...p, metaTitle: v }))}
        />
        <Field
          label="Meta description"
          value={post.metaDescription}
          role="metaDescription"
          multiline
          onChange={(v) => mutate((p) => ({ ...p, metaDescription: v }))}
        />
        <p className="text-xs text-muted">
          “ | Alpha Digital Solutions” is added automatically — no need to include it in the meta title.
        </p>
      </Card>

      {/* Body sections */}
      <Card title="Body sections">
        <div className="space-y-4">
          {post.sections.map((section, index) => (
            <SectionEditor
              key={index}
              section={section}
              index={index}
              count={post.sections.length}
              onChange={(next) =>
                mutate((p) => ({ ...p, sections: p.sections.map((s, i) => (i === index ? next : s)) }))
              }
              onRemove={() => mutate((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }))}
              onMove={(to) => mutate((p) => ({ ...p, sections: moveItem(p.sections, index, to) }))}
            />
          ))}
        </div>
        <AddButton
          label="Add section"
          onClick={() => mutate((p) => ({ ...p, sections: [...p.sections, { heading: "", body: [""] }] }))}
        />
      </Card>

      <div className="mt-8 flex items-center gap-4">
        <SaveButton saving={saving} onClick={save} />
        {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
      </div>

      {/* Danger zone */}
      <div className="mt-10 border-t border-line pt-6">
        <button
          type="button"
          onClick={del}
          disabled={deleting}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600 transition-colors hover:text-red-800 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete this post"}
        </button>
      </div>
    </div>
  );
}

/* ---------- section + links editors ---------- */

function SectionEditor({
  section,
  index,
  count,
  onChange,
  onRemove,
  onMove,
}: {
  section: BlogSection;
  index: number;
  count: number;
  onChange: (next: BlogSection) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
}) {
  const set = (partial: Partial<BlogSection>) => onChange({ ...section, ...partial });
  return (
    <div className="border border-line bg-cream/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Section {index + 1}</span>
        <RowControls index={index} count={count} onMove={onMove} onRemove={onRemove} removeTitle="Remove section" />
      </div>
      <div className="mt-3 space-y-3">
        <Labeled label="Heading (optional)">
          <input
            value={section.heading ?? ""}
            onChange={(e) => set({ heading: e.target.value })}
            className={fieldClass}
            placeholder="Leave blank for an intro / continuation paragraph"
          />
        </Labeled>
        <div>
          <span className={labelClass}>Paragraphs</span>
          <p className="-mt-0.5 mb-1.5 text-[0.68rem] text-muted">
            Supports Markdown — <code className="font-mono">## subheading</code>, <code className="font-mono">**bold**</code>,{" "}
            <code className="font-mono">[link](/services/vat)</code>, tables and lists. Keep a whole table (or any
            multi-line block) in a single box.
          </p>
          <StringList
            items={section.body}
            onChange={(body) => set({ body })}
            multiline
            role="body"
            addLabel="Add paragraph"
            placeholder="Paragraph text… (Markdown supported)"
          />
        </div>
        <div>
          <span className={labelClass}>Bullets (optional)</span>
          <StringList
            items={section.bullets ?? []}
            onChange={(bullets) => set({ bullets })}
            role="bullets"
            addLabel="Add bullet"
            placeholder="Bullet point…"
          />
        </div>
        <LinksEditor links={section.links ?? []} onChange={(links) => set({ links })} />
        <div>
          <ImageField
            label="In-body image (optional)"
            dir="blog"
            value={section.image ?? ""}
            onChange={(path) => set({ image: path })}
          />
          {section.image ? (
            <div className="mt-2">
              <Field
                label="Image alt text"
                value={section.imageAlt ?? ""}
                role="imageAlt"
                hint="Describe the image for screen readers and SEO."
                onChange={(v) => set({ imageAlt: v })}
              />
            </div>
          ) : null}
        </div>
        {section.table ? (
          <p className="border border-dashed border-line bg-white px-3 py-2 text-xs text-muted">
            This section has a data table ({section.table.headers.length} columns ×{" "}
            {section.table.rows.length} rows). It is preserved on save and edited in the JSON.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function LinksEditor({ links, onChange }: { links: BlogLink[]; onChange: (next: BlogLink[]) => void }) {
  const set = (i: number, partial: Partial<BlogLink>) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...partial } : l)));
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const move = (from: number, to: number) => onChange(moveItem(links, from, to));

  return (
    <div>
      <span className={labelClass}>Links (optional)</span>
      <div className="space-y-2">
        {links.length === 0 && <p className="text-xs italic text-muted">None yet.</p>}
        {links.map((link, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <Field label="Link text" value={link.label} role="label" placeholder="Link text" onChange={(v) => set(i, { label: v })} />
              <Field label="URL" value={link.href} role="href" format="href" placeholder="https://…" onChange={(v) => set(i, { href: v })} />
            </div>
            <div className="pt-6">
              <RowControls index={i} count={links.length} onMove={(to) => move(i, to)} onRemove={() => remove(i)} removeTitle="Remove link" />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...links, { label: "", href: "" }])}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze hover:underline"
        >
          + Add link
        </button>
      </div>
    </div>
  );
}

