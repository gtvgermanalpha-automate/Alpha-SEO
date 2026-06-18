/**
 * Shapes + runtime validation for the site-wide CMS collections (Phase 2):
 *   - settings.json  → siteConfig (identity, contact, offices, social, hero image)
 *   - copy.json      → every editable section heading / paragraph / button label
 *
 * Same approach as detailSchema.ts / schemas.ts: the public site imports the JSON
 * and trusts its shape, so the CMS validates here BEFORE committing — a bad save
 * can never push malformed JSON that breaks the next build.
 */

import { fieldErrors } from "./limits";

/* ---------- Types (the contract the public components rely on) ---------- */

export type Office = {
  city: string;
  addressLine: string;
  postcode: string;
  phone: string;
  phoneDisplay: string;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  companyNumber: string;
  pillars: string[];
  url: string;
  description: string;
  /** "" = use the bundled default hero (public/hero.png); otherwise an uploaded path. */
  heroImage: string;
  /** Brand logos ("" = fall back to the typographic lockup). linear = header, circular = footer badge. */
  logoLinear: string;
  logoCircular: string;
  contact: {
    phone: string;
    phoneDisplay: string;
    email: string;
    addressLine: string;
    city: string;
    postcode: string;
    hours: string;
  };
  offices: Office[];
  social: { linkedin: string; twitter: string; facebook: string };
};

export type Heading = { eyebrow: string; title: string; subtitle: string };
export type PageMeta = {
  crumb: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
};

export type SiteCopy = {
  hero: {
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    paragraph: string;
    pillars: string[];
    primaryCta: string;
    secondaryCta: string;
    ratingScore: string;
    ratingLabel: string;
    badge: string;
  };
  trustedBy: { eyebrow: string };
  approach: { heading: Heading };
  services: { heading: Heading; ctaText: string; ctaButton: string };
  why: { heading: Heading; ctaText: string; ctaButton: string };
  industries: { heading: Heading };
  process: { heading: Heading };
  faq: { heading: Heading; stillHaveTitle: string; stillHaveText: string; stillHaveCta: string };
  cta: { eyebrow: string; title: string; subtitle: string; primaryCta: string };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    accepting: string;
    labels: { call: string; email: string; visit: string; hours: string };
  };
  footer: {
    blurb: string;
    cta: string;
    columns: { services: string; quickLinks: string; contact: string };
    disclaimer: string;
    legal: string[];
  };
  pages: {
    services: PageMeta;
    whyMmr: PageMeta;
    industries: PageMeta;
    howWeWork: PageMeta;
    faq: PageMeta;
    contact: PageMeta;
  };
};

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

/* ---------- Small validation helpers ---------- */

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";

/** Walk a dotted path (e.g. "contact.email") and require a non-empty string there. */
function reqStr(root: Record<string, unknown>, path: string, errors: string[]) {
  const parts = path.split(".");
  let cur: unknown = root;
  for (const p of parts) {
    if (!isObj(cur)) {
      errors.push(`${path}: missing parent object`);
      return;
    }
    cur = cur[p];
  }
  if (!isNonEmpty(cur)) {
    errors.push(`${path}: required, must be a non-empty string`);
    return;
  }
  errors.push(...fieldErrors(cur, parts[parts.length - 1], path));
}

/** Require an array of non-empty strings at `path` (1+ entries), each within its limit. */
function reqStrArray(root: Record<string, unknown>, path: string, errors: string[]) {
  const value = path.split(".").reduce<unknown>((acc, p) => (isObj(acc) ? acc[p] : undefined), root);
  if (!Array.isArray(value) || value.length === 0 || !value.every(isNonEmpty)) {
    errors.push(`${path}: required, must be a non-empty array of non-empty strings`);
    return;
  }
  const key = path.split(".").pop() ?? path;
  value.forEach((v, i) => {
    errors.push(...fieldErrors(v, key, `${path}[${i}]`));
  });
}

/** Validate a Heading object at `path` (eyebrow/title/subtitle). */
function reqHeading(root: Record<string, unknown>, path: string, errors: string[]) {
  reqStr(root, `${path}.eyebrow`, errors);
  reqStr(root, `${path}.title`, errors);
  reqStr(root, `${path}.subtitle`, errors);
}

