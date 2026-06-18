import { siteConfig } from "@/lib/content";

type Tone = "dark" | "light";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { mmr: string; rule: string; acc: string; pillars: string }> = {
  sm: { mmr: "text-xl", rule: "h-6", acc: "text-[0.58rem]", pillars: "text-[0.48rem]" },
  md: { mmr: "text-2xl", rule: "h-8", acc: "text-[0.64rem]", pillars: "text-[0.52rem]" },
  lg: { mmr: "text-4xl", rule: "h-12", acc: "text-[0.8rem]", pillars: "text-[0.62rem]" },
};

/**
 * MMR Accountants horizontal lockup — Didone wordmark, bronze rule,
 * tracked "ACCOUNTANTS" and "TAX | ADVISORY | PAYROLL".
 * Typographic rebuild of the brand mark; swap in the supplied asset later if desired.
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
  // Use the uploaded linear brand logo on light surfaces. It's a blue mark, so the
  // typographic white lockup is kept for dark surfaces (e.g. the footer falls back).
  if (siteConfig.logoLinear && tone !== "light") {
    const h = size === "lg" ? "h-12" : size === "sm" ? "h-7" : "h-9";
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={siteConfig.logoLinear} alt={siteConfig.name} className={`${h} w-auto object-contain ${className}`} />;
  }

  const s = sizes[size];
  const main = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-white/85" : "text-ink";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`font-display font-extrabold leading-none ${s.mmr} ${main}`}
        style={{ letterSpacing: "-0.02em" }}
      >
        MMR
      </span>
      <span className={`w-px ${s.rule} bg-bronze/60`} aria-hidden />
      <span className="flex flex-col gap-1">
        <span
          className={`font-sans font-semibold uppercase ${s.acc} ${sub}`}
          style={{ letterSpacing: "0.3em" }}
        >
          Accountants
        </span>
        <span
          className={`flex items-center gap-1.5 font-sans font-medium uppercase ${s.pillars} ${
            tone === "light" ? "text-white/70" : "text-muted"
          }`}
          style={{ letterSpacing: "0.18em" }}
        >
          {siteConfig.pillars.map((p, i) => (
            <span key={p} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-bronze">|</span>}
              {p}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

/** Compact MMR-only mark (favicon / chat avatar / small spots). */
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
      MMR
    </span>
  );
}
