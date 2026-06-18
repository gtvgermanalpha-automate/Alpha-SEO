import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { copy } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

const page = copy.pages.faq;

export const metadata: Metadata = buildMetadata("/faq", {
  defaultTitle: page.metaTitle,
  defaultDescription: page.metaDescription,
});

export default function FaqPage() {
  return (
    <>
      <PageHero crumb={page.crumb} title={page.title} subtitle={page.subtitle} icon="MessagesSquare" />
      <FAQ />
    </>
  );
}
