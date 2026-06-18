/**
 * Shape + validation for the Case Studies collection (src/content/case-studies.json).
 * Validated before the CMS commits, so a bad save can't break the build.
 */
import { lengthError, isFormat } from "./limits";

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

const REQUIRED_STRINGS = ["slug", "title", "client", "industry", "summary", "metaTitle", "metaDescription"] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateCaseStudy(value: unknown, label = "case study"): string[] {
  const errors: string[] = [];
  if (typeof value !== "object" || value === null) return [`${label}: must be an object`];
  const o = value as Record<string, unknown>;

  for (const key of REQUIRED_STRINGS) {
    if (!isNonEmpty(o[key])) errors.push(`${label}.${key}: required, must be a non-empty string`);
    else {
      const e = lengthError(o[key], key, `${label}.${key}`);
      if (e) errors.push(e);
    }
  }
  if (isStr(o.slug) && o.slug.trim() && !isFormat(o.slug.trim(), "slug")) {
    errors.push(`${label}.slug: must be lowercase letters, numbers and hyphens only`);
  }

  if (o.date !== undefined) {
    if (!isStr(o.date)) errors.push(`${label}.date: must be a string when present`);
    else if (o.date.trim() && !ISO_DATE.test(o.date.trim())) errors.push(`${label}.date: must be a date in YYYY-MM-DD format`);
  }

  for (const key of ["image", "imageAlt"] as const) {
    if (o[key] !== undefined) {
      if (!isStr(o[key])) errors.push(`${label}.${key}: must be a string when present`);
      else {
        const e = lengthError(o[key], key, `${label}.${key}`);
        if (e) errors.push(e);
      }
    }
  }

  if (!isStrArray(o.results)) errors.push(`${label}.results: must be an array of strings`);
  else o.results.forEach((r, i) => {
    const e = lengthError(r, "result", `${label}.results[${i}]`);
    if (e) errors.push(e);
  });

  if (!isStrArray(o.body)) errors.push(`${label}.body: must be an array of strings`);
  else o.body.forEach((b, i) => {
    const e = lengthError(b, "markdownBody", `${label}.body[${i}]`);
    if (e) errors.push(e);
  });

  return errors;
}

export function validateCaseStudies(value: unknown): ValidationResult {
  if (!Array.isArray(value)) return { ok: false, errors: ["case studies: expected an array"] };
  const errors: string[] = [];
  const seen = new Set<string>();
  value.forEach((cs, i) => {
    const slug = (cs as { slug?: unknown })?.slug;
    const label = isStr(slug) ? `case study "${slug}"` : `case study[${i}]`;
    errors.push(...validateCaseStudy(cs, label));
    if (isStr(slug)) {
      if (seen.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`);
      seen.add(slug);
    }
  });
  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
