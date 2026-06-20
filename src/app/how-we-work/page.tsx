import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { HowWeWork } from "@/components/HowWeWork";
import { CtaBand } from "@/components/CtaBand";
import { copy } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = copy.pages.howWeWork;

export const metadata: Metadata = buildMetadata("/how-we-work", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        crumb={page.crumb}
        title={page.title}
        subtitle={page.subtitle}
        image="/hero-architecture.jpg"
        imageAlt="A structured, methodical SEO process"
      />
      <HowWeWork />
      <CtaBand />
    </>
  );
}
