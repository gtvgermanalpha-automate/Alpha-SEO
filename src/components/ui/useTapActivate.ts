"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";

/* ── Coordinator: at most ONE element active at a time, page-wide ──
   A tiny external store shared by every hover/tap interaction (cards, steps,
   badges) so activating one reverts any other, and tapping outside clears it.
   Desktop hover is naturally single-active; this gives the mobile tap the same
   behaviour. */
let activeId: string | null = null;
const subscribers = new Set<() => void>();

function setActive(id: string | null) {
  if (activeId === id) return;
  activeId = id;
  subscribers.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

/* A tap/click that isn't on an interactive element clears the active one. */
let outsideListenerAttached = false;
function ensureOutsideListener() {
  if (outsideListenerAttached || typeof document === "undefined") return;
  outsideListenerAttached = true;
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      if (!target || !target.closest("[data-interactive-card]")) setActive(null);
    },
    true,
  );
}

/**
 * True when the device's primary input can hover (a desktop pointer).
 * Defaults to `true` for SSR so markup is stable; corrected after mount (only
 * changes event behaviour → no hydration mismatch).
 */
function useHoverable() {
  const [hoverable, setHoverable] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverable(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return hoverable;
}

/**
 * Drives a "plays on desktop hover AND mobile tap" interaction for one element.
 *
 * Returns `active` (whether this element is the currently-active one) plus
 * `bind` props to spread onto the element. Native DOM events are used (not
 * Framer Motion gestures) so it's reliable on iOS Safari. Only one element is
 * active at a time page-wide; tapping a different one — or tapping outside —
 * reverts the previous one.
 */
export function useTapActivate() {
  const hoverable = useHoverable();
  const id = useId();
  const current = useSyncExternalStore(
    subscribe,
    () => activeId,
    () => null,
  );
  const active = current === id;

  useEffect(() => {
    ensureOutsideListener();
    // Release the shared slot if this element unmounts while active.
    return () => {
      if (activeId === id) setActive(null);
    };
  }, [id]);

  const bind = {
    "data-interactive-card": "",
    onMouseEnter: () => {
      if (hoverable) setActive(id);
    },
    onMouseLeave: () => {
      if (hoverable && activeId === id) setActive(null);
    },
    onClick: () => {
      if (!hoverable) setActive(active ? null : id);
    },
  };

  return { active, bind };
}
