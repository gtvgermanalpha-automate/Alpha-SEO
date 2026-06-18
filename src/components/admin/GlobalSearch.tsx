"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { scoreSearch } from "@/lib/searchIndex";

/** Admin global search — finds any content across the site and links to its editor. */
export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const results = q.trim() ? scoreSearch(q).slice(0, 8) : [];
  const open = focused && q.trim().length > 0;

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Search all content…"
        aria-label="Search all content"
        className="w-full rounded-lg border border-line bg-cream/50 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-bronze focus:bg-white focus:outline-none focus:ring-1 focus:ring-bronze"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-[70vh] overflow-y-auto border border-line bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No matches for “{q.trim()}”.</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map(({ doc, snippet }) => (
                <li key={doc.id}>
                  <Link
                    href={doc.editorHref ?? "/admin"}
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
          )}
          <p className="border-t border-line px-4 py-2 text-[0.65rem] text-muted/80">
            Searches the last published content. Click a result to open its editor.
          </p>
        </div>
      )}
    </div>
  );
}
