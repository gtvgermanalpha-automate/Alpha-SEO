import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WhyChoose } from "@/components/WhyChoose";
import { Testimonials } from "@/components/Testimonials";
import { TrustedBy } from "@/components/TrustedBy";
import { CtaBand } from "@/components/CtaBand";
import { copy } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = copy.pages.whyMmr;

export const metadata: Metadata = buildMetadata("/why-mmr", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function WhyMmrPage() {
  return (
    <>
      <PageHero crumb={page.crumb} title={page.title} subtitle={page.subtitle} icon="ShieldCheck" />
      <WhyChoose />
      <Testimonials />
      <TrustedBy />
      <CtaBand />
    </>
  );
}
