import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Md } from "@/components/ArticleBody";
import { ShareButtons } from "@/components/ShareButtons";
import { CustomSchema } from "@/components/CustomSchema";
import { jsonLd } from "@/lib/jsonLd";
import {
  siteConfig,
  blogHref,
  blogDisclaimer,
  formatBlogDate,
  type BlogPost,
  type BlogSection,
} from "@/lib/content";

/** One block of a post — heading, markdown body, optional bullets/links/table/image.
 *  Emits plain elements so the `.article-body` wrapper styles them. */
function BlogSectionView({ section }: { section: BlogSection }) {
  return (
    <>
      {section.heading ? <h2>{section.heading}</h2> : null}
      {section.body.length ? <Md>{section.body.join("\n\n")}</Md> : null}
      {section.bullets ? (
        <ul>{section.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      ) : null}
      {section.links ? (
        <ul>
          {section.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
      {section.table ? (
        <table>
          <thead>
            <tr>{section.table.headers.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {section.image ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.image} alt={section.imageAlt ?? ""} loading="lazy" />
          {section.imageAlt ? <figcaption>{section.imageAlt}</figcaption> : null}
        </figure>
      ) : null}
    </>
  );
}

/** Single blog / insight article. Ported from the original static site
 *  (.article-page-header + article-hero + article-body). */
export function BlogPostView({ post }: { post: BlogPost }) {
  const url = `${siteConfig.url}${blogHref(post.slug)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    ...(post.image ? { image: post.image.startsWith("http") ? post.image : `${siteConfig.url}${post.image}` } : {}),
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.contact.phone,
      ...(siteConfig.logoLinear ? { logo: { "@type": "ImageObject", url: `${siteConfig.url}${siteConfig.logoLinear}` } } : {}),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <>
      <section className="page-header article-page-header">
        <div className="container">
          <Link className="btn-back" href="/blog">&#8592; Back to insights</Link>
          <span className="eyebrow">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span><time dateTime={post.date}>{formatBlogDate(post.date)}</time></span>
            <span>{post.author}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container-article">
          {post.image ? (
            <div className="article-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.imageAlt ?? ""} loading="lazy" />
            </div>
          ) : null}

          <div className="article-body">
            {post.sections.map((s, i) => (
              <BlogSectionView key={s.heading ?? `s-${i}`} section={s} />
            ))}
          </div>

          <div style={{ marginTop: "2.5rem", borderTop: "var(--bw) solid var(--border)", paddingTop: "1.5rem" }}>
            <ShareButtons url={url} title={post.title} />
          </div>

          <p style={{ marginTop: "1.5rem", fontSize: "var(--small)", color: "var(--ink-faint)" }}>
            Published {formatBlogDate(post.date)}. {blogDisclaimer}
          </p>

          <div className="article-back-footer">
            <Link className="btn btn-primary" href="/blog">&#8592; Back to all insights</Link>
          </div>
        </div>
      </section>

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <CustomSchema route={blogHref(post.slug)} />
    </>
  );
}
