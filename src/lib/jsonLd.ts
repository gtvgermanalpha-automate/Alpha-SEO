/**
 * Serialize an object as a JSON-LD string for a <script type="application/ld+json">,
 * escaping "<" (and ">") so a literal "</script>" in CMS free text (titles,
 * descriptions, FAQs) can't break out of the tag and inject markup (stored XSS).
 * Output stays valid JSON (escaped as </>). For application/ld+json the
 * browser JSON-parses the text, so this is sufficient.
 */
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
