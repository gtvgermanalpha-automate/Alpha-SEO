import { type SVGProps } from "react";
import { siteConfig } from "@/lib/content";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26L23 21.75h-6.66l-5.21-6.82-5.96 6.82H1.86l7.73-8.84L1 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.01 4.13H5.04z" />
    </svg>
  );
}
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.07 24 18.1 24 12.07z" />
    </svg>
  );
}

const socials = [
  { icon: LinkedInIcon, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: XIcon, href: siteConfig.social.twitter, label: "X (Twitter)" },
  { icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
];

/** Fixed vertical social rail on the left edge (wide screens only). */
export function SocialRail() {
  return (
    <div className="fixed left-2.5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex">
      <span className="h-14 w-px bg-line" aria-hidden />
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="text-ink/55 transition-colors duration-300 hover:text-accent"
        >
          <s.icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <span className="h-14 w-px bg-line" aria-hidden />
    </div>
  );
}
