"use client";

import type { ReactNode } from "react";
import type { SiteCopy } from "@/lib/cms/siteSchema";
import { CharCount, fieldClass, Labeled, StringList } from "@/components/admin/fields";
import { limitFor } from "@/lib/cms/limits";
import { Card, EditorHeader, LoadGate, type Path, SaveBtn, setIn, StatusBanners, useObjectEditor } from "@/components/admin/objectEditor";

/** Sections, in page order — drives both the jump-nav and the card anchors. */
const SECTIONS = [
  { id: "sec-hero", label: "Hero" },
  { id: "sec-trustedby", label: "Trusted by" },
  { id: "sec-approach", label: "Approach" },
  { id: "sec-services", label: "Services" },
  { id: "sec-why", label: "Why MMR" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-process", label: "Process" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-cta", label: "CTA band" },
  { id: "sec-contact", label: "Contact" },
  { id: "sec-footer", label: "Footer" },
  { id: "sec-pages", label: "Page headers" },
] as const;

const PAGE_ENTRIES: { key: keyof SiteCopy["pages"]; label: string }[] = [
  { key: "services", label: "Services page" },
  { key: "whyMmr", label: "Why MMR page" },
  { key: "industries", label: "Industries page" },
  { key: "howWeWork", label: "How We Work page" },
  { key: "faq", label: "FAQ page" },
  { key: "contact", label: "Contact page" },
];

