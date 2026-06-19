import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchView } from "@/components/SearchView";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Alpha Digital Solutions website.",
  alternates: { canonical: "/search" },
  // Results pages should not be indexed.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchView />
    </Suspense>
  );
}
