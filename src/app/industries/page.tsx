import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Industries } from "@/components/Industries";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { copy } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = copy.pages.industries;

export const metadata: Metadata = buildMetadata("/industries", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero crumb={page.crumb} title={page.title} subtitle={page.subtitle} illus="industries" />
      <Industries />
      <Testimonials />
      <CtaBand />
    </>
  );
}
