"use client";

import { Icon, iconNames, isIconName, type IconName } from "@/components/ui/Icon";
import { artNames, isArtName, type Name as ArtName, SpotArt } from "@/components/ui/SpotArt";
import { fieldClass, labelClass } from "@/components/admin/fields";

/** Dropdown constrained to the known Lucide icons, with a live preview.
 *  Selecting is restricted to the allow-list so a card can never get an icon
 *  the <Icon> component can't render. */
export function IconSelect({
  value,
  onChange,
  label = "Icon",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const known = isIconName(value);
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-line bg-cream text-bronze">
          {known ? (
            <Icon name={value as IconName} className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          ) : (
            <span className="text-xs font-bold text-red-600" aria-hidden>?</span>
          )}
        </span>
        <select value={known ? value : ""} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
          {!known && (
            <option value="" disabled>
              {value ? `Unknown: ${value}` : "Choose an icon"}
            </option>
          )}
          {iconNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

/** Dropdown constrained to the available SpotArt illustrations, with a preview. */
export function ArtSelect({
  value,
  onChange,
  label = "Illustration",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const known = isArtName(value);
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="flex items-center gap-3">
        <span className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden border border-line bg-cream p-1.5">
          {known ? (
            <SpotArt name={value as ArtName} />
          ) : (
            <span className="text-xs font-bold text-red-600" aria-hidden>?</span>
          )}
        </span>
        <select value={known ? value : ""} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
          {!known && (
            <option value="" disabled>
              {value ? `Unknown: ${value}` : "Choose an illustration"}
            </option>
          )}
          {artNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
