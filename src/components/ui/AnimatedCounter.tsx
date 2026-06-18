"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up from 0 to `value` the first time it scrolls into view. */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-GB", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduce) {
      node.textContent = format(value);
      return;
    }
    if (!inView) {
      node.textContent = format(0);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, prefix, suffix, decimals]);

  // SSR / no-JS fallback shows the real figure for crawlers.
  return (
    <span ref={ref} className={className} aria-hidden="false">
      {format(value)}
    </span>
  );
}
