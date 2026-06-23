"use client";

import { useState } from "react";
import { usePendingChanges } from "@/components/admin/PendingChanges";

/**
 * Dashboard publish control. Shows how many unpublished (draft) changes are
 * waiting and a highlighted "Publish changes" button — the ONE action that pushes
 * edits to the live site (it merges the draft branch into production → one deploy).
 * When nothing is pending it shows a quiet "up to date" line.
 */
export function PublishBar() {
  const { pending, configured, loading, refresh } = usePendingChanges();
  const [busy, setBusy] = useState<"publish" | "discard" | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  // The dashboard already shows a dedicated "not configured" notice.
  if (!configured || loading) return null;

  const working = busy !== null;

  async function publish() {
    setBusy("publish");
    setError("");
    setNote("");
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { merged?: boolean; message?: string };
      if (!res.ok) {
        setError(data.message ?? `Publish failed (${res.status}).`);
        return;
      }
      setNote(
        data.merged
          ? "Published — your changes are going live now (about 1–2 minutes to rebuild)."
          : "Nothing to publish.",
      );
      await refresh();
    } catch {
      setError("Network error while publishing.");
    } finally {
      setBusy(null);
    }
  }

  async function discard() {
    if (!window.confirm("Discard ALL unpublished changes? This restores the live content and cannot be undone.")) return;
    setBusy("discard");
    setError("");
    setNote("");
    try {
      const res = await fetch("/api/admin/publish", { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? `Discard failed (${res.status}).`);
        return;
      }
      setNote("Unpublished changes discarded — back in sync with the live site.");
      await refresh();
    } catch {
      setError("Network error while discarding.");
    } finally {
      setBusy(null);
    }
  }

  if (pending === 0) {
    return (
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm text-muted">
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
        {note || "All changes are published — the live site is up to date."}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-base font-bold text-ink">
            {pending} unpublished change{pending === 1 ? "" : "s"} waiting
          </p>
          <p className="mt-0.5 text-sm text-amber-900/80">
            Your edits are saved as drafts and are <strong>not live yet</strong>. Publish to push them all to the live
            site at once.
          </p>
          {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={discard}
            disabled={working}
            className="rounded-lg border border-amber-400 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60"
          >
            {busy === "discard" ? "Discarding…" : "Discard"}
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={working}
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-bronze disabled:opacity-60"
          >
            {busy === "publish" ? "Publishing…" : "Publish changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
