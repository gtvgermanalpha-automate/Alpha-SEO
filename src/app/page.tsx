import { siteConfig } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { HeroPremium } from "@/components/HeroPremium";
import { TrustedBy } from "@/components/TrustedBy";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";
import { Statistics } from "@/components/Statistics";
import { Insights } from "@/components/Insights";
import { Testimonials } from "@/components/Testimonials";
import { LeadMagnet } from "@/components/LeadMagnet";
import { FAQ } from "@/components/FAQ";
import { CtaBand } from "@/components/CtaBand";
import { CustomSchema } from "@/components/CustomSchema";

export const metadata = buildMetadata("/", {
  defaultTitle: `${siteConfig.name} — Premium SEO Agency in Toronto`,
  defaultDescription: siteConfig.description,
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <HeroPremium />
      <TrustedBy />
      <Services />
      <Work />
      <Statistics />
      <Insights />
      <Testimonials />
      <LeadMagnet />
      <FAQ />
      <CtaBand />
      <CustomSchema route="/" />
    </>
  );
}
