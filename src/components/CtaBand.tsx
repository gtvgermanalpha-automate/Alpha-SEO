import Link from "next/link";
import { copy } from "@/lib/content";

/** Closing conversion band — Deep Space Royal card on a soft section.
 *  Ported from the original static site. */
export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container">
        <div className="cta-band-inner">
          <div>
            <h2>{copy.cta.title}</h2>
            <p>{copy.cta.subtitle}</p>
          </div>
          <Link className="btn btn-accent" href="/contact">{copy.cta.primaryCta}</Link>
        </div>
      </div>
    </section>
  );
}
