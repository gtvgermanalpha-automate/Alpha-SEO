import { type SVGProps } from "react";

/**
 * Brand & platform marks used across the site.
 *
 * - Google "G" + wordmark: official Google artwork, used nominatively on the
 *   reviews card (backed by a real Google Business Profile). Keep these exact.
 * - TOOL_LOGOS: the SEO platforms & tools Alpha works in, shown in the "tools
 *   we work with" strip. Real vendor SVGs live in public/brand/tools/. Shown
 *   nominatively — NOT a partnership/endorsement claim. Some marks (e.g.
 *   openai.svg) are single-colour / white-filled and need a tinted/dark chip or
 *   the grayscale→colour treatment; handle that where they render (TrustedBy).
 */

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

/** A SEO platform/tool logo shown in the "tools we work with" strip. */
export type ToolLogo = { name: string; src: string };

/** The 12 platforms Alpha works in — real vendor SVGs in public/brand/tools/.
 *  Order mirrors the home marquee (search → analytics → research → CMS → AI). */
export const TOOL_LOGOS: ToolLogo[] = [
  { name: "Google Search Console", src: "/brand/tools/google-search-console.svg" },
  { name: "Google Analytics", src: "/brand/tools/google-analytics.svg" },
  { name: "Ahrefs", src: "/brand/tools/ahrefs.svg" },
  { name: "Semrush", src: "/brand/tools/semrush.svg" },
  { name: "PageSpeed Insights", src: "/brand/tools/pagespeed-insights.svg" },
  { name: "Lighthouse", src: "/brand/tools/lighthouse.svg" },
  { name: "Looker Studio", src: "/brand/tools/looker.svg" },
  { name: "Bing Webmaster Tools", src: "/brand/tools/bing.svg" },
  { name: "WordPress", src: "/brand/tools/wordpress.svg" },
  { name: "OpenAI", src: "/brand/tools/openai.svg" },
  { name: "Perplexity", src: "/brand/tools/perplexity.svg" },
  { name: "Gemini", src: "/brand/tools/google-gemini.svg" },
];
