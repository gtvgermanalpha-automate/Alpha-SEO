/**
 * Validation + types for CMS collections beyond the detail pages.
 * Hand-written guards (same style as detailSchema.ts) so a bad save can't push
 * malformed JSON that breaks the build.
 */
export { validateFile } from "@/lib/detailSchema";

export type Review = {
  name: string;
  role?: string;
  date: string;
  quote: string;
  rating: number; // 1–5
  image?: string; // "" or a /public path / URL
  initials: string;
};

export type ReviewsData = {
  eyebrow: string;
  title: string;
  intro: string;
  rating: { score: string; outOf: string; count: number; platform: string };
  reviews: Review[];
};

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";

export function validateReviews(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof value !== "object" || value === null) return { ok: false, errors: ["reviews: must be an object"] };
  const o = value as Record<string, unknown>;

  for (const key of ["eyebrow", "title", "intro"] as const) {
    if (!isNonEmpty(o[key])) errors.push(`${key}: required, must be a non-empty string`);
  }

  const r = o.rating;
  if (typeof r !== "object" || r === null) {
    errors.push("rating: required object");
  } else {
    const rr = r as Record<string, unknown>;
    if (!isNonEmpty(rr.score)) errors.push("rating.score: required");
    if (!isNonEmpty(rr.outOf)) errors.push("rating.outOf: required");
    if (typeof rr.count !== "number") errors.push("rating.count: required number");
    if (!isNonEmpty(rr.platform)) errors.push("rating.platform: required");
  }

  if (!Array.isArray(o.reviews)) {
    errors.push("reviews: must be an array");
  } else {
    o.reviews.forEach((rev, i) => {
      const w = `reviews[${i}]`;
      if (typeof rev !== "object" || rev === null) {
        errors.push(`${w}: must be an object`);
        return;
      }
      const rv = rev as Record<string, unknown>;
      if (!isNonEmpty(rv.name)) errors.push(`${w}.name: required`);
      if (!isNonEmpty(rv.date)) errors.push(`${w}.date: required`);
      if (!isNonEmpty(rv.quote)) errors.push(`${w}.quote: required`);
      if (typeof rv.rating !== "number" || rv.rating < 1 || rv.rating > 5) {
        errors.push(`${w}.rating: must be a number 1–5`);
      }
      if (rv.role !== undefined && !isStr(rv.role)) errors.push(`${w}.role: must be a string`);
      if (rv.image !== undefined && !isStr(rv.image)) errors.push(`${w}.image: must be a string`);
      if (!isNonEmpty(rv.initials)) errors.push(`${w}.initials: required (fallback avatar)`);
    });
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
