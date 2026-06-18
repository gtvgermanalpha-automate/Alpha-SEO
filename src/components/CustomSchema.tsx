import seoData from "@/content/seo.json";
import type { SeoMap } from "@/lib/cms/seoSchema";

const seoMap = seoData as SeoMap;

/**
 * Injects the SEO team's custom JSON-LD for a route (from seo.json → schema),
 * if set. Only valid JSON is emitted (validated again here as a safety net).
 */
export function CustomSchema({ route }: { route: string }) {
  const raw = seoMap[route]?.schema?.trim();
  if (!raw) return null;
  try {
    JSON.parse(raw);
  } catch {
    return null;
  }
  // Escape "<" so a literal "</script>" inside a JSON string value can't break
  // out of the tag (valid-JSON-as-unicode-escape; XSS-safe).
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: raw.replace(/</g, "\\u003c") }} />;
}
