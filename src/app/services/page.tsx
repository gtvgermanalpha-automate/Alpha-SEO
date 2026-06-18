import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServicesDetailed } from "@/components/ServicesDetailed";
import { CtaBand } from "@/components/CtaBand";
import { copy } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = copy.pages.services;

export const metadata: Metadata = buildMetadata("/services", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function ServicesPage() {
  return (
    <>
      <PageHero crumb={page.crumb} title={page.title} subtitle={page.subtitle} illus="finance" />
      <ServicesDetailed />
      <CtaBand />
    </>
  );
}
