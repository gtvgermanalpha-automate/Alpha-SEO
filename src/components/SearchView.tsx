"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { scoreSearch } from "@/lib/searchIndex";

/** Public on-site search — client-filtered over the build-time content index. */
export function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const trimmed = q.trim();
  const results = scoreSearch(q);

  return (
    <section className="min-h-[60vh] bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">Search</h1>

          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the site…"
                aria-label="Search the site"
                className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              Search
            </button>
          </form>

          <div className="mt-8">
            {!trimmed ? (
              <p className="text-sm text-muted">Search across our services, industries, guidance and blog.</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted">No results for “{trimmed}”. Try a different term.</p>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {results.length} result{results.length > 1 ? "s" : ""}
                </p>
                <ul className="mt-4 divide-y divide-line">
                  {results.map(({ doc, snippet }) => (
                    <li key={doc.id} className="py-5">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">{doc.group}</span>
                      <Link href={doc.url} className="mt-1 block font-display text-lg text-ink transition-colors hover:text-accent">
                        {doc.title}
                      </Link>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{snippet}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
