/**
 * Shape + runtime validation for the legal / policy pages (Phase 4):
 *   legal.json → { pages: LegalPage[] } (Privacy / Terms / Cookies).
 *
 * Types reuse content.ts via a type-only import (no runtime cycle).
 */
import type { LegalPage } from "@/lib/content";
import { lengthError } from "./limits";

export type LegalData = { pages: LegalPage[] };

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";
const isStrList = (v: unknown): boolean => Array.isArray(v) && v.length > 0 && v.every(isNonEmpty);

function strLen(value: unknown, key: string, label: string, errors: string[]) {
  const e = lengthError(value, key, label);
  if (e) errors.push(e);
}

const PAGE_STRINGS = ["slug", "crumb", "title", "intro", "updated", "metaTitle", "metaDescription"] as const;

export function validateLegal(value: unknown): ValidationResult {
  if (!isObj(value)) return { ok: false, errors: ["legal: must be an object"] };
  const errors: string[] = [];

  if (!Array.isArray(value.pages) || value.pages.length === 0) {
    errors.push("pages: required, must be a non-empty array");
    return { ok: false, errors };
  }

  const seen = new Set<string>();
  value.pages.forEach((page, i) => {
    const label = isObj(page) && isStr(page.slug) ? `page "${page.slug}"` : `pages[${i}]`;
    if (!isObj(page)) {
      errors.push(`${label}: must be an object`);
      return;
    }
    for (const key of PAGE_STRINGS) {
      if (!isNonEmpty(page[key])) errors.push(`${label}.${key}: required, must be a non-empty string`);
      else strLen(page[key], key, `${label}.${key}`, errors);
    }
    if (isStr(page.slug)) {
      if (seen.has(page.slug)) errors.push(`${label}: duplicate slug "${page.slug}"`);
      seen.add(page.slug);
    }

    if (!Array.isArray(page.sections) || page.sections.length === 0) {
      errors.push(`${label}.sections: required, must be a non-empty array`);
    } else {
      page.sections.forEach((section, si) => {
        const sl = `${label}.sections[${si}]`;
        if (!isObj(section)) {
          errors.push(`${sl}: must be an object`);
          return;
        }
        if (!isNonEmpty(section.heading)) errors.push(`${sl}.heading: required, must be a non-empty string`);
        else strLen(section.heading, "heading", `${sl}.heading`, errors);
        if (!isStrList(section.body)) errors.push(`${sl}.body: required, must be a non-empty list of strings`);
        else (section.body as string[]).forEach((b, bi) => strLen(b, "body", `${sl}.body[${bi}]`, errors));
        if (section.bullets !== undefined && !(Array.isArray(section.bullets) && section.bullets.every(isNonEmpty))) {
          errors.push(`${sl}.bullets: must be a list of non-empty strings when present`);
        } else if (Array.isArray(section.bullets)) {
          (section.bullets as string[]).forEach((b, bi) => strLen(b, "bullets", `${sl}.bullets[${bi}]`, errors));
        }
      });
    }
  });

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
