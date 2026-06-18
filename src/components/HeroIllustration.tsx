"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Custom flat illustration (no stock imagery) — a financial dashboard scene
 * in the MMR charcoal/bronze palette, with subtly floating accent cards.
 */
export function HeroIllustration() {
  const reduce = useReducedMotion();
  const float = (dy: number, dur: number, delay = 0) =>
    reduce
      ? {}
      : { animate: { y: [0, dy, 0] }, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay } };

  return (
    <svg viewBox="0 0 560 500" className="h-auto w-full" role="img" aria-label="Illustration of an accounting dashboard with charts and reports" fill="none">
      {/* soft backdrop */}
      <circle cx="300" cy="240" r="220" fill="#ecf5fe" />
      <circle cx="300" cy="240" r="220" stroke="#1d66ba" strokeOpacity="0.12" strokeDasharray="2 8" />

      {/* main dashboard card */}
      <g>
        <rect x="120" y="96" width="320" height="300" rx="20" fill="#ffffff" stroke="#e5e7eb" />
        <rect x="120" y="96" width="320" height="56" rx="20" fill="#24282b" />
        <rect x="120" y="130" width="320" height="22" fill="#24282b" />
        <circle cx="148" cy="124" r="9" fill="#1d66ba" />
        <rect x="166" y="118" width="86" height="6" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="166" y="130" width="54" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.45" />
        <rect x="392" y="118" width="28" height="14" rx="7" fill="#1d66ba" />

        {/* label + figure */}
        <rect x="148" y="178" width="70" height="7" rx="3.5" fill="#b7c0c9" />
        <rect x="148" y="194" width="120" height="14" rx="4" fill="#24282b" />
        <rect x="360" y="186" width="52" height="20" rx="6" fill="#ecf5fe" />
        <path d="M372 200l5-6 4 4 7-8" stroke="#1d66ba" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* bar chart */}
        <line x1="148" y1="332" x2="412" y2="332" stroke="#e5e7eb" />
        <rect x="158" y="296" width="30" height="36" rx="4" fill="#cdd6df" />
        <rect x="200" y="274" width="30" height="58" rx="4" fill="#24282b" />
        <rect x="242" y="286" width="30" height="46" rx="4" fill="#cdd6df" />
        <rect x="284" y="252" width="30" height="80" rx="4" fill="#1d66ba" />
        <rect x="326" y="268" width="30" height="64" rx="4" fill="#24282b" />
        <rect x="368" y="240" width="30" height="92" rx="4" fill="#1d66ba" />
        {/* trend line */}
        <path d="M173 300 L215 286 L257 292 L299 262 L341 276 L383 250" stroke="#1d66ba" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {[173, 215, 257, 299, 341, 383].map((cx, i) => (
          <circle key={cx} cx={cx} cy={[300, 286, 292, 262, 276, 250][i]} r="3.4" fill="#ffffff" stroke="#1d66ba" strokeWidth="2" />
        ))}

        {/* footer rows */}
        <rect x="148" y="356" width="120" height="24" rx="6" fill="#f5f7fa" />
        <rect x="160" y="365" width="44" height="6" rx="3" fill="#b7c0c9" />
        <rect x="292" y="356" width="120" height="24" rx="6" fill="#f5f7fa" />
        <rect x="304" y="365" width="44" height="6" rx="3" fill="#b7c0c9" />
      </g>

      {/* floating: £ coin */}
      <motion.g {...float(-10, 5)}>
        <circle cx="96" cy="150" r="34" fill="#1d66ba" />
        <circle cx="96" cy="150" r="34" stroke="#b5381f" strokeOpacity="0.25" />
        <path d="M88 166c6 0 7-4 12-4M86 152h14M90 166v-18c0-5 4-8 9-8 3 0 5 1 7 3" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* floating: check badge */}
      <motion.g {...float(10, 6, 0.4)}>
        <rect x="430" y="120" width="78" height="58" rx="14" fill="#ffffff" stroke="#e5e7eb" />
        <circle cx="452" cy="149" r="13" fill="#ecf5fe" />
        <path d="M446 149l4 4 7-8" stroke="#1d66ba" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="472" y="142" width="28" height="6" rx="3" fill="#24282b" />
        <rect x="472" y="154" width="20" height="5" rx="2.5" fill="#b7c0c9" />
      </motion.g>

      {/* floating: donut chart */}
      <motion.g {...float(-8, 6.5, 0.2)}>
        <rect x="60" y="320" width="92" height="92" rx="16" fill="#ffffff" stroke="#e5e7eb" />
        <circle cx="106" cy="366" r="26" stroke="#cdd6df" strokeWidth="9" />
        <path d="M106 340a26 26 0 0 1 22 39" stroke="#1d66ba" strokeWidth="9" strokeLinecap="round" />
        <path d="M128 379a26 26 0 0 1-22 13" stroke="#24282b" strokeWidth="9" strokeLinecap="round" />
      </motion.g>

      {/* floating: receipt card */}
      <motion.g {...float(9, 5.5, 0.6)}>
        <rect x="420" y="300" width="96" height="110" rx="12" fill="#ffffff" stroke="#e5e7eb" />
        <rect x="436" y="318" width="40" height="7" rx="3.5" fill="#24282b" />
        <rect x="436" y="336" width="64" height="5" rx="2.5" fill="#cbd3db" />
        <rect x="436" y="350" width="64" height="5" rx="2.5" fill="#cbd3db" />
        <rect x="436" y="364" width="44" height="5" rx="2.5" fill="#cbd3db" />
        <rect x="436" y="386" width="34" height="12" rx="6" fill="#1d66ba" />
      </motion.g>
    </svg>
  );
}
