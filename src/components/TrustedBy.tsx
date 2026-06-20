import { TOOL_LOGOS } from "@/components/ui/brands";
import { copy } from "@/lib/content";

/** Tool/logo marquee — the SEO platforms Alpha works in, looping (grayscale →
 *  brand colour on hover). Ported from the original static site. */
export function TrustedBy() {
  const loop = [...TOOL_LOGOS, ...TOOL_LOGOS];
  return (
    <section className="tech-marquee" aria-label="Tools we work with">
      <div className="tech-marquee-label">{copy.trustedBy.eyebrow}</div>
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((logo, i) => (
            <span className="marquee-item" key={`${logo.name}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={i < TOOL_LOGOS.length ? logo.name : ""} aria-hidden={i >= TOOL_LOGOS.length} loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
