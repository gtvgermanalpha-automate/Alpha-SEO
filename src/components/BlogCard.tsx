import Link from "next/link";
import { blogHref, type BlogPost } from "@/lib/content";

/** Rough reading time from the post's excerpt + section bodies (~200 wpm). */
function readMinutes(post: BlogPost): number {
  const text = post.excerpt + " " + post.sections.map((s) => (s.body ?? []).join(" ")).join(" ");
  return Math.max(3, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

/** Insight / blog card — image + category badge, meta, title, excerpt, author.
 *  Full navy-fill hover. Ported from the original static site (.blog-card).
 *  Shared by the home "Insights" strip and the /blog list. */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={blogHref(post.slug)} className="blog-card">
      <div className="blog-image">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.imageAlt ?? ""} loading="lazy" />
        ) : null}
        <span className="blog-category">{post.category}</span>
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <span>{readMinutes(post)} min read</span>
          <span>·</span>
          <span>{post.date.slice(0, 4)}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="blog-card-foot">
          <div className="blog-author-mini"><span>{post.author}</span></div>
          <span className="btn-link">Read</span>
        </div>
      </div>
    </Link>
  );
}
