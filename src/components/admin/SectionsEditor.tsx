"use client";

import type { SectionsData } from "@/lib/cms/itemsSchema";
import { AddButton, Field, labelClass, moveItem, RowControls, StringList } from "@/components/admin/fields";
import { Card, EditorHeader, LoadGate, type Path, SaveBtn, setIn, StatusBanners, useObjectEditor } from "@/components/admin/objectEditor";
import { ArtSelect, IconSelect } from "@/components/admin/pickers";

const NAV = [
  { id: "sec-services", label: "Services" },
  { id: "sec-why", label: "Why us" },
  { id: "sec-process", label: "Process" },
  { id: "sec-faqs", label: "FAQs" },
  { id: "sec-partners", label: "Trust badges" },
  { id: "sec-business", label: "Business types" },
] as const;

export function SectionsEditor() {
  const { data, mutate, load, loadError, saving, saved, saveError, issues, save } =
    useObjectEditor<SectionsData>("sections");

  const upd = (path: Path, value: unknown) => mutate((d) => setIn(d, path, value));

  return (
    <div className="pb-16">
      <EditorHeader title="Section items" file="sections.json" saving={saving} onSave={save} />
      <StatusBanners saved={saved} saveError={saveError} issues={issues} />

      <LoadGate load={load} loadError={loadError}>
        {data && (
          <>
            <nav className="mt-5 flex flex-wrap gap-2">
              {NAV.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="border border-line bg-white px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-bronze hover:text-bronze"
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <SectionsFields data={data} upd={upd} />
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

/** Stable top-level component so inputs never remount (drop focus) while typing. */
function SectionsFields({ data, upd }: { data: SectionsData; upd: (path: Path, value: unknown) => void }) {
  const get = (path: Path): unknown => path.reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], data);
  const Text = (label: string, path: Path) => (
    <Field label={label} value={String(get(path) ?? "")} onChange={(v) => upd(path, v)} role={String(path[path.length - 1])} />
  );
  const Area = (label: string, path: Path, rows = 2) => (
    <Field label={label} value={String(get(path) ?? "")} onChange={(v) => upd(path, v)} role={String(path[path.length - 1])} multiline rows={rows} />
  );

  return (
    <>
      <Card
        id="sec-services"
        title="Services"
        description="The six service cards (home page + footer). Each slug links to its detail page, so slugs and the list itself are locked — edit the content and reorder only."
      >
        <div className="space-y-4">
          {data.services.map((s, i) => (
            <div key={s.slug} className="border border-line bg-cream/30 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">/services/{s.slug}</span>
                <RowControls index={i} count={data.services.length} onMove={(to) => upd(["services"], moveItem(data.services, i, to))} />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <IconSelect value={s.icon} onChange={(v) => upd(["services", i, "icon"], v)} />
                <ArtSelect value={s.art} onChange={(v) => upd(["services", i, "art"], v)} />
              </div>
              <div className="mt-3 space-y-3">
                {Text("Title", ["services", i, "title"])}
                {Area("Description", ["services", i, "description"])}
                <div>
                  <span className={labelClass}>Bullet points</span>
                  <StringList items={s.points} onChange={(v) => upd(["services", i, "points"], v)} addLabel="Add point" role="points" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card id="sec-why" title="Why us — reasons" description="The reason-to-choose cards. Add, remove and reorder freely.">
        <div className="space-y-4">
          {data.whyPoints.map((w, i) => (
            <div key={i} className="border border-line bg-cream/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Reason {i + 1}</span>
                <RowControls
                  index={i}
                  count={data.whyPoints.length}
                  onMove={(to) => upd(["whyPoints"], moveItem(data.whyPoints, i, to))}
                  onRemove={() => upd(["whyPoints"], data.whyPoints.filter((_, idx) => idx !== i))}
                  removeTitle="Remove reason"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <IconSelect value={w.icon} onChange={(v) => upd(["whyPoints", i, "icon"], v)} />
                {Text("Title", ["whyPoints", i, "title"])}
              </div>
              <div className="mt-3">{Area("Description", ["whyPoints", i, "description"])}</div>
            </div>
          ))}
        </div>
        <AddButton label="Add reason" onClick={() => upd(["whyPoints"], [...data.whyPoints, { icon: "Award", title: "", description: "" }])} />
      </Card>

      <Card id="sec-process" title="Process — steps" description="The numbered process steps. Add, remove and reorder freely.">
        <div className="space-y-4">
          {data.processSteps.map((p, i) => (
            <div key={i} className="border border-line bg-cream/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Step {i + 1}</span>
                <RowControls
                  index={i}
                  count={data.processSteps.length}
                  onMove={(to) => upd(["processSteps"], moveItem(data.processSteps, i, to))}
                  onRemove={() => upd(["processSteps"], data.processSteps.filter((_, idx) => idx !== i))}
                  removeTitle="Remove step"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {Text("Step label (e.g. 01)", ["processSteps", i, "step"])}
                <IconSelect value={p.icon} onChange={(v) => upd(["processSteps", i, "icon"], v)} />
              </div>
              <div className="mt-3 space-y-3">
                {Text("Title", ["processSteps", i, "title"])}
                {Area("Description", ["processSteps", i, "description"])}
              </div>
            </div>
          ))}
        </div>
        <AddButton
          label="Add step"
          onClick={() => upd(["processSteps"], [...data.processSteps, { step: "", title: "", description: "", icon: "Sparkles" }])}
        />
      </Card>

      <Card id="sec-faqs" title="FAQs" description="The home / FAQ-page questions and answers. Add, remove and reorder freely.">
        <div className="space-y-4">
          {data.faqs.map((f, i) => (
            <div key={i} className="border border-line bg-cream/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">FAQ {i + 1}</span>
                <RowControls
                  index={i}
                  count={data.faqs.length}
                  onMove={(to) => upd(["faqs"], moveItem(data.faqs, i, to))}
                  onRemove={() => upd(["faqs"], data.faqs.filter((_, idx) => idx !== i))}
                  removeTitle="Remove FAQ"
                />
              </div>
              <div className="mt-3 space-y-3">
                {Text("Question", ["faqs", i, "question"])}
                {Area("Answer", ["faqs", i, "answer"], 3)}
              </div>
            </div>
          ))}
        </div>
        <AddButton label="Add FAQ" onClick={() => upd(["faqs"], [...data.faqs, { question: "", answer: "" }])} />
      </Card>

      <Card id="sec-partners" title="Trust badges" description="The accreditation / platform names shown in the strip under the hero.">
        <StringList items={data.partners} onChange={(v) => upd(["partners"], v)} addLabel="Add badge" placeholder="e.g. Xero" role="partners" />
      </Card>

      <Card id="sec-business" title="Business types" description="The options in the contact-form “Business type” dropdown.">
        <StringList items={data.businessTypes} onChange={(v) => upd(["businessTypes"], v)} addLabel="Add type" placeholder="e.g. Sole trader" role="businessTypes" />
      </Card>
    </>
  );
}
