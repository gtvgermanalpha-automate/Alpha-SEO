import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Contact } from "@/components/Contact";
import { copy } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = copy.pages.contact;

export const metadata: Metadata = buildMetadata("/contact", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb={page.crumb}
        title={page.title}
        subtitle={page.subtitle}
        image="/hero.jpg"
        imageAlt="Talk to a senior SEO strategist"
      />
      <Contact />
    </>
  );
}
