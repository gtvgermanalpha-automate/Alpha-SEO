import { type CSSProperties, type ReactNode, createElement } from "react";

const tags = ["div", "li", "ul", "section", "span", "p"] as const;
type Tag = (typeof tags)[number];

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay (seconds) for sequencing reveals */
  delay?: number;
  /** Vertical travel distance in px */
  y?: number;
  as?: Tag;
};

/**
 * Fade + slide-in once the element scrolls into view — driven by CSS
 * transitions (see globals.css) and the page-level RevealObserver. Content is
 * visible by default; the hidden state only applies when JS is running and the
 * user allows motion, so it works reliably on iOS/WebKit and degrades safely.
 */
export function Reveal({ children, className = "", delay = 0, y, as = "div" }: RevealProps) {
  const style: CSSProperties = {};
  if (delay) (style as Record<string, string>)["--reveal-delay"] = `${delay}s`;
  if (y != null) (style as Record<string, string>)["--reveal-y"] = `${y}px`;

  return createElement(
    as,
    {
      "data-reveal": "",
      className,
      ...(Object.keys(style).length ? { style } : {}),
    },
    children,
  );
}
