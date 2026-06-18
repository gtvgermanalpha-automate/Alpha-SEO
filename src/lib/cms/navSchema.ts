/**
 * Shape + runtime validation for the navigation / mega-menus (Phase 4):
 *   nav.json → { navLinks: NavLink[] } (the four *Menu arrays are inlined here).
 *
 * Mega-menu category and item icons are validated against the live Icon allow-list
 * — an unknown icon would crash the header at render, so a bad save is rejected.
 *
 * Types reuse content.ts via a type-only import (erased at runtime; content.ts does
 * not import this module back, so there is no cycle).
 */
import type { NavLink } from "@/lib/content";
import { isIconName } from "@/components/ui/Icon";
import { fieldErrors } from "./limits";

export type NavData = { navLinks: NavLink[] };

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";

/** Push a length error if `value` exceeds the limit for `key` (no-op for non-strings). */
function strLen(value: unknown, key: string, label: string, errors: string[]) {
  errors.push(...fieldErrors(value, key, label));
}

export function validateNav(value: unknown): ValidationResult {
  if (!isObj(value)) return { ok: false, errors: ["nav: must be an object"] };
  const errors: string[] = [];

  if (!Array.isArray(value.navLinks) || value.navLinks.length === 0) {
    errors.push("navLinks: required, must be a non-empty array");
    return { ok: false, errors };
  }

  value.navLinks.forEach((link, i) => {
    const l = `navLinks[${i}]`;
    if (!isObj(link)) {
      errors.push(`${l}: must be an object`);
      return;
    }
    if (!isNonEmpty(link.label)) errors.push(`${l}.label: required, must be a non-empty string`);
    else strLen(link.label, "label", `${l}.label`, errors);
    if (!isNonEmpty(link.href)) errors.push(`${l}.href: required, must be a non-empty string`);
    else strLen(link.href, "href", `${l}.href`, errors);

    if (link.children !== undefined) {
      if (!Array.isArray(link.children)) {
        errors.push(`${l}.children: must be an array when present`);
      } else {
        link.children.forEach((c, ci) => {
          const cl = `${l}.children[${ci}]`;
          if (!isObj(c) || !isNonEmpty(c.label) || !isNonEmpty(c.href)) {
            errors.push(`${cl}: each child needs a non-empty label and href`);
          }
        });
      }
    }

    if (link.mega !== undefined) {
      if (!Array.isArray(link.mega)) {
        errors.push(`${l}.mega: must be an array when present`);
      } else {
        link.mega.forEach((cat, ci) => {
          const cl = `${l}.mega[${ci}]`;
          if (!isObj(cat)) {
            errors.push(`${cl}: must be an object`);
            return;
          }
          if (!isNonEmpty(cat.label)) errors.push(`${cl}.label: required, must be a non-empty string`);
          else strLen(cat.label, "label", `${cl}.label`, errors);
          if (!isIconName(cat.icon)) errors.push(`${cl}.icon: "${String(cat.icon)}" is not a known icon name`);
          if (!Array.isArray(cat.items) || cat.items.length === 0) {
            errors.push(`${cl}.items: required, must be a non-empty array`);
          } else {
            cat.items.forEach((it, ii) => {
              const il = `${cl}.items[${ii}]`;
              if (!isObj(it)) {
                errors.push(`${il}: must be an object`);
                return;
              }
              if (!isNonEmpty(it.title)) errors.push(`${il}.title: required, must be a non-empty string`);
              else strLen(it.title, "title", `${il}.title`, errors);
              if (!isNonEmpty(it.description)) errors.push(`${il}.description: required, must be a non-empty string`);
              else strLen(it.description, "description", `${il}.description`, errors);
              if (!isNonEmpty(it.href)) errors.push(`${il}.href: required, must be a non-empty string`);
              else strLen(it.href, "href", `${il}.href`, errors);
              if (!isIconName(it.icon)) errors.push(`${il}.icon: "${String(it.icon)}" is not a known icon name`);
            });
          }
        });
      }
    }
  });

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
