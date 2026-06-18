/**
 * Shape + validation for the Team page (src/content/team.json) — an object with
 * a heading, intro and a list of members. Validated before the CMS commits.
 */
import { lengthError } from "./limits";

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isStr(v) && v.trim() !== "";

function reqStr(o: Record<string, unknown>, key: string, role: string, label: string, errors: string[]) {
  if (!isNonEmpty(o[key])) errors.push(`${label}.${key}: required, must be a non-empty string`);
  else {
    const e = lengthError(o[key], role, `${label}.${key}`);
    if (e) errors.push(e);
  }
}

export function validateTeam(value: unknown): ValidationResult {
  if (!isObj(value)) return { ok: false, errors: ["team: must be an object"] };
  const errors: string[] = [];

  reqStr(value, "heading", "heading", "team", errors);
  reqStr(value, "intro", "intro", "team", errors);

  if (!Array.isArray(value.members)) {
    errors.push("team.members: must be an array");
  } else {
    value.members.forEach((m, i) => {
      const label = `team.members[${i}]`;
      if (!isObj(m)) {
        errors.push(`${label}: must be an object`);
        return;
      }
      reqStr(m, "name", "name", label, errors);
      reqStr(m, "role", "role", label, errors);
      reqStr(m, "bio", "bio", label, errors);
      for (const key of ["image", "imageAlt"] as const) {
        if (m[key] === undefined) continue;
        if (!isStr(m[key])) errors.push(`${label}.${key}: must be a string when present`);
        else {
          const e = lengthError(m[key], key, `${label}.${key}`);
          if (e) errors.push(e);
        }
      }
    });
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
