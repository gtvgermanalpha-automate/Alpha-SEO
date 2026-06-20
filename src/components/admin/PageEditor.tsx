"use client";

import { useEffect, useState } from "react";
import type { DetailFaq, DetailSection, RawDetail } from "@/lib/detailSchema";
import { limitFor } from "@/lib/cms/limits";
import { BackLink, SaveButton, StatusBanner, Card } from "@/components/admin/fields";

const fieldClass =
  "w-full rounded-none border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:border-bronze focus-visible:outline-none focus:ring-1 focus:ring-bronze";
const labelClass = "mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink";

type LoadState = "loading" | "ready" | "error";

export function PageEditor({ file, slug }: { file: string; slug: string }) {
  const [page, setPage] = useState<RawDetail | null>(null);
  const [load, setLoad] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [issues, setIssues] = useState<string[]>([]);

  // Load the current content fresh from the repo (via the API → GitHub).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/content/${file}`, { cache: "no-store" });
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
        const body = (await res.json()) as { data: RawDetail[] };
        const found = body.data.find((p) => p.slug === slug);
        if (!found) {
          if (active) {
            setLoad("error");
            setLoadError(`No page with slug “${slug}” was found in ${file}.json.`);
          }
          return;
        }
        if (active) {
          setPage(found);
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
  }, [file, slug]);

  // Apply an update and clear the "saved" flag so the success banner doesn't linger.
  function mutate(producer: (prev: RawDetail) => RawDetail) {
    setPage((prev) => (prev ? producer(prev) : prev));
    setSaved(false);
  }

  async function save() {
    if (!page) return;
    setSaving(true);
    setSaveError("");
    setIssues([]);

    // Match the original JSON shape: omit empty `bullets` arrays.
    const clean: RawDetail = {
      ...page,
      highlights: page.highlights.map((h) => h.trim()).filter(Boolean),
      sections: page.sections.map((s) => {
        const section: DetailSection = {
          heading: s.heading,
          body: s.body.map((b) => b.trim()).filter(Boolean),
        };
        const bullets = (s.bullets ?? []).map((b) => b.trim()).filter(Boolean);
        if (bullets.length > 0) section.bullets = bullets;
        return section;
      }),
    };

    try {
      const res = await fetch(`/api/admin/content/${file}`, {
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

  if (load === "loading") {
    return <p className="text-sm text-muted">Loading content…</p>;
  }

  if (load === "error" || !page) {
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
          <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">{page.title || "Untitled page"}</h1>
          <p className="mt-1 font-mono text-xs text-muted">
            {file}.json · /{page.slug}
          </p>
        </div>
        <SaveButton saving={saving} onClick={save} />
      </div>

      <StatusBanner saved={saved} error={saveError} issues={issues} />

      {/* Basics */}
      <Card title="Basics">
        <Labeled label="Page title" hint={counter(page.title.length, "title")}>
          <input
            value={page.title}
            onChange={(e) => mutate((p) => ({ ...p, title: e.target.value }))}
            className={fieldClass}
          />
        </Labeled>
        <Labeled label="Eyebrow (small label above the title)" hint={counter(page.eyebrow.length, "eyebrow")}>
          <input
            value={page.eyebrow}
            onChange={(e) => mutate((p) => ({ ...p, eyebrow: e.target.value }))}
            className={fieldClass}
          />
        </Labeled>
        <Labeled label="Intro (hero subtitle)" hint={counter(page.intro.length, "intro")}>
          <textarea
            value={page.intro}
            rows={3}
            onChange={(e) => mutate((p) => ({ ...p, intro: e.target.value }))}
            className={`${fieldClass} resize-y`}
          />
        </Labeled>
        <Labeled label="Slug / URL (cannot be changed here)">
          <input value={page.slug} readOnly disabled className={`${fieldClass} bg-neutral-100 text-muted`} />
        </Labeled>
      </Card>

      {/* SEO */}
      <Card title="Search engine listing">
        <Labeled label="Meta title" hint={counter(page.metaTitle.length, "metaTitle")}>
          <input
            value={page.metaTitle}
            onChange={(e) => mutate((p) => ({ ...p, metaTitle: e.target.value }))}
            className={fieldClass}
          />
        </Labeled>
        <Labeled label="Meta description" hint={counter(page.metaDescription.length, "metaDescription")}>
          <textarea
            value={page.metaDescription}
            rows={3}
            onChange={(e) => mutate((p) => ({ ...p, metaDescription: e.target.value }))}
            className={`${fieldClass} resize-y`}
          />
        </Labeled>
        <p className="text-xs text-muted">
          “ | Alpha Digital Solutions” is added automatically — no need to include it in the meta title.
        </p>
      </Card>

      {/* Highlights */}
      <Card title="What’s included (highlights)">
        <StringList
          items={page.highlights}
          onChange={(highlights) => mutate((p) => ({ ...p, highlights }))}
          addLabel="Add highlight"
          placeholder="e.g. Cloud bookkeeping kept MTD-ready"
        />
      </Card>

      {/* Sections */}
      <Card title="Body sections">
        <div className="space-y-4">
          {page.sections.map((section, index) => (
            <SectionEditor
              key={index}
              section={section}
              index={index}
              count={page.sections.length}
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

      {/* FAQs */}
      <Card title="FAQs">
        <div className="space-y-4">
          {page.faqs.map((faq, index) => (
            <FaqEditor
              key={index}
              faq={faq}
              index={index}
              count={page.faqs.length}
              onChange={(next) =>
                mutate((p) => ({ ...p, faqs: p.faqs.map((f, i) => (i === index ? next : f)) }))
              }
              onRemove={() => mutate((p) => ({ ...p, faqs: p.faqs.filter((_, i) => i !== index) }))}
              onMove={(to) => mutate((p) => ({ ...p, faqs: moveItem(p.faqs, index, to) }))}
            />
          ))}
        </div>
        <AddButton
          label="Add FAQ"
          onClick={() => mutate((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }))}
        />
      </Card>

      <div className="mt-8 flex items-center gap-4">
        <SaveButton saving={saving} onClick={save} />
        {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
      </div>
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Labeled({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        {hint && <span className="mb-1 text-[0.7rem] text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 border border-dashed border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-bronze transition-colors hover:border-bronze hover:bg-bronze-50"
    >
      + {label}
    </button>
  );
}

function MiniBtn({
  children,
  onClick,
  disabled,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-7 w-7 shrink-0 place-items-center border text-xs transition-colors disabled:opacity-25 ${
        danger
          ? "border-line text-red-600 hover:border-red-400 hover:bg-red-50"
          : "border-line text-muted hover:border-bronze hover:text-bronze"
      }`}
    >
      {children}
    </button>
  );
}

function RowControls({
  index,
  count,
  onMove,
  onRemove,
  removeTitle,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  removeTitle: string;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <MiniBtn title="Move up" onClick={() => onMove(index - 1)} disabled={index === 0}>
        ↑
      </MiniBtn>
      <MiniBtn title="Move down" onClick={() => onMove(index + 1)} disabled={index === count - 1}>
        ↓
      </MiniBtn>
      <MiniBtn title={removeTitle} onClick={onRemove} danger>
        ✕
      </MiniBtn>
    </div>
  );
}

function StringList({
  items,
  onChange,
  multiline = false,
  addLabel = "Add item",
  placeholder = "",
}: {
  items: string[];
  onChange: (next: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
  placeholder?: string;
}) {
  const set = (i: number, value: string) => onChange(items.map((it, idx) => (idx === i ? value : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (from: number, to: number) => onChange(moveItem(items, from, to));

  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-xs italic text-muted">None yet.</p>}
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              value={item}
              placeholder={placeholder}
              rows={2}
              onChange={(e) => set(i, e.target.value)}
              className={`${fieldClass} resize-y`}
            />
          ) : (
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => set(i, e.target.value)}
              className={fieldClass}
            />
          )}
          <div className="pt-0.5">
            <RowControls
              index={i}
              count={items.length}
              onMove={(to) => move(i, to)}
              onRemove={() => remove(i)}
              removeTitle="Remove"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze hover:underline"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function SectionEditor({
  section,
  index,
  count,
  onChange,
  onRemove,
  onMove,
}: {
  section: DetailSection;
  index: number;
  count: number;
  onChange: (next: DetailSection) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
}) {
  const set = (partial: Partial<DetailSection>) => onChange({ ...section, ...partial });
  return (
    <div className="border border-line bg-cream/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">
          Section {index + 1}
        </span>
        <RowControls index={index} count={count} onMove={onMove} onRemove={onRemove} removeTitle="Remove section" />
      </div>
      <div className="mt-3 space-y-3">
        <Labeled label="Heading" hint={counter(section.heading.length, "heading")}>
          <input value={section.heading} onChange={(e) => set({ heading: e.target.value })} className={fieldClass} />
        </Labeled>
        <div>
          <span className={labelClass}>Paragraphs</span>
          <StringList
            items={section.body}
            onChange={(body) => set({ body })}
            multiline
            addLabel="Add paragraph"
            placeholder="Paragraph text…"
          />
        </div>
        <div>
          <span className={labelClass}>Bullets (optional)</span>
          <StringList
            items={section.bullets ?? []}
            onChange={(bullets) => set({ bullets })}
            addLabel="Add bullet"
            placeholder="Bullet point…"
          />
        </div>
      </div>
    </div>
  );
}

function FaqEditor({
  faq,
  index,
  count,
  onChange,
  onRemove,
  onMove,
}: {
  faq: DetailFaq;
  index: number;
  count: number;
  onChange: (next: DetailFaq) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
}) {
  const set = (partial: Partial<DetailFaq>) => onChange({ ...faq, ...partial });
  return (
    <div className="border border-line bg-cream/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">FAQ {index + 1}</span>
        <RowControls index={index} count={count} onMove={onMove} onRemove={onRemove} removeTitle="Remove FAQ" />
      </div>
      <div className="mt-3 space-y-3">
        <Labeled label="Question" hint={counter(faq.question.length, "question")}>
          <input value={faq.question} onChange={(e) => set({ question: e.target.value })} className={fieldClass} />
        </Labeled>
        <Labeled label="Answer" hint={counter(faq.answer.length, "answer")}>
          <textarea
            value={faq.answer}
            rows={3}
            onChange={(e) => set({ answer: e.target.value })}
            className={`${fieldClass} resize-y`}
          />
        </Labeled>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/** "45/90" character counter for a field role; flags when over the limit. */
function counter(length: number, role: string): string {
  const max = limitFor(role);
  return `${length}/${max}${length > max ? " · over limit" : ""}`;
}
