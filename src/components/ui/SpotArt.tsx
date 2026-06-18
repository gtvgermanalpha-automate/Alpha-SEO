/**
 * Custom flat "spot" illustrations — consistent charcoal/bronze/cream style,
 * no stock imagery. Used to give sections a bespoke, hand-made feel.
 */
/** Runtime list of available illustration keys — for CMS pickers and validation. */
export const artNames = ["tax", "advisory", "bookkeeping", "vat", "payroll", "formation"] as const;
export type Name = (typeof artNames)[number];

/** Whether a string is a known illustration key. */
export function isArtName(value: unknown): value is Name {
  return typeof value === "string" && (artNames as readonly string[]).includes(value);
}

export function SpotArt({ name, className = "" }: { name: Name; className?: string }) {
  const common = { className: `h-auto w-full ${className}`, fill: "none", role: "img" as const };

  if (name === "advisory") {
    return (
      <svg viewBox="0 0 220 180" aria-label="Business advisory illustration" {...common}>
        <rect x="16" y="26" width="188" height="128" rx="20" fill="#ecf5fe" />
        <circle cx="40" cy="44" r="6" fill="#1d66ba" fillOpacity="0.5" />
        <circle cx="188" cy="138" r="5" fill="#24282b" fillOpacity="0.12" />
        {/* axes */}
        <path d="M58 132h112M58 132V58" stroke="#cbd3db" strokeWidth="2" strokeLinecap="round" />
        {/* bars */}
        <rect x="72" y="104" width="18" height="28" rx="3" fill="#cdd6df" />
        <rect x="98" y="90" width="18" height="42" rx="3" fill="#24282b" />
        <rect x="124" y="74" width="18" height="58" rx="3" fill="#cdd6df" />
        <rect x="150" y="58" width="18" height="74" rx="3" fill="#1d66ba" />
        {/* trend arrow */}
        <path d="M64 116l28-14 26 8 30-30" stroke="#1d66ba" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M136 80h12v12" stroke="#1d66ba" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="92" cy="102" r="4" fill="#ffffff" stroke="#1d66ba" strokeWidth="2.5" />
        <circle cx="118" cy="110" r="4" fill="#ffffff" stroke="#1d66ba" strokeWidth="2.5" />
      </svg>
    );
  }

  if (name === "bookkeeping") {
    return (
      <svg viewBox="0 0 220 180" aria-label="Bookkeeping illustration" {...common}>
        <rect x="16" y="26" width="188" height="128" rx="20" fill="#ecf5fe" />
        <circle cx="184" cy="46" r="6" fill="#1d66ba" fillOpacity="0.5" />
        {/* ledger */}
        <rect x="52" y="48" width="116" height="86" rx="10" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        <path d="M110 48v86" stroke="#e5e7eb" strokeWidth="2" />
        {[64, 78, 92, 106].map((y) => (
          <g key={y}>
            <rect x="64" y={y} width="34" height="5" rx="2.5" fill="#cbd3db" />
            <rect x="120" y={y} width="22" height="5" rx="2.5" fill={y === 78 ? "#1d66ba" : "#cbd3db"} />
          </g>
        ))}
        {/* pen + check */}
        <circle cx="160" cy="118" r="16" fill="#1d66ba" />
        <path d="M153 118l5 5 9-10" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "payroll") {
    return (
      <svg viewBox="0 0 220 180" aria-label="Payroll illustration" {...common}>
        <rect x="16" y="26" width="188" height="128" rx="20" fill="#ecf5fe" />
        <circle cx="40" cy="44" r="6" fill="#1d66ba" fillOpacity="0.5" />
        <circle cx="190" cy="140" r="5" fill="#24282b" fillOpacity="0.12" />
        <rect x="44" y="40" width="96" height="104" rx="10" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        <rect x="44" y="40" width="96" height="22" rx="10" fill="#24282b" />
        <rect x="44" y="52" width="96" height="10" fill="#24282b" />
        <rect x="56" y="55" width="42" height="6" rx="3" fill="#ffffff" fillOpacity="0.85" />
        {[74, 88, 102].map((y) => (
          <g key={y}>
            <rect x="56" y={y} width="32" height="5" rx="2.5" fill="#cbd3db" />
            <rect x="104" y={y} width="22" height="5" rx="2.5" fill="#cbd3db" />
          </g>
        ))}
        <rect x="56" y="120" width="28" height="6" rx="3" fill="#24282b" />
        <rect x="100" y="119" width="28" height="8" rx="4" fill="#1d66ba" />
        <circle cx="160" cy="66" r="22" fill="#1d66ba" />
        <circle cx="160" cy="60" r="7" fill="#ffffff" />
        <path d="M149 80a11 11 0 0 1 22 0z" fill="#ffffff" />
        <circle cx="158" cy="122" r="16" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        <path d="M153 128c3 0 3.5-2 6.5-2M152 122h8M155 128v-9c0-2.5 2-4 4.5-4 1.1 0 2.1.5 3 1.3" stroke="#1d66ba" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "vat") {
    return (
      <svg viewBox="0 0 220 180" aria-label="VAT returns illustration" {...common}>
        <rect x="16" y="26" width="188" height="128" rx="20" fill="#ecf5fe" />
        <circle cx="186" cy="44" r="6" fill="#1d66ba" fillOpacity="0.5" />
        <circle cx="36" cy="138" r="5" fill="#24282b" fillOpacity="0.12" />
        <rect x="46" y="40" width="88" height="104" rx="10" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        <rect x="58" y="56" width="48" height="6" rx="3" fill="#24282b" />
        {[74, 88, 102, 116].map((y, i) => (
          <rect key={y} x="58" y={y} width={i % 2 ? 40 : 56} height="5" rx="2.5" fill="#cbd3db" />
        ))}
        <circle cx="156" cy="58" r="26" fill="#1d66ba" />
        <circle cx="148" cy="50" r="4.5" fill="#ffffff" />
        <circle cx="164" cy="66" r="4.5" fill="#ffffff" />
        <path d="M166 48l-20 20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="118" r="16" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        <path d="M143 118l5 5 9-10" stroke="#1d66ba" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "formation") {
    return (
      <svg viewBox="0 0 220 180" aria-label="Company formation illustration" {...common}>
        <rect x="16" y="26" width="188" height="128" rx="20" fill="#ecf5fe" />
        <circle cx="40" cy="44" r="6" fill="#1d66ba" fillOpacity="0.5" />
        <circle cx="188" cy="140" r="5" fill="#24282b" fillOpacity="0.12" />
        <rect x="48" y="52" width="60" height="92" rx="6" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        {[62, 80, 98].flatMap((y) =>
          [58, 76].map((x) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" rx="2" fill={y === 62 && x === 76 ? "#1d66ba" : "#cdd6df"} />
          ))
        )}
        <rect x="70" y="124" width="16" height="20" rx="2" fill="#24282b" />
        <rect x="118" y="64" width="82" height="60" rx="8" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
        <rect x="130" y="78" width="44" height="5" rx="2.5" fill="#24282b" />
        <rect x="130" y="90" width="58" height="4" rx="2" fill="#cbd3db" />
        <rect x="130" y="100" width="50" height="4" rx="2" fill="#cbd3db" />
        <circle cx="178" cy="116" r="14" fill="#1d66ba" />
        <path d="M172 116l4 4 8-9" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // tax (default)
  return (
    <svg viewBox="0 0 220 180" aria-label="Tax planning illustration" {...common}>
      <rect x="16" y="26" width="188" height="128" rx="20" fill="#ecf5fe" />
      <circle cx="40" cy="140" r="6" fill="#1d66ba" fillOpacity="0.5" />
      <circle cx="190" cy="120" r="5" fill="#24282b" fillOpacity="0.12" />
      {/* form document */}
      <rect x="48" y="36" width="92" height="112" rx="10" fill="#ffffff" stroke="#24282b" strokeWidth="2.5" />
      <rect x="48" y="36" width="92" height="22" rx="10" fill="#24282b" />
      <rect x="48" y="48" width="92" height="10" fill="#24282b" />
      {[70, 84, 98, 112, 126].map((y, i) => (
        <rect key={y} x="60" y={y} width={i % 2 === 0 ? 60 : 44} height="5" rx="2.5" fill="#cbd3db" />
      ))}
      <rect x="60" y="70" width="28" height="5" rx="2.5" fill="#1d66ba" />
      {/* £ badge */}
      <circle cx="150" cy="58" r="24" fill="#1d66ba" />
      <circle cx="150" cy="58" r="24" stroke="#b5381f" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M142 70c5 0 6-3 11-3M141 58h13M145 70V53c0-4 3-7 8-7 2 0 4 1 5 2" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* savings arrow */}
      <path d="M158 110v22m0 0l-7-7m7 7l7-7" stroke="#1d66ba" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
