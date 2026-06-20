import { type ReactNode } from "react";

/**
 * Sub-page banner header — the original static site's `.page-header`
 * (eyebrow + highlighted h1 + subtitle), re-themed light. Optionally takes a
 * relevant `image` rendered beside the heading (desktop) for visual interest.
 *
 * Legacy visual props (parent/illus/art/icon) are still accepted so old callers
 * compile, but are no longer rendered.
 */
export function PageHero({
  title,
  subtitle,
  crumb,
  eyebrow,
  image,
  imageAlt,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  crumb?: string;
  eyebrow?: string;
  image?: string;
  imageAlt?: string;
  parent?: { label: string; href: string };
  illus?: string;
  art?: string;
  icon?: string;
}) {
  const eb = eyebrow ?? crumb;
  return (
    <section className="page-header">
      <div className={`container${image ? " page-header-grid" : ""}`}>
        <div className="page-header-text">
          {eb ? <span className="eyebrow">{eb}</span> : null}
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {image ? (
          <div className="page-header-art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={imageAlt ?? ""} loading="eager" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
