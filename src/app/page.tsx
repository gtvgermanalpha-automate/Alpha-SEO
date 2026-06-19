import { existsSync } from "fs";
import path from "path";
import { siteConfig } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { HeroPremium } from "@/components/HeroPremium";
import { TrustedBy } from "@/components/TrustedBy";
import { Services } from "@/components/Services";
import { WhyChoose } from "@/components/WhyChoose";
import { HowWeWork } from "@/components/HowWeWork";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CtaBand } from "@/components/CtaBand";
import { LeadPopup } from "@/components/LeadPopup";
import { CustomSchema } from "@/components/CustomSchema";

export const metadata = buildMetadata("/", {
  defaultTitle: `${siteConfig.name} — Premium SEO Agency in Toronto`,
  defaultDescription: siteConfig.description,
  absoluteTitle: true,
});

export default function Home() {
  // Hero cut-out source, in priority order:
  //   1. A CMS-set image (settings.json → heroImage), uploaded via /admin/settings.
  //   2. The bundled transparent cut-out at public/hero.png, if present.
  //   3. None → the hero frames the fallback /hero.jpg photo instead.
  // A cut-out renders frameless on the navy (like the reference).
  const cmsHero = siteConfig.heroImage?.trim();
  const cutoutSrc = cmsHero
    ? cmsHero
    : existsSync(path.join(process.cwd(), "public", "hero.png"))
      ? "/hero.png"
      : null;
  return (
    <>
      <HeroPremium cutoutSrc={cutoutSrc} />
      <TrustedBy />
      <Services />
      <WhyChoose />
      <HowWeWork />
      <Testimonials />
      <FAQ />
      <CtaBand />
      <LeadPopup />
      <CustomSchema route="/" />
    </>
  );
}
