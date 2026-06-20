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
      <PageHero
        crumb={page.crumb}
        title={page.title}
        subtitle={page.subtitle}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=720&q=70&auto=format&fit=crop"
        imageAlt="SEO analytics dashboard"
      />
      <ServicesDetailed />
      <CtaBand />
    </>
  );
}
