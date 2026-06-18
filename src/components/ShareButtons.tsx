"use client";

import { useState } from "react";
import { Check, Link2, Mail } from "lucide-react";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon, XIcon } from "@/components/ui/social";

/**
 * Social share row for a blog post. Pure share-intent links (no SDKs / tracking)
 * plus a "copy link" button. `url` is the absolute post URL; `title` is its title.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedInIcon },
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: WhatsAppIcon },
    { label: "Share by email", href: `mailto:?subject=${t}&body=${t}%20${u}`, Icon: Mail },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — quietly no-op.
    }
  }

  const btn =
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-blue hover:text-accent";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Share</span>
      <div className="flex flex-wrap items-center gap-2.5">
        {links.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={btn}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </a>
        ))}
        <button type="button" onClick={copy} aria-label="Copy link" title={copied ? "Copied!" : "Copy link"} className={btn}>
          {copied ? <Check className="h-[18px] w-[18px] text-emerald-600" aria-hidden /> : <Link2 className="h-[18px] w-[18px]" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
