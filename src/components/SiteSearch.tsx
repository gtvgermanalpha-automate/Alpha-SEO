"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { scoreSearch } from "@/lib/searchIndex";

type Props = {
  /**
   * "icon"   (desktop): a magnifier button that toggles a dropdown panel.
   * "inline" (mobile):  an always-visible field, rendered inside the mobile menu.
   */
  variant?: "icon" | "inline";
  /** Fired after navigating away — e.g. to close the mobile menu. */
  onNavigate?: () => void;
};

/**
 * Public on-site header search. Filters the build-time content index live
 * (scoreSearch — the same index behind /search and the admin global search) and
 * links straight to each result; pressing Enter opens the full /search page.
 */
export function SiteSearch({ variant = "icon", onNavigate }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false); // dropdown panel (icon variant only)
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = q.trim();
  const results = trimmed ? scoreSearch(q).slice(0, 6) : [];

  // Icon variant: focus the field when the panel opens; close on Escape or an
  // outside click.
  useEffect(() => {
    if (variant !== "icon" || !open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [variant, open]);

  function closeAfter() {
    setQ("");
    setOpen(false);
    onNavigate?.();
  }

  function goToSearch() {
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    closeAfter();
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    goToSearch();
  }

  const field = (
    <form onSubmit={submit} className="relative" role="search">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the site…"
        aria-label="Search the site"
        className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </form>
  );

  const resultsPanel =
    trimmed.length > 0 ? (
      results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-muted">No matches for “{trimmed}”.</p>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {results.map(({ doc, snippet }) => (
              <li key={doc.id}>
                <Link
                  href={doc.url}
                  onClick={closeAfter}
                  className="block px-4 py-3 transition-colors hover:bg-cream/60"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-ink">{doc.title}</span>
                    <span className="shrink-0 rounded-full bg-blue px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-accent">
                      {doc.group}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{snippet}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={goToSearch}
            className="block w-full border-t border-line px-4 py-2.5 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-cream/60"
          >
            See all results for “{trimmed}” →
          </button>
        </>
      )
    ) : null;

  if (variant === "inline") {
    return (
      <div>
        {field}
        {resultsPanel && <div className="mt-2 overflow-hidden rounded-lg border border-line bg-white">{resultsPanel}</div>}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Search the site"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
          open ? "bg-cream text-accent" : "text-ink/70 hover:bg-cream hover:text-accent"
        }`}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Search className="h-[18px] w-[18px]" aria-hidden />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2.5 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-white p-2 shadow-2xl shadow-ink/10">
          {field}
          {resultsPanel && <div className="mt-2 max-h-[min(60vh,28rem)] overflow-y-auto">{resultsPanel}</div>}
        </div>
      )}
    </div>
  );
}
