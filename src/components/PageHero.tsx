import { type ReactNode } from "react";

/**
 * Sub-page banner header — the original static site's navy `.page-header`
 * (eyebrow + highlighted h1 + subtitle), re-themed light in globals.css.
 *
 * Legacy visual props (parent/illus/art/icon) are still accepted so existing
 * callers compile, but the original design has no side visual, so they are not
 * rendered.
 */
export function PageHero({
  title,
  subtitle,
  crumb,
  eyebrow,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  crumb?: string;
  eyebrow?: string;
  parent?: { label: string; href: string };
  illus?: string;
  art?: string;
  icon?: string;
}) {
  const eb = eyebrow ?? crumb;
  return (
    <section className="page-header">
      <div className="container">
        {eb ? <span className="eyebrow">{eb}</span> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  );
}
