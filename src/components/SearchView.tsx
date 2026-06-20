"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { scoreSearch } from "@/lib/searchIndex";

/** Public on-site search — client-filtered over the build-time content index.
 *  Themed to the original static site (navy/gold tokens). */
export function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const trimmed = q.trim();
  const results = scoreSearch(q);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <span className="eyebrow">Search</span>
          <h1>Search the site</h1>
        </div>
      </section>

      <section className="section">
        <div className="container container-narrow">
          <form
            className="field"
            style={{ flexDirection: "row", gap: ".6rem", alignItems: "stretch" }}
            onSubmit={(e) => {
              e.preventDefault();
              router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
            }}
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search services, insights, case studies…"
              aria-label="Search the site"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div style={{ marginTop: "2rem" }}>
            {!trimmed ? (
              <p>Search across our services, insights and case studies.</p>
            ) : results.length === 0 ? (
              <p>No results for &ldquo;{trimmed}&rdquo;. Try a different term.</p>
            ) : (
              <>
                <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
                  {results.length} result{results.length > 1 ? "s" : ""}
                </p>
                <ul>
                  {results.map(({ doc, snippet }) => (
                    <li key={doc.id} style={{ listStyle: "none", padding: "1.25rem 0", borderTop: "var(--bw) solid var(--border)" }}>
                      <span className="eyebrow" style={{ color: "var(--gold-deep)" }}>{doc.group}</span>
                      <Link href={doc.url} style={{ display: "block", marginTop: ".2rem", fontFamily: "var(--font-head)", fontSize: "1.25rem", fontWeight: 700, color: "var(--navy)" }}>
                        {doc.title}
                      </Link>
                      <p style={{ marginTop: ".3rem", color: "var(--ink-soft)" }}>{snippet}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
