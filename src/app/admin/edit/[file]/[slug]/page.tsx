import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { CaseStudyEditor } from "@/components/admin/CaseStudyEditor";

export const dynamic = "force-dynamic";

const FILES = ["services", "blog", "case-studies"];

export default async function EditDetailPage({
  params,
}: {
  params: Promise<{ file: string; slug: string }>;
}) {
  const { file, slug } = await params;
  if (!FILES.includes(file)) notFound();
  if (file === "blog") return <BlogEditor slug={slug} />;
  if (file === "case-studies") return <CaseStudyEditor slug={slug} />;
  return <PageEditor file={file} slug={slug} />;
}
