/**
 * Premium, deliberately-subtle background effects: soft blurred glows,
 * a faint dot grid and a low-opacity mesh gradient. Corporate, not flashy.
 * Purely decorative — hidden from assistive tech, no pointer events.
 */
export function BackgroundFX({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "subtle" | "cta";
  className?: string;
}) {
  if (variant === "subtle") {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-mesh opacity-70" />
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-dots opacity-60" />
        <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-[26rem] w-[26rem] rounded-full bg-accent/15 blur-3xl" />
      </div>
    );
  }

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-dots" />
      <div className="absolute -right-24 -top-28 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl motion-safe:animate-[floatY_13s_ease-in-out_infinite]" />
      <div className="absolute -left-32 top-44 h-[26rem] w-[26rem] rounded-full bg-blue/60 blur-3xl motion-safe:animate-[floatXY_16s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 right-1/4 h-[22rem] w-[22rem] rounded-full bg-accent/[0.08] blur-3xl" />
    </div>
  );
}
