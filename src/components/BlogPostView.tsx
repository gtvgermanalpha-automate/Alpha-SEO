import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { CtaBand } from "@/components/CtaBand";
import { ShareButtons } from "@/components/ShareButtons";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
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

const PARENT = { label: "Blog", href: "/blog" };

function Section({ section }: { section: BlogSection }) {
  return (
    <div>
      {section.heading ? (
        <h2 className="font-display text-xl text-ink sm:text-2xl">{section.heading}</h2>
      ) : null}

      {section.body.length ? (
        <MarkdownContent className={section.heading ? "mt-3" : ""}>{section.body.join("\n\n")}</MarkdownContent>
      ) : null}

      {section.bullets ? (
        <ul className="mt-4 flex flex-col gap-2.5">
          {section.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.links ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {section.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-ink/5"
              >
                <span>{l.label}</span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {section.table ? (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream/60">
                {section.table.headers.map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-line">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-muted">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.image ? (
        <figure className="mt-5 overflow-hidden rounded-2xl border border-line bg-blue/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.image} alt={section.imageAlt ?? ""} className="w-full object-contain" />
          {section.imageAlt ? <figcaption className="px-4 py-2 text-xs text-muted">{section.imageAlt}</figcaption> : null}
        </figure>
      ) : null}
    </div>
  );
}

/** Shared renderer for a single Blog / News article. */
export function BlogPostView({ post }: { post: BlogPost }) {
  const url = `${siteConfig.url}${blogHref(post.slug)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
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
    ...(post.image ? { image: `${siteConfig.url}${post.image}` } : {}),
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "AccountingService",
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
      <PageHero crumb={post.title} parent={PARENT} title={post.title} subtitle={post.excerpt} />

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <BackgroundFX variant="subtle" />
        <Container className="relative">
          <Reveal className="mx-auto max-w-3xl">
            {/* Post meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span className="rounded-full bg-blue px-3 py-1 text-accent">{post.category}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden />
                <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5 text-accent" aria-hidden />
                {post.author}
              </span>
            </div>

            {/* Hero image */}
            {post.image ? (
              <figure className="mt-8 aspect-[16/8] overflow-hidden rounded-2xl border border-line bg-blue/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.imageAlt ?? ""} className="h-full w-full object-contain p-8 sm:p-10" />
              </figure>
            ) : null}

            {/* Body */}
            <div className="mt-10 flex flex-col gap-9">
              {post.sections.map((s, i) => (
                <Section key={s.heading ?? `s-${i}`} section={s} />
              ))}
            </div>

            {/* Share */}
            <div className="mt-12 border-t border-line pt-8">
              <ShareButtons url={url} title={post.title} />
            </div>

            {/* Disclaimer */}
            <p className="mt-8 text-xs leading-relaxed text-muted/80">
              Published {formatBlogDate(post.date)}. {blogDisclaimer}
            </p>

            {/* Back to blog */}
            <div className="mt-10">
              <Link
                href={PARENT.href}
                className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
              >
                <ArrowLeft
                  className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden
                />
                All articles
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <CustomSchema route={blogHref(post.slug)} />
    </>
  );
}
