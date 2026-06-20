import Link from "next/link";
import { blogPosts } from "@/lib/content";
import { BlogCard } from "@/components/BlogCard";

/** Home "Insights" preview — the three latest posts. Ported from the original
 *  static site. */
export function Insights() {
  const latest = blogPosts.slice(0, 3);
  return (
    <section className="section">
      <div className="container">
        <div
          className="section-head"
          style={{ maxWidth: "none", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}
        >
          <div>
            <span className="eyebrow">Insights</span>
            <h2>From the <span className="highlight">SEO journal</span></h2>
          </div>
          <Link className="btn-link" href="/blog">
            View all insights
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
        <div className="blog-grid">
          {latest.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
