"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { GlobalSearch } from "@/components/admin/GlobalSearch";

/** CMS top bar: menu toggle (mobile), brand, global search, view-site + log out. */
export function AdminTopBar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
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
          <a href="/" target="_blank" rel="noreferrer" className="hidden font-medium text-muted hover:text-ink sm:inline">
            View site ↗
          </a>
          <button
            type="button"
            onClick={logout}
            disabled={busy}
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
    </header>
  );
}
