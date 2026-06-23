"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Tracks how many unpublished (draft) CMS changes are waiting to be published.
 * Backed by GET /api/admin/publish (compares the draft branch to production).
 * The count drives the top-bar badge, the dashboard Publish bar, and the
 * logout-protection dialog, so they always agree.
 */

export const CMS_CHANGED_EVENT = "cms:changed";

/** Editors call this after a successful save / create / delete so the pending
 *  count refreshes immediately (no navigation needed). */
export function notifyCmsChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CMS_CHANGED_EVENT));
}

type Status = { pending: number; configured: boolean };
type PendingState = { pending: number; configured: boolean; loading: boolean; refresh: () => Promise<void> };

const Ctx = createContext<PendingState>({
  pending: 0,
  configured: true,
  loading: true,
  refresh: async () => {},
});

export function usePendingChanges() {
  return useContext(Ctx);
}

/** Fetch the current draft status. Pure (no React state), so it's safe to call
 *  from an effect body. Returns null on any failure (caller keeps the old count). */
async function fetchStatus(): Promise<Status | null> {
  try {
    const res = await fetch("/api/admin/publish", { cache: "no-store" });
    if (!res.ok) return null; // 401/5xx — keep the last known count
    const data = (await res.json()) as { pending?: number; configured?: boolean };
    return {
      pending: typeof data.pending === "number" ? data.pending : 0,
      configured: data.configured !== false,
    };
  } catch {
    return null; // offline
  }
}

export function PendingChangesProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(0);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    const next = await fetchStatus();
    if (next) {
      setPending(next.pending);
      setConfigured(next.configured);
    }
    setLoading(false);
  }, []);

  // Refresh on mount + on every admin navigation. An inline async IIFE (with an
  // `active` guard) keeps setState off the effect's synchronous path.
  useEffect(() => {
    let active = true;
    (async () => {
      const next = await fetchStatus();
      if (!active) return;
      if (next) {
        setPending(next.pending);
        setConfigured(next.configured);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [pathname]);

  // Refresh when an editor signals a save, and when the tab regains focus.
  useEffect(() => {
    const onChange = () => void refresh();
    window.addEventListener(CMS_CHANGED_EVENT, onChange);
    window.addEventListener("focus", onChange);
    return () => {
      window.removeEventListener(CMS_CHANGED_EVENT, onChange);
      window.removeEventListener("focus", onChange);
    };
  }, [refresh]);

  return <Ctx.Provider value={{ pending, configured, loading, refresh }}>{children}</Ctx.Provider>;
}
