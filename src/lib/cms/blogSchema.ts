/**
 * Shape + runtime validation for the Blog / News collection (src/content/blog.json).
 *
 * Like the detail pages, the public site trusts the JSON's shape; the CMS validates
 * HERE before committing, so a bad save can never push malformed JSON that breaks
 * the next build. Types mirror BlogPost / BlogSection in src/lib/blog.ts.
 */
import { fieldErrors, lengthError } from "./limits";

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

/** Required single-line / text fields on a post. */
const REQUIRED_STRINGS = [
  "slug",
  "title",
  "date",
  "author",
  "category",
  "excerpt",
  "metaTitle",
  "metaDescription",
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validateSection(value: unknown, label: string, errors: string[]) {
  if (typeof value !== "object" || value === null) {
    errors.push(`${label}: must be an object`);
    return;
  }
  const s = value as Record<string, unknown>;

  // heading is optional (intro sections have none); validate length if present.
  if (s.heading !== undefined) {
    if (!isStr(s.heading)) errors.push(`${label}.heading: must be a string when present`);
    else {
      const e = lengthError(s.heading, "heading", `${label}.heading`);
      if (e) errors.push(e);
    }
  }

  // body — array of strings (may be empty for table/links-only sections).
  if (!isStrArray(s.body)) errors.push(`${label}.body: must be an array of strings`);
  else s.body.forEach((b, i) => {
    const e = lengthError(b, "body", `${label}.body[${i}]`);
    if (e) errors.push(e);
  });

  if (s.bullets !== undefined) {
    if (!isStrArray(s.bullets)) errors.push(`${label}.bullets: must be an array of strings when present`);
    else s.bullets.forEach((b, i) => {
      const e = lengthError(b, "bullets", `${label}.bullets[${i}]`);
      if (e) errors.push(e);
    });
  }

  if (s.links !== undefined) {
    if (!Array.isArray(s.links)) errors.push(`${label}.links: must be an array when present`);
    else s.links.forEach((link, i) => {
      const ll = `${label}.links[${i}]`;
      if (typeof link !== "object" || link === null) {
        errors.push(`${ll}: must be an object`);
        return;
      }
      const l = link as Record<string, unknown>;
      if (!isNonEmpty(l.label)) errors.push(`${ll}.label: required, must be a non-empty string`);
      else errors.push(...fieldErrors(l.label, "label", `${ll}.label`));
      if (!isNonEmpty(l.href)) errors.push(`${ll}.href: required, must be a non-empty string`);
      else errors.push(...fieldErrors(l.href, "href", `${ll}.href`));
    });
  }

  for (const key of ["image", "imageAlt"] as const) {
    if (s[key] !== undefined) {
      if (!isStr(s[key])) errors.push(`${label}.${key}: must be a string when present`);
      else errors.push(...fieldErrors(s[key], key, `${label}.${key}`));
    }
  }

  if (s.table !== undefined) {
    if (typeof s.table !== "object" || s.table === null) {
      errors.push(`${label}.table: must be an object when present`);
    } else {
      const tbl = s.table as Record<string, unknown>;
      if (!isStrArray(tbl.headers) || tbl.headers.length === 0) {
        errors.push(`${label}.table.headers: must be a non-empty array of strings`);
      }
      if (!Array.isArray(tbl.rows)) {
        errors.push(`${label}.table.rows: must be an array of rows`);
      } else {
        tbl.rows.forEach((row, i) => {
          if (!isStrArray(row)) errors.push(`${label}.table.rows[${i}]: must be an array of strings`);
        });
      }
    }
  }
}

/** Validate one blog post. Returns human-readable error strings (empty = valid). */
export function validateBlogPost(value: unknown, label = "post"): string[] {
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

  if (isStr(o.date) && !ISO_DATE.test(o.date.trim())) {
    errors.push(`${label}.date: must be a date in YYYY-MM-DD format`);
  }

  // Optional image + alt.
  for (const key of ["image", "imageAlt"] as const) {
    if (o[key] !== undefined) {
      if (!isStr(o[key])) errors.push(`${label}.${key}: must be a string when present`);
      else {
        const e = lengthError(o[key], key, `${label}.${key}`);
        if (e) errors.push(e);
      }
    }
  }

  if (!Array.isArray(o.sections)) {
    errors.push(`${label}.sections: must be an array`);
  } else {
    o.sections.forEach((section, i) => validateSection(section, `${label}.sections[${i}]`, errors));
  }

  return errors;
}

/** Validate the whole blog file (an array of posts), including slug uniqueness. */
export function validateBlog(posts: unknown): ValidationResult {
  if (!Array.isArray(posts)) return { ok: false, errors: ["blog: expected an array of posts"] };

  const errors: string[] = [];
  const seen = new Set<string>();

  posts.forEach((post, i) => {
    const slug = (post as { slug?: unknown })?.slug;
    const label = isStr(slug) ? `post "${slug}"` : `post[${i}]`;
    errors.push(...validateBlogPost(post, label));
    if (isStr(slug)) {
      if (seen.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`);
      seen.add(slug);
    }
  });

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
