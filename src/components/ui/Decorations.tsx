/**
 * Tiny decorative SVG accents used across the site — dot clusters, a hand-drawn
 * underline, rings and plus marks. They make pages feel hand-composed rather than
 * generated. All are presentational and hidden from assistive tech.
 */

export function DotCluster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className={className} fill="#1d66ba">
      {Array.from({ length: 5 }).flatMap((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={6 + c * 12} cy={6 + r * 12} r="2" fillOpacity={0.45 - (r + c) * 0.02} />
        ))
      )}
    </svg>
  );
}

/** Hand-drawn bronze underline to sit beneath a highlighted word. */
export function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" aria-hidden className={className} fill="none" preserveAspectRatio="none">
      <path
        d="M2 8C40 3 70 3 100 6c30 3 60 3 98-2"
        stroke="#1d66ba"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RingAccent({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden className={className} fill="none">
      <circle cx="40" cy="40" r="34" stroke="#1d66ba" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 9" />
    </svg>
  );
}

export function PlusMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <path d="M12 4v16M4 12h16" stroke="#1d66ba" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
