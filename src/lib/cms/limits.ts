/**
 * Central CMS validation limits.
 *
 * One source of truth for every limit the CMS enforces — character limits per
 * field role and image-upload constraints. Imported by:
 *   - the server-side validators (siteSchema / detailSchema / itemsSchema /
 *     navSchema / legalSchema) to REJECT over-limit content before it commits, and
 *   - the client editors (fields.tsx counters + ImageField upload checks) to show
 *     the limits live and validate a picture before it's sent.
 *
 * Keep it dependency-free so it's safe in both the server and the browser.
 */

/* ------------------------------------------------------------------ *
 * Text — max character length per field "role" (the field's key, i.e.
 * the last segment of its path: `pages.services.title` → `title`).
 * ------------------------------------------------------------------ */
export const TEXT_LIMITS: Record<string, number> = {
  // Eyebrows / short labels
  eyebrow: 75,
  label: 40,
  crumb: 40,
  badge: 36,
  accepting: 60,
  ratingScore: 12,
  ratingLabel: 48,

  // Titles / headings
  title: 90,
  heading: 90,
  headline: 60,
  headlineLead: 60,
  headlineAccent: 40,
  subtitle: 240,

  // Body copy
  paragraph: 700,
  intro: 440,
  description: 320,
  blurb: 300,
  disclaimer: 450,
  body: 700,
  text: 240,
  ctaText: 200,
  stillHaveText: 240,
  quote: 600,
  question: 180,
  answer: 900,

  // Buttons / CTAs (short)
  cta: 32,
  button: 32,
  ctaButton: 32,
  primaryCta: 32,
  secondaryCta: 32,
  stillHaveTitle: 60,
  stillHaveCta: 32,

  // List items
  highlight: 100,
  bullet: 180,
  point: 110,
  pillar: 60,
  legal: 40,

  // Identity / contact
  name: 70,
  shortName: 30,
  companyNumber: 24,
  url: 200,
  href: 200,
  email: 130,
  phone: 32,
  phoneDisplay: 32,
  addressLine: 130,
  city: 60,
  postcode: 12,
  hours: 60,

  // Social URLs
  linkedin: 200,
  twitter: 200,
  facebook: 200,

  // SEO
  metaTitle: 70,
  metaDescription: 185,
  slug: 60,

  // Blog
  author: 70,
  category: 40,
  excerpt: 300,
  date: 12,
  imageAlt: 140,
  image: 200,

  // Case studies + team
  client: 80,
  industry: 60,
  summary: 320,
  result: 160,
  markdownBody: 5000,
  role: 70,
  bio: 900,

  // Per-page SEO overrides (seo.json)
  ogTitle: 70,
  ogDescription: 200,
  canonical: 200,
  ogImage: 200,
  focusKeyword: 80,
  schema: 6000,

  // Plural array keys (so limitFor("points") resolves directly)
  pillars: 60,
  points: 110,
  bullets: 180,
  highlights: 100,
  partners: 60,
  businessTypes: 60,
};

/** Used when a field role isn't listed above. */
export const DEFAULT_TEXT_LIMIT = 400;

/** Character limit for a field, resolved by its key (last path segment). */
export function limitFor(key: string): number {
  return TEXT_LIMITS[key] ?? DEFAULT_TEXT_LIMIT;
}

/**
 * If `value` exceeds the character limit for `key`, return a human-readable
 * error for `label`; otherwise null. Used by the server-side validators so an
 * over-limit field is rejected before it can be committed.
 */
export function lengthError(value: unknown, key: string, label: string): string | null {
  if (typeof value !== "string") return null; // shape errors are reported elsewhere
  const max = limitFor(key);
  return value.length > max ? `${label}: too long — ${value.length}/${max} characters (max ${max})` : null;
}

/* ------------------------------------------------------------------ *
 * Formats — a field "role" can require a specific shape (email, URL…).
 * ------------------------------------------------------------------ */
