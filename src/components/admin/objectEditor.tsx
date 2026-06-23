"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { notifyCmsChanged } from "@/components/admin/PendingChanges";

/**
 * Shared scaffold for "object-mode" CMS editors (a single JSON file edited whole):
 * load fresh from GitHub, hold + mutate locally, validate-and-commit on save.
 * Used by the Settings, Section-text and Reviews editors.
 */

export type Path = (string | number)[];

/** Immutable deep-set: returns a copy of `obj` with `path` set to `value`.
 *  Walks plain objects and arrays; used by the field-binding editors. */
export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice() as unknown[];
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy as T;
  }
  const o = obj as Record<string, unknown>;
  return { ...o, [head]: setIn(o[head as string], rest, value) } as T;
}

export type LoadState = "loading" | "ready" | "error";

export function useObjectEditor<T>(id: string) {
  const [data, setData] = useState<T | null>(null);
  const [load, setLoad] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/content/${id}`, { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { message?: string };
          if (active) {
            setLoad("error");
            setLoadError(d.message ?? `Failed to load (${res.status}).`);
          }
          return;
        }
        const body = (await res.json()) as { data: T };
        if (active) {
          setData(body.data);
          setLoad("ready");
        }
      } catch {
        if (active) {
          setLoad("error");
          setLoadError("Network error while loading.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  function mutate(producer: (prev: T) => T) {
    setData((prev) => (prev ? producer(prev) : prev));
    setSaved(false);
  }

  async function save() {
    if (data == null) return;
    setSaving(true);
    setSaveError("");
    setIssues([]);
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const d = (await res.json().catch(() => ({}))) as { message?: string; errors?: string[] };
      if (res.ok) {
        setSaved(true);
        notifyCmsChanged();
        return;
      }
      if (res.status === 422 && Array.isArray(d.errors)) {
        setIssues(d.errors);
        setSaveError("Please fix the issues below, then save again.");
        return;
      }
      setSaveError(d.message ?? `Save failed (${res.status}).`);
    } catch {
      setSaveError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, mutate, load, loadError, saving, saved, saveError, issues, save };
}

export function Back() {
  return (
    <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze hover:underline">
      ← All content
    </Link>
  );
}

export function SaveBtn({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="rounded-lg bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? "Saving…" : "Save draft"}
    </button>
  );
}

/** Header with a back link, the title + filename, and a primary Save button. */
export function EditorHeader({
  title,
  file,
  saving,
  onSave,
}: {
  title: string;
  file: string;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Back />
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">{title}</h1>
        <p className="mt-1 font-mono text-xs text-muted">{file}</p>
      </div>
      <SaveBtn saving={saving} onClick={onSave} />
    </div>
  );
}

/** The green "saved" + red "error/validation issues" banners. */
export function StatusBanners({
  saved,
  saveError,
  issues,
}: {
  saved: boolean;
  saveError: string;
  issues: string[];
}) {
  return (
    <>
      {saved && (
        <div className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
          Saved as a draft. It’s <strong>not live yet</strong> — click <strong>Publish changes</strong> on the
          dashboard when you’re ready to push your edits to the live site.
        </div>
      )}
      {(saveError || issues.length > 0) && (
        <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {saveError && <p className="font-semibold">{saveError}</p>}
          {issues.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
              {issues.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

/** A titled card. `id` adds an anchor target (for in-page jump navigation). */
export function Card({
  title,
  description,
  id,
  children,
}: {
  title: string;
  description?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-6 scroll-mt-24 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

/** Loading / load-error states shared by all object editors. */
export function LoadGate({
  load,
  loadError,
  children,
}: {
  load: LoadState;
  loadError: string;
  children: ReactNode;
}) {
  if (load === "loading") return <p className="text-sm text-muted">Loading…</p>;
  if (load === "error") {
    return (
      <div>
        <Back />
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">{loadError}</div>
      </div>
    );
  }
  return <>{children}</>;
}
