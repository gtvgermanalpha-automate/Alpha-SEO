import { type SVGProps } from "react";

/**
 * Accreditation + platform marks.
 *
 * NOTE: the ICAEW / ACCA / AAT marks below are clean typographic RECONSTRUCTIONS
 * for layout fidelity — they are NOT the official logos. To show the real
 * artwork, drop the licensed file into `public/brand/` and set its path in
 * OFFICIAL_ASSETS below; the component then renders that file instead of the
 * reconstruction. Leave a value as `null` to keep the reconstruction.
 * See public/brand/README.txt for the expected filenames.
 */
const OFFICIAL_ASSETS: Record<"icaew" | "acca" | "aat", string | null> = {
  icaew: "/brand/ICAEW.png",
  acca: "/brand/ACCA.png",
  aat: "/brand/AAT.png",
};

/** Google "G" — official four-colour mark. */
export function GoogleG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/** "Google" wordmark — official four-colour artwork from public/brand/. */
export function GoogleWordmark({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/brand/Google%201.png"
      alt="Google"
      className={`inline-block h-[18px] w-auto object-contain align-middle ${className}`}
    />
  );
}

/** ICAEW — Chartered Accountants lockup. */
export function IcaewLogo({ className = "" }: { className?: string }) {
  if (OFFICIAL_ASSETS.icaew) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={OFFICIAL_ASSETS.icaew}
        alt="ICAEW Chartered Accountants"
        className={`h-12 w-auto object-contain ${className}`}
      />
    );
  }
  return (
    <span className={`flex flex-col items-center justify-center ${className}`} aria-label="ICAEW Chartered Accountants">
      <span className="font-display text-2xl font-extrabold tracking-[0.04em] text-[#2b2b2b]">ICAEW</span>
      <span className="mt-1 text-[0.5rem] font-bold uppercase leading-none tracking-[0.2em] text-[#7a7672]">
        Chartered Accountants
      </span>
    </span>
  );
}

/** ACCA — red mark + "Think Ahead". */
export function AccaLogo({ className = "" }: { className?: string }) {
  if (OFFICIAL_ASSETS.acca) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={OFFICIAL_ASSETS.acca} alt="ACCA" className={`h-12 w-auto object-contain ${className}`} />
    );
  }
  return (
    <span className={`flex items-center gap-2.5 ${className}`} aria-label="ACCA Think Ahead">
      <span className="grid h-10 w-10 place-items-center rounded-[3px] bg-[#E4002B] text-[0.62rem] font-extrabold leading-none tracking-tight text-white">
        ACCA
      </span>
      <span className="font-display text-base font-bold leading-tight text-[#2b2b2b]">
        Think
        <br />
        Ahead
      </span>
    </span>
  );
}

/** AAT — green wordmark. */
export function AatLogo({ className = "" }: { className?: string }) {
  if (OFFICIAL_ASSETS.aat) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={OFFICIAL_ASSETS.aat} alt="AAT" className={`h-10 w-auto object-contain ${className}`} />;
  }
  return (
    <span
      className={`font-display text-[2.1rem] font-extrabold lowercase leading-none tracking-[-0.03em] text-[#5fb246] ${className}`}
      aria-label="AAT"
    >
      aat
    </span>
  );
}
