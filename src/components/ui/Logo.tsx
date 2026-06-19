type Tone = "dark" | "light";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { word: string; rule: string; desc: string }> = {
  sm: { word: "text-xl", rule: "h-6", desc: "text-[0.5rem]" },
  md: { word: "text-2xl", rule: "h-8", desc: "text-[0.55rem]" },
  lg: { word: "text-4xl", rule: "h-12", desc: "text-[0.7rem]" },
};

/**
 * Alpha Digital Solutions horizontal lockup — "Alpha" wordmark, an accent
 * keyline, and a tracked "DIGITAL / SOLUTIONS" descriptor. Fully typographic
 * (no image dependency) so it recolours by context: ink on light surfaces,
 * white on dark. Header/Footer swap in `settings.logoLinear` artwork when that
 * field is set; this lockup is the default and the dark-surface mark.
 */
export function Logo({
  tone = "dark",
  size = "md",
  className = "",
}: {
  tone?: Tone;
  size?: Size;
  className?: string;
}) {
  const s = sizes[size];
  const word = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-white/80" : "text-muted";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="Alpha Digital Solutions">
      <span
        className={`font-display font-extrabold leading-none ${s.word} ${word}`}
        style={{ letterSpacing: "-0.02em" }}
      >
        Alpha
      </span>
      <span className={`w-px ${s.rule} bg-accent/70`} aria-hidden />
      <span className="flex flex-col gap-0.5">
        <span
          className={`font-sans font-bold uppercase ${s.desc} ${word}`}
          style={{ letterSpacing: "0.28em" }}
        >
          Digital
        </span>
        <span
          className={`font-sans font-semibold uppercase ${s.desc} ${sub}`}
          style={{ letterSpacing: "0.28em" }}
        >
          Solutions
        </span>
      </span>
    </span>
  );
}

/** Compact "Alpha" mark (favicon / avatar / small spots). */
export function LogoMark({
  tone = "dark",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`font-display font-extrabold leading-none ${
        tone === "light" ? "text-white" : "text-ink"
      } ${className}`}
      style={{ letterSpacing: "-0.02em" }}
    >
      Alpha
    </span>
  );
}
