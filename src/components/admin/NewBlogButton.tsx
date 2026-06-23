"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notifyCmsChanged } from "@/components/admin/PendingChanges";

/** Creates a draft entry in a list collection (server assigns a unique slug) and opens its editor. */
export function NewEntryButton({ file, noun }: { file: string; noun: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create() {
    const title = window.prompt(`Title for the new ${noun}?`);
    if (title === null) return; // cancelled
    const trimmed = title.trim();
    if (!trimmed) return;

    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${file}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { slug?: string; message?: string };
      if (res.ok && data.slug) {
        notifyCmsChanged();
        router.push(`/admin/edit/${file}/${data.slug}`);
        return;
      }
      setError(data.message ?? `Could not create the ${noun} (${res.status}).`);
    } catch {
      setError(`Network error while creating the ${noun}.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={create}
        disabled={busy}
        className="bg-ink px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Creating…" : `+ New ${noun}`}
      </button>
      {error && <p className="mt-1 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