export type FieldFormat = "email" | "url" | "href" | "canonicalUrl" | "phone" | "slug" | "companyNumber" | "ratingScore";

const FORMAT_RE: Record<FieldFormat, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/[^\s.]+\.[^\s]+$/i,
  href: /^(https?:\/\/|\/|#|mailto:|tel:)/i,
  // A canonical URL or image src: a site path or a full http(s) URL only — no
  // anchors, mailto: or tel:.
  canonicalUrl: /^(https?:\/\/|\/)[^\s]*$/i,
  phone: /^[+0-9()\s.\-]{7,}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  companyNumber: /^[A-Za-z0-9]{6,10}$/,
  ratingScore: /^[0-5](?:\.[0-9])?(?:\s*\/\s*5)?$/,
};

const FORMAT_MSG: Record<FieldFormat, string> = {
  email: "must be a valid email address",
  url: "must be a full URL starting with http:// or https://",
  href: "must be a path (/page), anchor (#id), full URL, mailto: or tel:",
  canonicalUrl: "must be a site path (/page) or a full http:// or https:// URL",
  phone: "must be a phone number (digits, spaces, +, -, ( ) only)",
  slug: "must be lowercase letters, numbers and hyphens only",
  companyNumber: "must be 6–10 letters/numbers",
  ratingScore: "must be a score out of 5 (e.g. 4.9 or 4.9/5)",
};

/** Field roles (last path segment) that must match a format. */
export const FIELD_FORMATS: Record<string, FieldFormat> = {
  email: "email",
  url: "url",
  linkedin: "url",
  twitter: "url",
  facebook: "url",
  href: "href",
  canonical: "canonicalUrl",
  ogImage: "canonicalUrl",
  phone: "phone",
  phoneDisplay: "phone",
  companyNumber: "companyNumber",
  slug: "slug",
  ratingScore: "ratingScore",
};

/** The format a field role requires, or null. (For UI hints.) */
export function formatFor(key: string): FieldFormat | null {
  return FIELD_FORMATS[key] ?? null;
}

export function isFormat(value: string, format: FieldFormat): boolean {
  return FORMAT_RE[format].test(value.trim());
}

/** Human-readable requirement for a format (for inline UI hints). */
export function formatHint(format: FieldFormat): string {
  return FORMAT_MSG[format];
}

/** Format error for a field by role — only when it has a format AND is non-empty AND invalid. */
export function formatError(value: unknown, key: string, label: string): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  // Display labels (e.g. contact.labels.email = "Email us") share a key with a
  // real field but are plain text — never format-check them.
  if (/\.labels?\./i.test(label)) return null;
  const fmt = FIELD_FORMATS[key];
  if (!fmt) return null;
  return isFormat(value, fmt) ? null : `${label}: ${FORMAT_MSG[fmt]}`;
}

/** All errors for a field value (length + format), by role. Used by the validators. */
export function fieldErrors(value: unknown, key: string, label: string): string[] {
  const errs: string[] = [];
  const le = lengthError(value, key, label);
  if (le) errs.push(le);
  const fe = formatError(value, key, label);
  if (fe) errs.push(fe);
  return errs;
}

/* ------------------------------------------------------------------ *
 * Images — raster only (no SVG: avoids script-in-SVG on a committed asset).
 * ------------------------------------------------------------------ */
export const IMAGE_LIMITS = {
  /** Max file size in bytes (~2.5 MB). */
  maxBytes: 2_500_000,
  /** Bounding-box dimensions (px). */
  minWidth: 32,
  minHeight: 32,
  maxWidth: 5000,
  maxHeight: 5000,
  /** Allowed file extensions / mime accept string. */
  types: ["png", "jpg", "jpeg", "webp", "gif"] as const,
  accept: "image/png,image/jpeg,image/webp,image/gif",
} as const;

/** Human-readable byte size, e.g. 1_900_000 → "1.9 MB". */
export function humanSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${Math.round(bytes / 1000)} KB`;
  return `${bytes} B`;
}