/* ---------- settings.json ---------- */

export function validateSettings(value: unknown): ValidationResult {
  if (!isObj(value)) return { ok: false, errors: ["settings: must be an object"] };
  const errors: string[] = [];

  for (const p of ["name", "shortName", "companyNumber", "url", "description"]) {
    reqStr(value, p, errors);
  }
  // heroImage / logos may be "" (use default) — must still be strings.
  if (!isStr(value.heroImage)) errors.push("heroImage: must be a string (use \"\" for the default hero)");
  if (!isStr(value.logoLinear)) errors.push("logoLinear: must be a string (use \"\" for the typographic logo)");
  if (!isStr(value.logoCircular)) errors.push("logoCircular: must be a string (use \"\" for the typographic logo)");

  reqStrArray(value, "pillars", errors);

  for (const p of ["phone", "phoneDisplay", "email", "addressLine", "city", "postcode", "hours"]) {
    reqStr(value, `contact.${p}`, errors);
  }

  for (const p of ["linkedin", "twitter", "facebook"]) {
    reqStr(value, `social.${p}`, errors);
  }

  if (!Array.isArray(value.offices) || value.offices.length === 0) {
    errors.push("offices: required, must be a non-empty array");
  } else {
    value.offices.forEach((o, i) => {
      if (!isObj(o)) {
        errors.push(`offices[${i}]: must be an object`);
        return;
      }
      for (const p of ["city", "addressLine", "postcode", "phone", "phoneDisplay"]) {
        if (!isNonEmpty(o[p])) errors.push(`offices[${i}].${p}: required, must be a non-empty string`);
      }
    });
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}

/* ---------- copy.json ---------- */

const PAGE_KEYS = ["services", "whyMmr", "industries", "howWeWork", "faq", "contact"] as const;

export function validateCopy(value: unknown): ValidationResult {
  if (!isObj(value)) return { ok: false, errors: ["copy: must be an object"] };
  const errors: string[] = [];

  // hero
  for (const p of [
    "hero.eyebrow",
    "hero.headlineLead",
    "hero.headlineAccent",
    "hero.paragraph",
    "hero.primaryCta",
    "hero.secondaryCta",
    "hero.ratingScore",
    "hero.ratingLabel",
    "hero.badge",
  ]) {
    reqStr(value, p, errors);
  }
  reqStrArray(value, "hero.pillars", errors);

  reqStr(value, "trustedBy.eyebrow", errors);

  reqHeading(value, "approach.heading", errors);

  reqHeading(value, "services.heading", errors);
  reqStr(value, "services.ctaText", errors);
  reqStr(value, "services.ctaButton", errors);

  reqHeading(value, "why.heading", errors);
  reqStr(value, "why.ctaText", errors);
  reqStr(value, "why.ctaButton", errors);

  reqHeading(value, "industries.heading", errors);

  reqHeading(value, "process.heading", errors);

  reqHeading(value, "faq.heading", errors);
  for (const p of ["faq.stillHaveTitle", "faq.stillHaveText", "faq.stillHaveCta"]) {
    reqStr(value, p, errors);
  }

  for (const p of ["cta.eyebrow", "cta.title", "cta.subtitle", "cta.primaryCta"]) {
    reqStr(value, p, errors);
  }

  for (const p of ["contact.eyebrow", "contact.title", "contact.subtitle", "contact.accepting"]) {
    reqStr(value, p, errors);
  }
  for (const p of ["call", "email", "visit", "hours"]) {
    reqStr(value, `contact.labels.${p}`, errors);
  }

  reqStr(value, "footer.blurb", errors);
  reqStr(value, "footer.cta", errors);
  for (const p of ["services", "quickLinks", "contact"]) {
    reqStr(value, `footer.columns.${p}`, errors);
  }
  reqStr(value, "footer.disclaimer", errors);
  reqStrArray(value, "footer.legal", errors);

  if (!isObj(value.pages)) {
    errors.push("pages: required object");
  } else {
    for (const key of PAGE_KEYS) {
      for (const p of ["crumb", "title", "subtitle", "metaTitle", "metaDescription"]) {
        reqStr(value, `pages.${key}.${p}`, errors);
      }
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
