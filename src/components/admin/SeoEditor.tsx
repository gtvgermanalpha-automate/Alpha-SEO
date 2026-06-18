"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/content";
import { seoTargets, brandTitle, type SeoTarget } from "@/lib/seo/targets";
import type { SeoMap, SeoOverride } from "@/lib/cms/seoSchema";
import { useObjectEditor, EditorHeader, StatusBanners, LoadGate } from "@/components/admin/objectEditor";
import { Field, Checkbox } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { GoogleSnippetPreview } from "@/components/admin/GoogleSnippetPreview";

const GROUP_ORDER = ["Pages", "Services", "Industries", "How we help", "Case studies", "Blog", "Legal"];

type SetField = (route: string, field: keyof SeoOverride, value: string | boolean) => void;

export function SeoEditor() {
  const ed = useObjectEditor<SeoMap>("seo");

  const setField: SetField = (route, field, value) => {
    ed.mutate((prev) => {
      const next: SeoMap = { ...prev };
      const cur = { ...(next[route] ?? {}) } as Record<string, unknown>;
      const empty = value === "" || value === false;
      if (empty) delete cur[field];
      else cur[field] = value;
      if (Object.keys(cur).length === 0) delete next[route];
      else next[route] = cur as SeoOverride;
      return next;
    });
  };

  const groups = GROUP_ORDER.map((g) => [g, seoTargets.filter((t) => t.group === g)] as const).filter(
    ([, ts]) => ts.length > 0,
  );

  return (
    <div className="pb-16">
      <EditorHeader title="SEO & search" file="seo.json" saving={ed.saving} onSave={ed.save} />
      <StatusBanners saved={ed.saved} saveError={ed.saveError} issues={ed.issues} />
      <LoadGate load={ed.load} loadError={ed.loadError}>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Per-page search settings. Override a page&apos;s title, description, canonical URL, indexing and
          social-share preview. Leave a field blank to keep the page&apos;s own value. Changes publish on save.
        </p>

        {groups.map(([group, targets]) => (
          <section key={group} className="mt-8">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-muted">{group}</h2>
            <div className="mt-3 space-y-2">
              {targets.map((t) => (
                <RouteRow key={t.route} target={t} override={ed.data?.[t.route] ?? {}} setField={setField} />
              ))}
            </div>
          </section>
        ))}
      </LoadGate>
    </div>
  );
}

function RouteRow({
  target,
  override,
  setField,
}: {
  target: SeoTarget;
  override: SeoOverride;
  setField: SetField;
}) {
  const t = target;
  const isHome = t.route === "/";
  const overrideTitle = override.metaTitle?.trim();
  // What Google's <title> actually shows: the template appends the brand on every
  // route except home (which uses an absolute title). Mirror that in the preview.
  const previewTitle = overrideTitle ? (isHome ? overrideTitle : brandTitle(overrideTitle)) : t.defaultTitle;
  const effTitle = overrideTitle || t.defaultTitle;
  const effDesc = override.metaDescription?.trim() || t.defaultDescription;
  const count = Object.keys(override).length;
  const canonicalPlaceholder = `${siteConfig.url}${isHome ? "" : t.route}`;

  return (
    <details className="group border border-line bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="min-w-0">
          <span className="text-sm font-semibold text-ink">{t.label}</span>
          <span className="ml-2 font-mono text-xs text-muted">{t.route}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {override.noindex && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-red-700">
              No-index
            </span>
          )}
          {count > 0 && (
            <span className="rounded-full bg-blue px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-accent">
              {count} set
            </span>
          )}
          <span className="text-muted transition-transform group-open:rotate-180" aria-hidden>
            ▾
          </span>
        </span>
      </summary>

      <div className="space-y-4 border-t border-line p-4">
        <GoogleSnippetPreview route={t.route} title={previewTitle} description={effDesc} focusKeyword={override.focusKeyword} />

        <Field
          label="Meta title"
          value={override.metaTitle ?? ""}
          role="metaTitle"
          placeholder={t.defaultTitle}
          hint={isHome ? "Leave blank to use the page's own title." : "Leave blank to use the page's own title. “ | MMR Accountants” is added automatically — don't include it."}
          onChange={(v) => setField(t.route, "metaTitle", v)}
        />
        <Field
          label="Meta description"
          value={override.metaDescription ?? ""}
          role="metaDescription"
          multiline
          placeholder={t.defaultDescription}
          hint="Leave blank to use the page's own description."
          onChange={(v) => setField(t.route, "metaDescription", v)}
        />
        <Field
          label="Focus keyword"
          value={override.focusKeyword ?? ""}
          role="focusKeyword"
          hint="Editorial aid — highlighted in the preview above; not added to the page."
          onChange={(v) => setField(t.route, "focusKeyword", v)}
        />
        <Field
          label="Canonical URL"
          value={override.canonical ?? ""}
          role="canonical"
          placeholder={canonicalPlaceholder}
          hint="Leave blank for the default (this page's own URL)."
          onChange={(v) => setField(t.route, "canonical", v)}
        />

        <div className="grid gap-2 rounded-lg border border-line bg-cream/40 p-3 sm:grid-cols-2">
          <Checkbox
            label="No-index"
            hint="Hide this page from Google."
            checked={!!override.noindex}
            onChange={(v) => setField(t.route, "noindex", v)}
          />
          <Checkbox
            label="No-follow"
            hint="Don't pass link authority from this page."
            checked={!!override.nofollow}
            onChange={(v) => setField(t.route, "nofollow", v)}
          />
        </div>

        <div className="border-t border-line pt-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
            Social share (Open Graph / Twitter)
          </p>
          <div className="mt-3 space-y-4">
            <Field
              label="Social title"
              value={override.ogTitle ?? ""}
              role="ogTitle"
              placeholder={effTitle}
              hint="Defaults to the meta title."
              onChange={(v) => setField(t.route, "ogTitle", v)}
            />
            <Field
              label="Social description"
              value={override.ogDescription ?? ""}
              role="ogDescription"
              multiline
              placeholder={effDesc}
              hint="Defaults to the meta description."
              onChange={(v) => setField(t.route, "ogDescription", v)}
            />
            <ImageField
              label="Social share image"
              dir="og"
              value={override.ogImage ?? ""}
              onChange={(path) => setField(t.route, "ogImage", path)}
            />
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">Custom schema (JSON-LD)</p>
          <p className="mt-1 text-[0.68rem] text-muted">
            Optional structured data injected into this page&apos;s head — paste valid JSON-LD. Validated on save.
          </p>
          <textarea
            value={override.schema ?? ""}
            rows={5}
            placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "..."\n}'}
            onChange={(e) => setField(t.route, "schema", e.target.value)}
            className="mt-2 w-full resize-y border border-line bg-white px-3 py-2 font-mono text-xs text-ink focus:border-bronze focus-visible:outline-none focus:ring-1 focus:ring-bronze"
          />
        </div>

        {t.editorHref && (
          <Link
            href={t.editorHref}
            className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-bronze hover:underline"
          >
            Edit page content →
          </Link>
        )}
      </div>
    </details>
  );
}
