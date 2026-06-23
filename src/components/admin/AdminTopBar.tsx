"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { usePendingChanges } from "@/components/admin/PendingChanges";

/** CMS top bar: menu toggle (mobile), brand, global search, an unpublished-changes
 *  badge, view-site, and log out. Logging out with unpublished drafts opens a
 *  guard dialog (publish / keep / discard / cancel) so nothing is lost by accident. */
export function AdminTopBar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const { pending } = usePendingChanges();
  const [busy, setBusy] = useState(false); // logging out
  const [action, setAction] = useState<"publish" | "discard" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const working = busy || action !== null;

  // Esc cancels the guard dialog (unless an action is in flight).
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !working) setConfirmOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmOpen, working]);

  async function doLogout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  function onLogoutClick() {
    if (pending > 0) {
      setError("");
      setConfirmOpen(true);
    } else {
      void doLogout();
    }
  }

  async function runThenLogout(method: "POST" | "DELETE", label: "publish" | "discard") {
    setAction(label);
    setError("");
    try {
      const res = await fetch("/api/admin/publish", { method });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? `${label === "publish" ? "Publish" : "Discard"} failed (${res.status}).`);
        setAction(null);
        return;
      }
      await doLogout();
    } catch {
      setError(`Network error while ${label === "publish" ? "publishing" : "discarding"}.`);
      setAction(null);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink hover:border-bronze lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <Link href="/admin" className="shrink-0 font-display text-lg font-extrabold tracking-tight text-ink">
          Alpha <span className="text-bronze">CMS</span>
        </Link>
        <div className="ml-2 hidden flex-1 sm:block">
          <GlobalSearch />
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {pending > 0 && (
            <Link
              href="/admin"
              title="You have unpublished changes — publish them from the dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:border-amber-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
              {pending}
              <span className="hidden sm:inline"> to publish</span>
            </Link>
          )}
          <a href="/" target="_blank" rel="noreferrer" className="hidden font-medium text-muted hover:text-ink sm:inline">
            View site ↗
          </a>
          <button
            type="button"
            onClick={onLogoutClick}
            disabled={working}
            className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-bronze hover:text-bronze disabled:opacity-60"
          >
            {busy ? "Signing out…" : "Log out"}
          </button>
        </div>
      </div>
      {/* Mobile search row */}
      <div className="border-t border-line px-4 pb-3 pt-2 sm:hidden">
        <GlobalSearch />
      </div>

      {/* Logout-protection dialog — only when unpublished changes exist. */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Unpublished changes"
        >
          <div className="w-full max-w-md rounded-xl border border-line bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold text-ink">
              You have {pending} unpublished change{pending === 1 ? "" : "s"}
            </h2>
            <p className="mt-2 text-sm text-muted">What would you like to do before logging out?</p>
            {error && (
              <p className="mt-3 rounded-md border border-red-300 bg-red-50 p-2.5 text-xs text-red-800">{error}</p>
            )}
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => runThenLogout("POST", "publish")}
                disabled={working}
                className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bronze disabled:opacity-60"
              >
                {action === "publish" ? "Publishing…" : "Save & publish changes"}
              </button>
              <button
                type="button"
                onClick={doLogout}
                disabled={working}
                className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-bronze disabled:opacity-60"
              >
                Keep as draft &amp; log out
              </button>
              <button
                type="button"
                onClick={() => runThenLogout("DELETE", "discard")}
                disabled={working}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                {action === "discard" ? "Discarding…" : "Discard changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setError("");
                }}
                disabled={working}
                className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
