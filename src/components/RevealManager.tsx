"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal],[data-reveal-stagger],[data-reveal-line]";

/**
 * Keeps scroll-reveals working across client-side navigation.
 *
 * The inline script in `layout.tsx` only runs on the initial document load, so
 * after an App Router soft navigation the new page's reveal elements were never
 * observed and stayed at `opacity: 0` (blank until a hard refresh).
 *
 * This sets up ONE IntersectionObserver plus a MutationObserver that watches the
 * document for newly-added reveal elements (which is exactly what a soft
 * navigation does). New elements are revealed if already in view, otherwise
 * observed so they animate in on scroll. Being mutation-driven, it's immune to
 * the timing of when a route's effect fires — the cause of the earlier bug.
 */
export function RevealManager() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reveal = (el: Element) => el.classList.add("is-visible");
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  reveal(entry.target);
                  io?.unobserve(entry.target);
                }
              }
            },
            { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
          )
        : null;

    const handle = (el: Element) => {
      if (el.classList.contains("is-visible")) return;
      if (!io) {
        reveal(el);
        return;
      }
      // Already on screen → reveal now; otherwise reveal when scrolled into view.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) reveal(el);
      else io.observe(el);
    };

    const scan = (root: ParentNode) => {
      root.querySelectorAll?.(SELECTOR).forEach(handle);
    };

    // Initial pass over whatever is already in the DOM.
    scan(document);

    // Catch elements added by client-side navigation.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as Element;
          if (el.matches?.(SELECTOR)) handle(el);
          scan(el);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
