"use client";

import type { MegaCategory, NavChild } from "@/lib/content";
import type { NavData } from "@/lib/cms/navSchema";
import { AddButton, Field, labelClass, moveItem, RowControls } from "@/components/admin/fields";
import { EditorHeader, LoadGate, type Path, SaveBtn, setIn, StatusBanners, useObjectEditor } from "@/components/admin/objectEditor";
import { IconSelect } from "@/components/admin/pickers";

export function NavEditor() {
  const { data, mutate, load, loadError, saving, saved, saveError, issues, save } =
    useObjectEditor<NavData>("nav");

  const upd = (path: Path, value: unknown) => mutate((d) => setIn(d, path, value));

  return (
    <div className="pb-16">
      <EditorHeader title="Navigation & menus" file="nav.json" saving={saving} onSave={save} />
      <StatusBanners saved={saved} saveError={saveError} issues={issues} />

      <LoadGate load={load} loadError={loadError}>
        {data && (
          <>
            <p className="mt-5 max-w-2xl text-sm text-muted">
              The top-level links are fixed (their count affects the header layout) — edit their text, links
              and dropdowns, and reorder them. Within a dropdown you can add, remove and reorder categories
              and items freely. Icons are chosen from a dropdown so the header can always draw them.
            </p>
            <nav className="mt-4 flex flex-wrap gap-2">
              {data.navLinks.map((link, i) => (
                <a
                  key={i}
                  href={`#nav-${i}`}
                  className="border border-line bg-white px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-bronze hover:text-bronze"
                >
                  {link.label || `Link ${i + 1}`}
                </a>
              ))}
            </nav>
            <NavFields data={data} upd={upd} />
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

function NavFields({ data, upd }: { data: NavData; upd: (path: Path, value: unknown) => void }) {
  const get = (path: Path): unknown => path.reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], data);
  const Text = (label: string, path: Path) => (
    <Field label={label} value={String(get(path) ?? "")} onChange={(v) => upd(path, v)} role={String(path[path.length - 1])} />
  );
  const Area = (label: string, path: Path, rows = 2) => (
    <Field label={label} value={String(get(path) ?? "")} onChange={(v) => upd(path, v)} role={String(path[path.length - 1])} multiline rows={rows} />
  );

  /** Simple dropdown (children) editor — label + href, add/remove/reorder. */
  const renderChildren = (i: number, children: NavChild[]) => (
    <div className="mt-4">
      <span className={labelClass}>Dropdown links</span>
      <div className="space-y-2">
        {children.map((_, cj) => (
          <div key={cj} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              {Text("Label", ["navLinks", i, "children", cj, "label"])}
              {Text("Link (href)", ["navLinks", i, "children", cj, "href"])}
            </div>
            <div className="pt-5">
              <RowControls
                index={cj}
                count={children.length}
                onMove={(to) => upd(["navLinks", i, "children"], moveItem(children, cj, to))}
                onRemove={() => upd(["navLinks", i, "children"], children.filter((_, x) => x !== cj))}
                removeTitle="Remove link"
              />
            </div>
          </div>
        ))}
      </div>
      <AddButton label="Add dropdown link" onClick={() => upd(["navLinks", i, "children"], [...children, { label: "", href: "" }])} />
    </div>
  );

  /** Two-pane mega-menu editor — categories, each with items. */
  const renderMega = (i: number, mega: MegaCategory[]) => (
    <div className="mt-4">
      <span className={labelClass}>Menu categories</span>
      <div className="space-y-3">
        {mega.map((cat, ci) => (
          <div key={ci} className="border border-line bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Category {ci + 1}</span>
              <RowControls
                index={ci}
                count={mega.length}
                onMove={(to) => upd(["navLinks", i, "mega"], moveItem(mega, ci, to))}
                onRemove={() => upd(["navLinks", i, "mega"], mega.filter((_, x) => x !== ci))}
                removeTitle="Remove category"
              />
            </div>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {Text("Category label", ["navLinks", i, "mega", ci, "label"])}
              <IconSelect value={cat.icon} onChange={(v) => upd(["navLinks", i, "mega", ci, "icon"], v)} />
            </div>
            <div className="mt-3">
              <span className={labelClass}>Items</span>
              <div className="space-y-2">
                {cat.items.map((it, ii) => (
                  <div key={ii} className="border border-line bg-cream/30 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted">Item {ii + 1}</span>
                      <RowControls
                        index={ii}
                        count={cat.items.length}
                        onMove={(to) => upd(["navLinks", i, "mega", ci, "items"], moveItem(cat.items, ii, to))}
                        onRemove={() => upd(["navLinks", i, "mega", ci, "items"], cat.items.filter((_, x) => x !== ii))}
                        removeTitle="Remove item"
                      />
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {Text("Title", ["navLinks", i, "mega", ci, "items", ii, "title"])}
                      <IconSelect value={it.icon} onChange={(v) => upd(["navLinks", i, "mega", ci, "items", ii, "icon"], v)} />
                    </div>
                    <div className="mt-2">{Area("Description", ["navLinks", i, "mega", ci, "items", ii, "description"])}</div>
                    <div className="mt-2">{Text("Link (href)", ["navLinks", i, "mega", ci, "items", ii, "href"])}</div>
                  </div>
                ))}
              </div>
              <AddButton
                label="Add item"
                onClick={() => upd(["navLinks", i, "mega", ci, "items"], [...cat.items, { title: "", description: "", icon: "BookOpen", href: "" }])}
              />
            </div>
          </div>
        ))}
      </div>
      <AddButton label="Add category" onClick={() => upd(["navLinks", i, "mega"], [...mega, { label: "", icon: "BookOpen", items: [] }])} />
    </div>
  );

  return (
    <>
      {data.navLinks.map((link, i) => (
        <section key={i} id={`nav-${i}`} className="mt-6 scroll-mt-24 border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">{link.label || `Link ${i + 1}`}</h2>
            <RowControls index={i} count={data.navLinks.length} onMove={(to) => upd(["navLinks"], moveItem(data.navLinks, i, to))} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Text("Label", ["navLinks", i, "label"])}
            {Text("Link (href)", ["navLinks", i, "href"])}
          </div>
          {link.mega ? renderMega(i, link.mega) : link.children ? renderChildren(i, link.children) : null}
        </section>
      ))}
    </>
  );
}
