import Markdown from "markdown-to-jsx";
import Link from "next/link";
import type { ReactNode } from "react";

/** Links: internal ("/..." but not "//", or "#...") use next/link; external open
 *  in a new tab. markdown-to-jsx passes href=null for sanitized (javascript:/data:)
 *  hrefs — render those as plain text rather than crashing on null. */
function MdLink({ href, title, children }: { href?: string | null; title?: string; children?: ReactNode }) {
  const h = href ?? "";
  if (!h) return <span>{children}</span>;
  const cls =
    "font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent";
  if ((h.startsWith("/") && !h.startsWith("//")) || h.startsWith("#")) {
    return (
      <Link href={h} title={title} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={h} title={title} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  );
}

/** Tables get a horizontal-scroll wrapper + the site's table styling. */
function MdTable({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

function MdImg({ src, alt = "" }: { src?: string | null; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-blue/30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full object-contain" />
      {alt ? <figcaption className="px-4 py-2 text-xs text-muted">{alt}</figcaption> : null}
    </figure>
  );
}

const overrides = {
  h1: { props: { className: "mt-8 font-display text-2xl text-ink sm:text-3xl" } },
  h2: { props: { className: "mt-8 font-display text-xl text-ink sm:text-2xl" } },
  h3: { props: { className: "mt-6 font-display text-lg text-ink" } },
  h4: { props: { className: "mt-5 font-display text-base font-bold text-ink" } },
  p: { props: { className: "mt-3 text-[0.95rem] leading-relaxed text-muted" } },
  ul: { props: { className: "mt-4 list-disc space-y-2 pl-5 marker:text-accent" } },
  ol: { props: { className: "mt-4 list-decimal space-y-2 pl-5 marker:text-accent" } },
  li: { props: { className: "text-[0.95rem] leading-relaxed text-muted" } },
  strong: { props: { className: "font-semibold text-ink" } },
  em: { props: { className: "italic" } },
  a: { component: MdLink },
  blockquote: { props: { className: "mt-4 border-l-2 border-accent pl-4 italic text-muted" } },
  hr: { props: { className: "my-8 border-line" } },
  code: { props: { className: "rounded bg-cream px-1.5 py-0.5 font-mono text-[0.85em] text-ink" } },
  table: { component: MdTable },
  thead: { props: { className: "bg-cream/60" } },
  th: { props: { className: "whitespace-nowrap px-4 py-3 font-semibold text-ink" } },
  td: { props: { className: "border-t border-line px-4 py-3 text-muted" } },
  img: { component: MdImg },
};

/**
 * Renders Markdown body content with the site's typography. Editors can use
 * ## headings, **bold**, [links](/services/vat), tables, lists and images — the
 * content the SEO team needs. Plain text renders as normal paragraphs.
 */
export function MarkdownContent({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`[&>*:first-child]:mt-0 ${className ?? ""}`}>
      <Markdown options={{ forceBlock: true, disableParsingRawHTML: true, overrides }}>{children}</Markdown>
    </div>
  );
}
