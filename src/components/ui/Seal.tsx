/**
 * Decorative circular "seal" sticker — rotating tracked text around a ring
 * with the MMR monogram at the centre. Rotation stills under reduced motion.
 */
export function Seal({ id = "seal", className = "" }: { id?: string; className?: string }) {
  const pathId = `${id}-ring`;
  return (
    <div className={`relative grid place-items-center ${className}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="h-full w-full motion-safe:animate-[spin_24s_linear_infinite]">
        <defs>
          <path id={pathId} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="none" stroke="#ee5935" strokeWidth="1" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="#ee5935" strokeWidth="1" />
        <text
          fill="#24282b"
          style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase" }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            · Chartered Practice · Tax · Advisory · Payroll
          </textPath>
        </text>
      </svg>
      <span className="absolute font-display text-lg font-semibold text-bronze">MMR</span>
    </div>
  );
}
