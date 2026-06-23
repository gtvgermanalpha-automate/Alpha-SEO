"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { limitFor, formatFor, isFormat, formatHint, type FieldFormat } from "@/lib/cms/limits";

/** Shared admin form primitives, reused across CMS editors. */

export const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm placeholder:text-ink/30 transition-colors focus:border-bronze focus-visible:outline-none focus:ring-2 focus:ring-bronze/25";
export const labelClass = "mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink";

/** Live character counter — turns red once the value is over the limit. */
export function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`shrink-0 text-[0.68rem] tabular-nums ${over ? "font-semibold text-red-600" : "text-muted/70"}`}>
      {value.length}/{max}
    </span>
  );
}

/**
 * Text input / textarea with a live character counter + over-limit styling.
 * The limit comes from an explicit `max`, or the field `role` resolved against
 * the central CMS limits (so it always matches what the server will enforce).
 */
export function LimitedField({
  value,
  onChange,
  role,
  max,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  role?: string;
  max?: number;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const limit = max ?? (role ? limitFor(role) : 400);
  const over = value.length > limit;
  const cls = `${fieldClass} ${over ? "border-red-400 focus:border-red-500 focus:ring-red-400" : ""}`;
  return (
    <div>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} resize-y`}
        />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      <div className="mt-0.5 flex justify-end">
        <CharCount value={value} max={limit} />
      </div>
    </div>
  );
}

/**
 * Complete labeled CMS text field: label + live character counter, with the
 * per-field character limit AND format (email/URL/phone/…) resolved from the
 * field `role` (or overridden via `max`/`format`). Turns red over the limit or
 * on an invalid format and shows the requirement inline. The single building
 * block the editors use so every input is validated consistently.
 */
export function Field({
  label,
  value,
  onChange,
  role,
  max,
  format,
  hint,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Field role (last path segment, e.g. "email", "title") → resolves limit + format. */
  role?: string;
  max?: number;
  format?: FieldFormat;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const limit = max ?? (role ? limitFor(role) : 400);
  const fmt = format ?? (role ? formatFor(role) : null);
  const over = value.length > limit;
  const badFormat = !!fmt && value.trim() !== "" && !isFormat(value, fmt);
  const invalid = over || badFormat;
  const cls = `${fieldClass} ${invalid ? "border-red-400 focus:border-red-500 focus:ring-red-400" : ""}`;
  const note = badFormat ? formatHint(fmt!) : hint;
  return (
    <label className="block">
      <span className="mb-1 flex items-end justify-between gap-2">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">{label}</span>
        <CharCount value={value} max={limit} />
      </span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} resize-y`}
        />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {note && (
        <span className={`mt-1 block text-[0.68rem] ${badFormat ? "font-medium text-red-600" : "text-muted"}`}>{note}</span>
      )}
    </label>
  );
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function Labeled({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        {hint && <span className="mb-1 text-[0.7rem] text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function MiniBtn({
  children,
  onClick,
  disabled,
  title,
  danger,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border text-xs transition-colors disabled:opacity-25 ${
        danger
          ? "border-line text-red-600 hover:border-red-400 hover:bg-red-50"
          : "border-line text-muted hover:border-bronze hover:text-bronze"
      }`}
    >
      {children}
    </button>
  );
}

export function RowControls({
  index,
  count,
  onMove,
  onRemove,
  removeTitle,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  /** Omit to make the row reorder-only (no remove button) — e.g. slug-locked lists. */
  onRemove?: () => void;
  removeTitle?: string;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <MiniBtn title="Move up" onClick={() => onMove(index - 1)} disabled={index === 0}>
        ↑
      </MiniBtn>
      <MiniBtn title="Move down" onClick={() => onMove(index + 1)} disabled={index === count - 1}>
        ↓
      </MiniBtn>
      {onRemove && (
        <MiniBtn title={removeTitle ?? "Remove"} onClick={onRemove} danger>
          ✕
        </MiniBtn>
      )}
    </div>
  );
}

export function StringList({
  items,
  onChange,
  multiline = false,
  addLabel = "Add item",
  placeholder = "",
  role,
  max,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
  placeholder?: string;
  /** Field role (e.g. "points", "bullets") — resolves the per-item character limit. */
  role?: string;
  /** Explicit per-item character limit (overrides `role`). */
  max?: number;
}) {
  const set = (i: number, value: string) => onChange(items.map((it, idx) => (idx === i ? value : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (from: number, to: number) => onChange(moveItem(items, from, to));
  const limit = max ?? (role ? limitFor(role) : undefined);

  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-xs italic text-muted">None yet.</p>}
      {items.map((item, i) => {
        const over = limit !== undefined && item.length > limit;
        const cls = `${fieldClass} ${over ? "border-red-400" : ""}`;
        return (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              {multiline ? (
                <textarea
                  value={item}
                  placeholder={placeholder}
                  rows={2}
                  onChange={(e) => set(i, e.target.value)}
                  className={`${cls} resize-y`}
                />
              ) : (
                <input value={item} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} className={cls} />
              )}
              {limit !== undefined && (
                <div className="mt-0.5 flex justify-end">
                  <CharCount value={item} max={limit} />
                </div>
              )}
            </div>
            <div className="pt-0.5">
              <RowControls index={i} count={items.length} onMove={(to) => move(i, to)} onRemove={() => remove(i)} removeTitle="Remove" />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze hover:underline"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 rounded-lg border border-dashed border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-bronze transition-colors hover:border-bronze hover:bg-bronze-50"
    >
      + {label}
    </button>
  );
}

/** Labeled checkbox with an optional hint line. */
export function Checkbox({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-bronze"
      />
      <span>
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-[0.68rem] leading-snug text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/* ---------- shared editor chrome (used by PageEditor + BlogEditor) ---------- */

export function BackLink() {
  return (
    <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze hover:underline">
      ← All content
    </Link>
  );
}

export function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="rounded-lg bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? "Saving…" : "Save draft"}
    </button>
  );
}

export function StatusBanner({ saved, error, issues }: { saved: boolean; error: string; issues: string[] }) {
  if (saved) {
    return (
      <div className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
        Saved as a draft. It’s <strong>not live yet</strong> — click <strong>Publish changes</strong> on the
        dashboard when you’re ready to push your edits to the live site.
      </div>
    );
  }
  if (error || issues.length > 0) {
    return (
      <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        {error && <p className="font-semibold">{error}</p>}
        {issues.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return null;
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
