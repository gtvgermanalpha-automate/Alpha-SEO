/**
 * Shape + validation for per-page SEO overrides (src/content/seo.json), a map
 * keyed by route path. The public site reads it through buildMetadata(); the CMS
 * validates here BEFORE committing, so a bad save can never break the next build.
 *
 * Overrides for UNKNOWN routes are rejected (checked against seoRouteSet) so a
 * typo can't create a dead entry that silently does nothing.
 */
import { fieldErrors } from "./limits";
import { seoRouteSet } from "@/lib/seo/targets";

export type SeoOverride = {
  /** Override the page's meta title / description (else the page's own is used). */
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
  /** Custom JSON-LD injected into the page <head> (must be valid JSON). */
  schema?: string;
};
export type SeoMap = Record<string, SeoOverride>;

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isBool = (v: unknown): v is boolean => typeof v === "boolean";

const STR_FIELDS = ["metaTitle", "metaDescription", "canonical", "ogTitle", "ogDescription", "ogImage", "focusKeyword", "schema"] as const;
const BOOL_FIELDS = ["noindex", "nofollow"] as const;
const ALLOWED = new Set<string>([...STR_FIELDS, ...BOOL_FIELDS]);

export function validateSeo(value: unknown): ValidationResult {
  if (!isObj(value)) return { ok: false, errors: ["seo: must be an object keyed by route"] };
  const errors: string[] = [];

  for (const [route, override] of Object.entries(value)) {
    const label = `seo["${route}"]`;
    if (!seoRouteSet.has(route)) {
      errors.push(`${label}: unknown route — not a page on this site`);
      continue;
    }
    if (!isObj(override)) {
      errors.push(`${label}: must be an object`);
      continue;
    }
    for (const key of Object.keys(override)) {
      if (!ALLOWED.has(key)) errors.push(`${label}.${key}: unknown field`);
    }
    for (const f of STR_FIELDS) {
      const v = override[f];
      if (v === undefined) continue;
      if (!isStr(v)) errors.push(`${label}.${f}: must be a string`);
      else errors.push(...fieldErrors(v, f, `${label}.${f}`));
    }
    for (const f of BOOL_FIELDS) {
      const v = override[f];
      if (v !== undefined && !isBool(v)) errors.push(`${label}.${f}: must be true or false`);
    }
    // Custom schema, when present, must be parseable JSON (object or array).
    if (isStr(override.schema) && override.schema.trim()) {
      try {
        const parsed: unknown = JSON.parse(override.schema);
        if (typeof parsed !== "object" || parsed === null) {
          errors.push(`${label}.schema: must be a JSON object or array`);
        }
      } catch {
        errors.push(`${label}.schema: must be valid JSON`);
      }
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
