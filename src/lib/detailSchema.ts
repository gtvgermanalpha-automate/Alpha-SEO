/**
 * Canonical shape + runtime validation for the editable detail-page content
 * (the JSON authored in `src/content/*.json`).
 *
 * The public site has NO runtime validation — it imports the JSON and trusts
 * its shape. The CMS therefore validates here BEFORE committing, so a bad save
 * can never push malformed JSON that breaks the next build.
 */

import { lengthError } from "./cms/limits";

export type DetailFaq = { question: string; answer: string };
export type DetailSection = { heading: string; body: string[]; bullets?: string[] };

/** The fields a content editor owns. The derived fields (kind/icon/crumb/
 *  related/updated) are added in detailContent.ts from hard-coded maps. */
export type RawDetail = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  highlights: string[];
  sections: DetailSection[];
  faqs: DetailFaq[];
};

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

/** The required single-line string fields. */
const REQUIRED_STRINGS = [
  "slug",
  "metaTitle",
  "metaDescription",
  "eyebrow",
  "title",
  "intro",
] as const;

/** Validate one page object. Returns an array of human-readable error strings
 *  (empty = valid). `label` identifies the page in messages. */
export function validateRawDetail(value: unknown, label = "page"): string[] {
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

  if (!isStrArray(o.highlights)) {
    errors.push(`${label}.highlights: must be an array of strings`);
  } else {
    (o.highlights as string[]).forEach((h, i) => {
      const e = lengthError(h, "highlights", `${label}.highlights[${i}]`);
      if (e) errors.push(e);
    });
  }

  if (!Array.isArray(o.sections)) {
    errors.push(`${label}.sections: must be an array`);
  } else {
    o.sections.forEach((section, i) => {
      const sl = `${label}.sections[${i}]`;
      if (typeof section !== "object" || section === null) {
        errors.push(`${sl}: must be an object`);
        return;
      }
      const s = section as Record<string, unknown>;
      if (!isNonEmpty(s.heading)) errors.push(`${sl}.heading: required, must be a non-empty string`);
      else {
        const e = lengthError(s.heading, "heading", `${sl}.heading`);
        if (e) errors.push(e);
      }
      if (!isStrArray(s.body)) errors.push(`${sl}.body: must be an array of strings`);
      else (s.body as string[]).forEach((b, bi) => {
        const e = lengthError(b, "body", `${sl}.body[${bi}]`);
        if (e) errors.push(e);
      });
      if (s.bullets !== undefined && !isStrArray(s.bullets)) {
        errors.push(`${sl}.bullets: must be an array of strings when present`);
      } else if (Array.isArray(s.bullets)) {
        (s.bullets as string[]).forEach((b, bi) => {
          const e = lengthError(b, "bullets", `${sl}.bullets[${bi}]`);
          if (e) errors.push(e);
        });
      }
    });
  }

  if (!Array.isArray(o.faqs)) {
    errors.push(`${label}.faqs: must be an array`);
  } else {
    o.faqs.forEach((faq, i) => {
      const fl = `${label}.faqs[${i}]`;
      if (typeof faq !== "object" || faq === null) {
        errors.push(`${fl}: must be an object`);
        return;
      }
      const f = faq as Record<string, unknown>;
      if (!isNonEmpty(f.question)) errors.push(`${fl}.question: required, must be a non-empty string`);
      else {
        const e = lengthError(f.question, "question", `${fl}.question`);
        if (e) errors.push(e);
      }
      if (!isNonEmpty(f.answer)) errors.push(`${fl}.answer: required, must be a non-empty string`);
      else {
        const e = lengthError(f.answer, "answer", `${fl}.answer`);
        if (e) errors.push(e);
      }
    });
  }

  return errors;
}

/** Validate a whole content file (an array of pages) including slug uniqueness. */
export function validateFile(pages: unknown): ValidationResult {
  if (!Array.isArray(pages)) return { ok: false, errors: ["file: expected an array of pages"] };

  const errors: string[] = [];
  const seen = new Set<string>();

  pages.forEach((page, i) => {
    const slug = (page as { slug?: unknown })?.slug;
    const label = isStr(slug) ? `page "${slug}"` : `page[${i}]`;
    errors.push(...validateRawDetail(page, label));
    if (isStr(slug)) {
      if (seen.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`);
      seen.add(slug);
    }
  });

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
