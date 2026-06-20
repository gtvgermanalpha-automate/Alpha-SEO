import Markdown from "markdown-to-jsx";
import Link from "next/link";
import type { ReactNode } from "react";

/** Internal links use next/link; external open in a new tab. Unstyled — the
 *  original `.article-body a` rule colours them. */
function MdLink({ href, title, children }: { href?: string | null; title?: string; children?: ReactNode }) {
  const h = href ?? "";
  if (!h) return <span>{children}</span>;
  if ((h.startsWith("/") && !h.startsWith("//")) || h.startsWith("#")) {
    return (
      <Link href={h} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <a href={h} title={title} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function MdImg({ src, alt = "" }: { src?: string | null; alt?: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" />;
}

const overrides = { a: { component: MdLink }, img: { component: MdImg } };

/**
 * Renders Markdown body content as plain HTML elements (no utility classes) so
 * the original static-site `.article-body` CSS styles it. Always place inside a
 * `.article-body` wrapper. Editors can use ## headings, **bold**, lists, links
 * and images.
 */
export function Md({ children }: { children: string }) {
  return (
    <Markdown options={{ forceBlock: true, disableParsingRawHTML: true, overrides }}>{children}</Markdown>
  );
}
