import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BlogCard } from "@/components/BlogCard";
import { CtaBand } from "@/components/CtaBand";
import { blogPosts } from "@/lib/content";
import { CustomSchema } from "@/components/CustomSchema";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = buildMetadata("/blog", {
  defaultTitle: "SEO Insights",
  defaultDescription:
    "Practitioner-led writing on technical SEO, content strategy, link building, local SEO and the economics of organic growth — from the Alpha Digital Solutions team.",
});

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        crumb="Insights"
        image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=720&q=70&auto=format&fit=crop"
        imageAlt="Practitioner-led SEO writing"
        title={<>The <span className="highlight">SEO journal</span></>}
        subtitle="Practitioner-led writing on technical SEO, content strategy, link building and the economics of organic growth — by the team that does the work."
      />

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
      <CustomSchema route="/blog" />
    </>
  );
}
