import { type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/**
 * Bespoke flat "pillar" illustrations — on-brand (navy/aster/habanero), no stock
 * imagery. One per service-detail section (see @/lib/detailIllustrations), plus
 * `social-hero` for the Social Media Marketing page's extra hero decoration and
 * a handful reused as Portfolio-hub category pictures.
 */
export const pillarIllustNames = [
  "audit",
  "engineering-layers",
  "roadmap",
  "report",
  "reader-doc",
  "fork-path",
  "content-map",
  "social-grid",
  "content-calendar",
  "engagement-bubbles",
  "social-hero",
  "map-pins",
  "storefront-profile",
  "community-network",
  "ai-citation",
] as const;
export type PillarIllustName = (typeof pillarIllustNames)[number];

const C = {
  navy: "#111144",
  soft: "#c9d2e4",
  soft2: "#dbe2f0",
  aster: "#9bacd8",
  aster600: "#7e93c6",
  tint: "#e3e9f6",
  gold: "#f98513",
};

/** Backdrop shared by every scene (rounded card on the aster tint). */
function Scene({ children }: { children: ReactNode }) {
  return (
    <>
      <rect x="8" y="8" width="304" height="224" rx="28" fill={C.tint} />
      {children}
    </>
  );
}

/** Reliable teardrop map-pin built from a circle + triangle (no curvy path risk). */
function Pin({ cx, cy, r = 22, fill }: { cx: number; cy: number; r?: number; fill: string }) {
  const half = r * 0.45;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <polygon points={`${cx - half},${cy + r * 0.35} ${cx + half},${cy + r * 0.35} ${cx},${cy + r * 1.6}`} fill={fill} />
      <circle cx={cx} cy={cy} r={r * 0.4} fill="#fff" />
    </g>
  );
}

/** 4-point sparkle/star, built from 8 equally-spaced points (no bezier risk). */
function Sparkle({ cx, cy, size = 8, fill }: { cx: number; cy: number; size?: number; fill: string }) {
  const s = size * 0.28;
  const pts = [
    [cx, cy - size],
    [cx + s, cy - s],
    [cx + size, cy],
    [cx + s, cy + s],
    [cx, cy + size],
    [cx - s, cy + s],
    [cx - size, cy],
    [cx - s, cy - s],
  ]
    .map((p) => p.join(","))
    .join(" ");
  return <polygon points={pts} fill={fill} />;
}