export function CopyEditor() {
  const { data, mutate, load, loadError, saving, saved, saveError, issues, save } =
    useObjectEditor<SiteCopy>("copy");

  const upd = (path: Path, value: unknown) => mutate((d) => setIn(d, path, value));

  return (
    <div className="pb-16">
      <EditorHeader title="Section text & headings" file="copy.json" saving={saving} onSave={save} />
      <StatusBanners saved={saved} saveError={saveError} issues={issues} />

      <LoadGate load={load} loadError={loadError}>
        {data && (
          <>
            <nav className="mt-5 flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="border border-line bg-white px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-bronze hover:text-bronze"
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <CopyFields data={data} upd={upd} />

            <div className="mt-8 flex items-center gap-4">
              <SaveBtn saving={saving} onClick={save} />
              {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
            </div>
          </>
        )}
      </LoadGate>
    </div>
  );
}

/** All the section cards. Kept as a stable top-level component so inputs never
 *  remount (which would drop focus) as the user types. */
function CopyFields({ data, upd }: { data: SiteCopy; upd: (path: Path, value: unknown) => void }) {
  const get = (path: Path): unknown => path.reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], data);

  /** Props for a controlled text input/textarea bound to a path. */
  const bind = (path: Path) => ({
    value: String(get(path) ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => upd(path, e.target.value),
  });

  const Text = (label: string, path: Path, hint?: string) => {
    const v = String(get(path) ?? "");
    const limit = limitFor(String(path[path.length - 1]));
    return (
      <Labeled label={label} hint={hint}>
        <input {...bind(path)} className={`${fieldClass} ${v.length > limit ? "border-red-400" : ""}`} />
        <div className="mt-0.5 flex justify-end">
          <CharCount value={v} max={limit} />
        </div>
      </Labeled>
    );
  };
  const Area = (label: string, path: Path, rows = 3) => {
    const v = String(get(path) ?? "");
    const limit = limitFor(String(path[path.length - 1]));
    return (
      <Labeled label={label}>
        <textarea {...bind(path)} rows={rows} className={`${fieldClass} resize-y ${v.length > limit ? "border-red-400" : ""}`} />
        <div className="mt-0.5 flex justify-end">
          <CharCount value={v} max={limit} />
        </div>
      </Labeled>
    );
  };
  /** eyebrow + title + subtitle for a section heading at `base`. */
  const heading = (base: Path): ReactNode => (
    <>
      {Text("Eyebrow", [...base, "eyebrow"])}
      {Text("Title", [...base, "title"])}
      {Area("Subtitle", [...base, "subtitle"], 2)}
    </>
  );

  return (
    <>
      <Card id="sec-hero" title="Hero" description="The top of the home page.">
        <div className="grid gap-4 sm:grid-cols-2">
          {Text("Eyebrow", ["hero", "eyebrow"])}
          {Text("Badge", ["hero", "badge"])}
          {Text("Headline — lead", ["hero", "headlineLead"])}
          {Text("Headline — accent (coloured)", ["hero", "headlineAccent"])}
        </div>
        {Area("Paragraph", ["hero", "paragraph"])}
        <div className="grid gap-4 sm:grid-cols-2">
          {Text("Primary button", ["hero", "primaryCta"])}
          {Text("Secondary button", ["hero", "secondaryCta"])}
          {Text("Rating score", ["hero", "ratingScore"], "e.g. 4.9/5")}
          {Text("Rating label", ["hero", "ratingLabel"], "e.g. by 1,200+ clients")}
        </div>
        <div>
          <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">
            Hero pillars
          </span>
          <StringList items={data.hero.pillars} onChange={(v) => upd(["hero", "pillars"], v)} addLabel="Add pillar" role="pillars" />
        </div>
      </Card>

      <Card id="sec-trustedby" title="Trusted by" description="The accreditation / platform strip under the hero.">
        {Text("Eyebrow", ["trustedBy", "eyebrow"])}
      </Card>

      <Card id="sec-approach" title="Approach" description='The "how we help" value-prop section.'>
        {heading(["approach", "heading"])}
      </Card>

      <Card id="sec-services" title="Services" description="The services section heading + its call-to-action.">
        {heading(["services", "heading"])}
        {Text("CTA text", ["services", "ctaText"])}
        {Text("CTA button", ["services", "ctaButton"])}
      </Card>

      <Card id="sec-why" title="Why MMR" description="The reasons-to-choose section heading + its call-to-action.">
        {heading(["why", "heading"])}
        {Text("CTA text", ["why", "ctaText"])}
        {Text("CTA button", ["why", "ctaButton"])}
      </Card>

      <Card id="sec-industries" title="Industries" description="The industries section heading.">
        {heading(["industries", "heading"])}
      </Card>

      <Card id="sec-process" title="Process" description='The "how we work" steps section heading.'>
        {heading(["process", "heading"])}
      </Card>

      <Card id="sec-faq" title="FAQ" description="The FAQ section heading + the closing prompt.">
        {heading(["faq", "heading"])}
        {Text("“Still have a question?” title", ["faq", "stillHaveTitle"])}
        {Area("“Still have a question?” text", ["faq", "stillHaveText"], 2)}
        {Text("“Still have a question?” button", ["faq", "stillHaveCta"])}
      </Card>

      <Card id="sec-cta" title="CTA band" description="The dark call-to-action band near the foot of most pages.">
        {Text("Eyebrow", ["cta", "eyebrow"])}
        {Text("Title", ["cta", "title"])}
        {Area("Subtitle", ["cta", "subtitle"], 2)}
        {Text("Primary button", ["cta", "primaryCta"])}
      </Card>

      <Card id="sec-contact" title="Contact" description="The contact section intro + the labels on the details list.">
        {Text("Eyebrow", ["contact", "eyebrow"])}
        {Text("Title", ["contact", "title"])}
        {Area("Subtitle", ["contact", "subtitle"], 2)}
        {Text("“Accepting clients” pill", ["contact", "accepting"])}
        <div className="grid gap-4 sm:grid-cols-2">
          {Text("Label — call", ["contact", "labels", "call"])}
          {Text("Label — email", ["contact", "labels", "email"])}
          {Text("Label — visit", ["contact", "labels", "visit"])}
          {Text("Label — hours", ["contact", "labels", "hours"])}
        </div>
      </Card>

      <Card id="sec-footer" title="Footer" description="The footer blurb, column headings and small print.">
        {Area("Blurb", ["footer", "blurb"], 2)}
        {Text("CTA button", ["footer", "cta"])}
        <div className="grid gap-4 sm:grid-cols-3">
          {Text("Column — services", ["footer", "columns", "services"])}
          {Text("Column — quick links", ["footer", "columns", "quickLinks"])}
          {Text("Column — contact", ["footer", "columns", "contact"])}
        </div>
        {Area("Disclaimer / small print", ["footer", "disclaimer"], 3)}
        <div>
          <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">
            Legal link labels
          </span>
          <StringList items={data.footer.legal} onChange={(v) => upd(["footer", "legal"], v)} addLabel="Add legal link" role="legal" />
        </div>
      </Card>

      <Card
        id="sec-pages"
        title="Page headers"
        description="The breadcrumb, banner title/subtitle and search-engine listing for each sub-page."
      >
        <div className="space-y-4">
          {PAGE_ENTRIES.map(({ key, label }) => (
            <div key={key} className="border border-line bg-cream/30 p-4">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">{label}</span>
              <div className="mt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {Text("Breadcrumb", ["pages", key, "crumb"])}
                  {Text("Banner title", ["pages", key, "title"])}
                </div>
                {Area("Banner subtitle", ["pages", key, "subtitle"], 2)}
                {Text("Search-engine title", ["pages", key, "metaTitle"])}
                {Area("Search-engine description", ["pages", key, "metaDescription"], 2)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
