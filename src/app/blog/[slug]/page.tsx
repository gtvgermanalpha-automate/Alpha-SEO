import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/BlogPostView";
import { blogPosts, findBlogPost } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/buildMetadata";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) return {};
  return buildMetadata(`/blog/${slug}`, {
    defaultTitle: post.metaTitle,
    defaultDescription: post.metaDescription,
    ogType: "article",
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