/** Gear/settings glyph — circle body + 8 rotated teeth (reliable, no path arcs). */
function Gear({ cx, cy, r = 20, fill }: { cx: number; cy: number; r?: number; fill: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x={cx - 4}
          y={cy - r - 12}
          width="8"
          height="14"
          rx="2"
          fill={fill}
          transform={`rotate(${deg} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.45} fill="none" stroke="#fff" strokeWidth="3.5" />
    </g>
  );
}

/** Filled heart (standard 24x24 glyph, scaled/translated into place). */
function Heart({ x, y, scale = 1, fill }: { x: number; y: number; scale?: number; fill: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={fill}
    />
  );
}

/** Rounded speech-bubble with a tail, for community / engagement scenes. */
function Bubble({ x, y, w, h, tailX, fill }: { x: number; y: number; w: number; h: number; tailX: number; fill: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} />
      <polygon points={`${tailX},${y + h} ${tailX},${y + h + 16} ${tailX + 18},${y + h}`} fill={fill} />
    </g>
  );
}

function renderScene(name: PillarIllustName) {
  switch (name) {
    case "audit":
      return (
        <Scene>
          <rect x="46" y="44" width="182" height="124" rx="14" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <rect x="46" y="44" width="182" height="27" rx="14" fill={C.navy} />
          <rect x="46" y="57" width="182" height="14" fill={C.navy} />
          <circle cx="60" cy="58" r="4" fill="#fff" fillOpacity=".55" />
          <circle cx="73" cy="58" r="4" fill="#fff" fillOpacity=".55" />
          <circle cx="86" cy="58" r="4" fill="#fff" fillOpacity=".55" />
          <rect x="64" y="92" width="140" height="7" rx="3.5" fill={C.gold} />
          <rect x="64" y="110" width="112" height="6" rx="3" fill={C.soft} />
          <rect x="64" y="126" width="128" height="6" rx="3" fill={C.soft} />
          <rect x="64" y="142" width="92" height="6" rx="3" fill={C.soft} />
          <circle cx="228" cy="150" r="36" fill={C.gold} />
          <circle cx="222" cy="142" r="16" fill="none" stroke="#fff" strokeWidth="5" />
          <line x1="233" y1="153" x2="248" y2="168" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </Scene>
      );

    case "engineering-layers":
      return (
        <Scene>
          <rect x="64" y="152" width="180" height="32" rx="8" fill={C.soft} />
          <rect x="80" y="114" width="180" height="32" rx="8" fill={C.aster} />
          <rect x="96" y="76" width="180" height="32" rx="8" fill={C.navy} />
          <Gear cx={246} cy={64} r={20} fill={C.gold} />
        </Scene>
      );

    case "roadmap":
      return (
        <Scene>
          <polyline
            points="44,188 122,158 200,118 270,72"
            fill="none"
            stroke={C.soft2}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="44" cy="188" r="17" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <text x="44" y="193" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.navy}>1</text>
          <circle cx="122" cy="158" r="17" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <text x="122" y="163" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.navy}>2</text>
          <circle cx="200" cy="118" r="17" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <text x="200" y="123" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.navy}>3</text>
          <circle cx="270" cy="72" r="19" fill={C.gold} />
          <text x="270" y="78" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">4</text>
        </Scene>
      );

    case "report":
      return (
        <Scene>
          <rect x="64" y="42" width="132" height="156" rx="12" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <path d="M172 42v26a6 6 0 0 0 6 6h24" fill="none" stroke={C.navy} strokeWidth="2.5" />
          <rect x="82" y="88" width="98" height="7" rx="3.5" fill={C.gold} />
          <rect x="82" y="106" width="88" height="6" rx="3" fill={C.soft} />
          <rect x="82" y="122" width="96" height="6" rx="3" fill={C.soft} />
          <rect x="82" y="138" width="70" height="6" rx="3" fill={C.soft} />
          <rect x="82" y="160" width="90" height="6" rx="3" fill={C.soft} />
          <rect x="198" y="148" width="18" height="50" rx="4" fill={C.aster} />
          <rect x="222" y="126" width="18" height="72" rx="4" fill={C.navy} />
          <rect x="246" y="106" width="18" height="92" rx="4" fill={C.gold} />
        </Scene>
      );

    case "reader-doc":
      return (
        <Scene>
          <rect x="56" y="58" width="98" height="134" rx="10" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <rect x="166" y="58" width="98" height="134" rx="10" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <rect x="150" y="58" width="20" height="134" fill={C.tint} />
          <rect x="72" y="84" width="66" height="6" rx="3" fill={C.gold} />
          <rect x="72" y="102" width="54" height="5" rx="2.5" fill={C.soft} />
          <rect x="72" y="118" width="60" height="5" rx="2.5" fill={C.soft} />
          <rect x="72" y="134" width="44" height="5" rx="2.5" fill={C.soft} />
          <rect x="182" y="84" width="60" height="5" rx="2.5" fill={C.soft} />
          <rect x="182" y="102" width="66" height="5" rx="2.5" fill={C.soft} />
          <rect x="182" y="118" width="48" height="6" rx="3" fill={C.gold} />
          <rect x="182" y="134" width="56" height="5" rx="2.5" fill={C.soft} />
        </Scene>
      );

    case "fork-path":
      return (
        <Scene>
          <circle cx="70" cy="120" r="10" fill={C.navy} />
          <polyline points="70,120 150,72 226,72" fill="none" stroke={C.soft} strokeWidth="4" strokeLinecap="round" />
          <polyline points="70,120 150,168 226,168" fill="none" stroke={C.soft} strokeWidth="4" strokeLinecap="round" />
          <rect x="226" y="48" width="62" height="48" rx="10" fill={C.aster} />
          <rect x="226" y="144" width="62" height="48" rx="10" fill={C.gold} />
          <path d="M244 72h26M244 80h18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M244 168h26M244 176h18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </Scene>
      );

    case "content-map":
      return (
        <Scene>
          <line x1="160" y1="122" x2="92" y2="70" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="88" y2="152" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="160" y2="190" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="232" y2="152" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="228" y2="70" stroke={C.soft} strokeWidth="3" />
          <circle cx="160" cy="122" r="26" fill={C.navy} />
          <circle cx="92" cy="70" r="14" fill={C.aster} />
          <circle cx="88" cy="152" r="14" fill={C.aster} />
          <circle cx="160" cy="190" r="14" fill={C.gold} />
          <circle cx="232" cy="152" r="14" fill={C.aster} />
          <circle cx="228" cy="70" r="14" fill={C.aster} />
        </Scene>
      );

    case "social-grid":
      return (
        <Scene>
          <rect x="112" y="38" width="96" height="164" rx="18" fill="#fff" stroke={C.navy} strokeWidth="3" />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => {
              const colors = [C.aster, C.gold, C.navy];
              return (
                <rect
                  key={`${r}-${c}`}
                  x={126 + c * 25}
                  y={58 + r * 25}
                  width="22"
                  height="22"
                  rx="4"
                  fill={colors[(r + c) % 3]}
                  fillOpacity={0.92}
                />
              );
            }),
          )}
          <rect x="126" y="140" width="72" height="8" rx="4" fill={C.soft} />
          <rect x="126" y="154" width="50" height="8" rx="4" fill={C.soft} />
          <circle cx="224" cy="60" r="22" fill={C.gold} />
          <Heart x={213} y={49} scale={0.9} fill="#fff" />
        </Scene>
      );

    case "content-calendar":
      return (
        <Scene>
          <rect x="52" y="52" width="216" height="152" rx="14" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <rect x="52" y="52" width="216" height="30" rx="14" fill={C.navy} />
          <rect x="52" y="68" width="216" height="14" fill={C.navy} />
          {Array.from({ length: 3 }).flatMap((_, r) =>
            Array.from({ length: 7 }).map((_, c) => {
              const filled = (r * 7 + c) % 3 === 0;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={64 + c * 28}
                  y={96 + r * 32}
                  width="22"
                  height="22"
                  rx="5"
                  fill={filled ? C.gold : C.tint}
                />
              );
            }),
          )}
        </Scene>
      );

    case "engagement-bubbles":
      return (
        <Scene>
          <Bubble x={44} y={116} w={92} h={60} tailX={64} fill={C.aster} />
          <Heart x={78} y={132} scale={0.9} fill="#fff" />
          <Bubble x={148} y={58} w={94} h={60} tailX={168} fill={C.navy} />
          <rect x="166" y="80" width="58" height="6" rx="3" fill="#fff" fillOpacity=".85" />
          <rect x="166" y="94" width="40" height="6" rx="3" fill="#fff" fillOpacity=".6" />
          <Bubble x={190} y={150} w={88} h={60} tailX={210} fill={C.gold} />
          <path d="M222 172l16 8-16 8v-6c-12 0-19 3-24 12 1-13 9-21 24-22Z" fill="#fff" />
        </Scene>
      );

    case "social-hero":
      return (
        <Scene>
          <rect x="112" y="34" width="98" height="168" rx="20" fill="#fff" stroke={C.navy} strokeWidth="3" />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => {
              const colors = [C.aster, C.gold, C.navy];
              return (
                <rect
                  key={`${r}-${c}`}
                  x={128 + c * 25}
                  y={54 + r * 25}
                  width="22"
                  height="22"
                  rx="4"
                  fill={colors[(r + c) % 3]}
                  fillOpacity={0.92}
                />
              );
            }),
          )}
          <rect x="128" y="136" width="72" height="8" rx="4" fill={C.soft} />
          <rect x="128" y="150" width="48" height="8" rx="4" fill={C.soft} />
          <circle cx="70" cy="56" r="24" fill={C.gold} />
          <Heart x={57} y={44} scale={1} fill="#fff" />
          <Bubble x={222} y={44} w={64} h={40} tailX={236} fill={C.navy} />
          <rect x="234" y="58" width="40" height="5" rx="2.5" fill="#fff" fillOpacity=".8" />
          <rect x="234" y="68" width="26" height="5" rx="2.5" fill="#fff" fillOpacity=".6" />
          <polyline points="222,178 244,158 262,172 288,140" fill="none" stroke={C.aster600} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="288" cy="140" r="6" fill={C.gold} />
          <Sparkle cx={250} cy={200} size={9} fill={C.gold} />
        </Scene>
      );

    case "map-pins":
      return (
        <Scene>
          <line x1="40" y1="90" x2="280" y2="90" stroke={C.soft} strokeWidth="2" />
          <line x1="40" y1="150" x2="280" y2="150" stroke={C.soft} strokeWidth="2" />
          <line x1="120" y1="40" x2="120" y2="200" stroke={C.soft} strokeWidth="2" />
          <line x1="200" y1="40" x2="200" y2="200" stroke={C.soft} strokeWidth="2" />
          <Pin cx={96} cy={108} r={14} fill={C.aster} />
          <Pin cx={222} cy={78} r={14} fill={C.navy} />
          <Pin cx={170} cy={132} r={24} fill={C.gold} />
        </Scene>
      );

    case "storefront-profile":
      return (
        <Scene>
          <rect x="70" y="96" width="140" height="94" rx="6" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <polygon points="70,96 140,54 210,96" fill={C.navy} />
          <rect x="118" y="140" width="44" height="50" fill={C.tint} stroke={C.navy} strokeWidth="2" />
          <rect x="86" y="112" width="26" height="20" fill={C.aster} />
          <rect x="168" y="112" width="26" height="20" fill={C.aster} />
          <rect x="172" y="150" width="108" height="68" rx="12" fill={C.gold} />
          <Pin cx={200} cy={176} r={14} fill="#fff" />
          <Sparkle cx={234} cy={172} size={7} fill="#fff" />
          <Sparkle cx={250} cy={172} size={7} fill="#fff" />
          <Sparkle cx={266} cy={172} size={7} fill="#fff" />
        </Scene>
      );

    case "community-network":
      return (
        <Scene>
          <line x1="160" y1="122" x2="90" y2="80" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="232" y2="80" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="90" y2="166" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="232" y2="166" stroke={C.soft} strokeWidth="3" />
          <line x1="160" y1="122" x2="160" y2="60" stroke={C.soft} strokeWidth="3" />
          <circle cx="160" cy="122" r="24" fill={C.navy} />
          <circle cx="90" cy="80" r="16" fill={C.aster} />
          <circle cx="232" cy="80" r="16" fill={C.aster} />
          <circle cx="90" cy="166" r="16" fill={C.gold} />
          <circle cx="232" cy="166" r="16" fill={C.aster} />
          <circle cx="160" cy="60" r="14" fill={C.aster600} />
        </Scene>
      );

    case "ai-citation":
      return (
        <Scene>
          <rect x="70" y="54" width="180" height="106" rx="20" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <polygon points="110,160 110,184 140,160" fill="#fff" stroke={C.navy} strokeWidth="2.5" />
          <rect x="98" y="80" width="7" height="18" rx="3.5" fill={C.soft} transform="rotate(12 101 89)" />
          <rect x="112" y="80" width="7" height="18" rx="3.5" fill={C.soft} transform="rotate(12 115 89)" />
          <rect x="112" y="104" width="108" height="7" rx="3.5" fill={C.soft} />
          <rect x="112" y="122" width="82" height="7" rx="3.5" fill={C.soft} />
          <rect x="112" y="140" width="96" height="7" rx="3.5" fill={C.gold} />
          <Sparkle cx={234} cy={62} size={11} fill={C.gold} />
          <Sparkle cx={254} cy={128} size={8} fill={C.aster600} />
        </Scene>
      );
  }
}

export function PillarIllustration({
  name,
  accentIcon,
  className = "",
}: {
  name: PillarIllustName;
  accentIcon?: IconName;
  className?: string;
}) {
  const showBadge = (name === "roadmap" || name === "report") && accentIcon;
  return (
    <div className={`pillar-illus ${className}`.trim()}>
      <svg viewBox="0 0 320 240" role="img" aria-hidden focusable="false">
        {renderScene(name)}
      </svg>
      {showBadge ? (
        <span className="pillar-illus-badge">
          <Icon name={accentIcon} />
        </span>
      ) : null}
    </div>
  );
}
