"use client";

import type { LegalData } from "@/lib/cms/legalSchema";
import { AddButton, Field, labelClass, moveItem, RowControls, StringList } from "@/components/admin/fields";
import { Card, EditorHeader, LoadGate, type Path, SaveBtn, setIn, StatusBanners, useObjectEditor } from "@/components/admin/objectEditor";

export function LegalEditor() {
  const { data, mutate, load, loadError, saving, saved, saveError, issues, save } =
    useObjectEditor<LegalData>("legal");

  const upd = (path: Path, value: unknown) => mutate((d) => setIn(d, path, value));

  return (
    <div className="pb-16">
      <EditorHeader title="Legal pages" file="legal.json" saving={saving} onSave={save} />
      <StatusBanners saved={saved} saveError={saveError} issues={issues} />

      <LoadGate load={load} loadError={loadError}>
        {data && (
          <>
            <p className="mt-5 max-w-2xl text-sm text-muted">
              The three policy pages are fixed (each maps to a fixed web address), so their slugs are locked —
              edit the wording and add / remove / reorder sections within each. These are standard templates;
              have your solicitor review the wording before relying on it.
            </p>
            <nav className="mt-4 flex flex-wrap gap-2">
              {data.pages.map((p, i) => (
                <a
                  key={p.slug}
                  href={`#legal-${i}`}
                  className="border border-line bg-white px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-bronze hover:text-bronze"
                >
                  {p.crumb || p.slug}
                </a>
              ))}
            </nav>
            <LegalFields data={data} upd={upd} />
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

function LegalFields({ data, upd }: { data: LegalData; upd: (path: Path, value: unknown) => void }) {
  const get = (path: Path): unknown => path.reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], data);
  const Text = (label: string, path: Path) => (
    <Field label={label} value={String(get(path) ?? "")} onChange={(v) => upd(path, v)} role={String(path[path.length - 1])} />
  );
  const Area = (label: string, path: Path, rows = 2) => (
    <Field label={label} value={String(get(path) ?? "")} onChange={(v) => upd(path, v)} role={String(path[path.length - 1])} multiline rows={rows} />
  );

  return (
    <>
      {data.pages.map((page, i) => (
        <Card key={page.slug} id={`legal-${i}`} title={page.title || page.slug}>
          <p className="font-mono text-xs text-muted">/{page.slug}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {Text("Breadcrumb", ["pages", i, "crumb"])}
            {Text("Title", ["pages", i, "title"])}
          </div>
          {Area("Intro", ["pages", i, "intro"])}
          <div className="grid gap-3 sm:grid-cols-2">
            {Text("Last reviewed", ["pages", i, "updated"])}
            {Text("Search-engine title", ["pages", i, "metaTitle"])}
          </div>
          {Area("Search-engine description", ["pages", i, "metaDescription"])}

          <div>
            <span className={labelClass}>Sections</span>
            <div className="space-y-3">
              {page.sections.map((section, si) => (
                <div key={si} className="border border-line bg-cream/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Section {si + 1}</span>
                    <RowControls
                      index={si}
                      count={page.sections.length}
                      onMove={(to) => upd(["pages", i, "sections"], moveItem(page.sections, si, to))}
                      onRemove={() => upd(["pages", i, "sections"], page.sections.filter((_, x) => x !== si))}
                      removeTitle="Remove section"
                    />
                  </div>
                  <div className="mt-3 space-y-3">
                    {Text("Heading", ["pages", i, "sections", si, "heading"])}
                    <div>
                      <span className={labelClass}>Paragraphs</span>
                      <StringList
                        items={section.body}
                        onChange={(v) => upd(["pages", i, "sections", si, "body"], v)}
                        multiline
                        addLabel="Add paragraph"
                        role="body"
                      />
                    </div>
                    <div>
                      <span className={labelClass}>Bullet points (optional)</span>
                      <StringList
                        items={section.bullets ?? []}
                        onChange={(v) => upd(["pages", i, "sections", si, "bullets"], v)}
                        addLabel="Add bullet"
                        role="bullets"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AddButton
              label="Add section"
              onClick={() => upd(["pages", i, "sections"], [...page.sections, { heading: "", body: [""] }])}
            />
          </div>
        </Card>
      ))}
    </>
  );
}
