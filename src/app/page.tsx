import { siteConfig } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { HeroPremium } from "@/components/HeroPremium";
import { TrustedBy } from "@/components/TrustedBy";
import { Services } from "@/components/Services";
import { Statistics } from "@/components/Statistics";
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
      <Statistics />
      <FAQ />
      <CtaBand />
      <CustomSchema route="/" />
    </>
  );
}
