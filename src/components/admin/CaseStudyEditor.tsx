"use client";

import { useEffect, useState } from "react";
import type { CaseStudy } from "@/lib/caseStudies";
import { ImageField } from "@/components/admin/ImageField";
import {
  Field,
  StringList,
  Labeled,
  fieldClass,
  BackLink,
  SaveButton,
  StatusBanner,
  Card,
} from "@/components/admin/fields";
import { notifyCmsChanged } from "@/components/admin/PendingChanges";

const FILE = "case-studies";
type LoadState = "loading" | "ready" | "error";

export function CaseStudyEditor({ slug }: { slug: string }) {
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [load, setLoad] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/content/${FILE}`, { cache: "no-store" });
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
        const body = (await res.json()) as { data: CaseStudy[] };
        const found = body.data.find((c) => c.slug === slug);
        if (!found) {
          if (active) {
            setLoad("error");
            setLoadError(`No case study with slug “${slug}” was found.`);
          }
          return;
        }
        if (active) {
          setCs(found);
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

  function mutate(producer: (prev: CaseStudy) => CaseStudy) {
    setCs((prev) => (prev ? producer(prev) : prev));
    setSaved(false);
  }

  async function save() {
    if (!cs) return;
    setSaving(true);
    setSaveError("");
    setIssues([]);

    const image = cs.image?.trim();
    const imageAlt = cs.imageAlt?.trim();
    const date = cs.date?.trim();
    const clean: CaseStudy = {
      slug: cs.slug,
      title: cs.title.trim(),
      client: cs.client.trim(),
      industry: cs.industry.trim(),
      ...(date ? { date } : {}),
      ...(image ? { image } : {}),
      ...(imageAlt ? { imageAlt } : {}),
      summary: cs.summary.trim(),
      results: cs.results.map((r) => r.trim()).filter(Boolean),
      metaTitle: cs.metaTitle.trim(),
      metaDescription: cs.metaDescription.trim(),
      body: cs.body.map((b) => b.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/admin/content/${FILE}`, {
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
        notifyCmsChanged();
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
    if (!cs) return;
    if (!window.confirm(`Delete “${cs.title || cs.slug}”? This cannot be undone.`)) return;
    setDeleting(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/admin/content/${FILE}?slug=${encodeURIComponent(cs.slug)}`, { method: "DELETE" });
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
  if (load === "error" || !cs) {
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
          <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">{cs.title || "Untitled case study"}</h1>
          <p className="mt-1 font-mono text-xs text-muted">case-studies.json · /case-studies/{cs.slug}</p>
        </div>
        <SaveButton saving={saving} onClick={save} />
      </div>

      <StatusBanner saved={saved} error={saveError} issues={issues} />

      <Card title="Basics">
        <Field label="Title" value={cs.title} role="title" onChange={(v) => mutate((p) => ({ ...p, title: v }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client" value={cs.client} role="client" onChange={(v) => mutate((p) => ({ ...p, client: v }))} />
          <Field label="Industry" value={cs.industry} role="industry" onChange={(v) => mutate((p) => ({ ...p, industry: v }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Date published (optional)">
            <input
              type="date"
              value={cs.date ?? ""}
              onChange={(e) => mutate((p) => ({ ...p, date: e.target.value }))}
              className={fieldClass}
            />
          </Labeled>
        </div>
        <ImageField
          label="Image (thumbnail + hero)"
          dir="case-studies"
          value={cs.image ?? ""}
          onChange={(path) => mutate((p) => ({ ...p, image: path }))}
        />
        <Field label="Image alt text" value={cs.imageAlt ?? ""} role="imageAlt" onChange={(v) => mutate((p) => ({ ...p, imageAlt: v }))} />
        <Field label="Summary (card + intro)" value={cs.summary} role="summary" multiline onChange={(v) => mutate((p) => ({ ...p, summary: v }))} />
        <Labeled label="Slug / URL (cannot be changed here)">
          <input value={cs.slug} readOnly disabled className={`${fieldClass} bg-neutral-100 text-muted`} />
        </Labeled>
      </Card>

      <Card title="Search engine listing">
        <Field label="Meta title" value={cs.metaTitle} role="metaTitle" onChange={(v) => mutate((p) => ({ ...p, metaTitle: v }))} />
        <Field label="Meta description" value={cs.metaDescription} role="metaDescription" multiline onChange={(v) => mutate((p) => ({ ...p, metaDescription: v }))} />
      </Card>

      <Card title="Results (key outcomes)">
        <StringList items={cs.results} onChange={(results) => mutate((p) => ({ ...p, results }))} role="result" addLabel="Add result" placeholder="e.g. 22% reduction in VAT" />
      </Card>

      <Card title="Body">
        <p className="-mt-1 text-[0.68rem] text-muted">
          Supports Markdown — <code className="font-mono">## heading</code>, <code className="font-mono">**bold**</code>,{" "}
          <code className="font-mono">[link](/contact)</code>, tables and lists. Each box is one block.
        </p>
        <StringList items={cs.body} onChange={(body) => mutate((p) => ({ ...p, body }))} multiline role="markdownBody" addLabel="Add block" placeholder="Markdown…" />
      </Card>

      <div className="mt-8">
        <SaveButton saving={saving} onClick={save} />
        {saved && <span className="ml-4 text-sm text-emerald-700">Saved ✓</span>}
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <button
          type="button"
          onClick={del}
          disabled={deleting}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600 transition-colors hover:text-red-800 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete this case study"}
        </button>
      </div>
    </div>
  );
}
