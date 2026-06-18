"use client";

import type { Review, ReviewsData } from "@/lib/cms/schemas";
import { AddButton, Field, fieldClass, labelClass, moveItem, RowControls } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { Card, EditorHeader, LoadGate, SaveBtn, StatusBanners, useObjectEditor } from "@/components/admin/objectEditor";

function StarSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={`text-2xl leading-none transition-colors hover:text-[#fbbc05] ${n <= value ? "text-[#fbbc05]" : "text-line"}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-xs text-muted">{value}/5</span>
    </div>
  );
}

export function ReviewsEditor() {
  const { data, mutate, load, loadError, saving, saved, saveError, issues, save } =
    useObjectEditor<ReviewsData>("reviews");

  const setReview = (i: number, next: Review) =>
    mutate((d) => ({ ...d, reviews: d.reviews.map((r, idx) => (idx === i ? next : r)) }));

  return (
    <div className="pb-16">
      <EditorHeader title="Google reviews" file="reviews.json" saving={saving} onSave={save} />
      <StatusBanners saved={saved} saveError={saveError} issues={issues} />

      <LoadGate load={load} loadError={loadError}>
        {data && (
          <>
            <Card title="Section heading">
              <Field label="Eyebrow" value={data.eyebrow} onChange={(v) => mutate((d) => ({ ...d, eyebrow: v }))} role="eyebrow" />
              <Field label="Title" value={data.title} onChange={(v) => mutate((d) => ({ ...d, title: v }))} role="title" />
              <Field label="Intro" value={data.intro} onChange={(v) => mutate((d) => ({ ...d, intro: v }))} role="subtitle" multiline />
            </Card>

            <Card title="Rating summary">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Score (e.g. 4.9)" value={data.rating.score} onChange={(v) => mutate((d) => ({ ...d, rating: { ...d.rating, score: v } }))} format="ratingScore" max={6} />
                <Field label="Out of (e.g. 5)" value={data.rating.outOf} onChange={(v) => mutate((d) => ({ ...d, rating: { ...d.rating, outOf: v } }))} max={3} />
                <label className="block">
                  <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">Review count</span>
                  <input
                    type="number"
                    min={0}
                    value={data.rating.count}
                    onChange={(e) => mutate((d) => ({ ...d, rating: { ...d.rating, count: Number(e.target.value) || 0 } }))}
                    className={fieldClass}
                  />
                </label>
                <Field label="Platform (e.g. Google)" value={data.rating.platform} onChange={(v) => mutate((d) => ({ ...d, rating: { ...d.rating, platform: v } }))} max={30} />
              </div>
            </Card>

            <Card title="Reviews">
              <div className="space-y-4">
                {data.reviews.map((rev, i) => (
                  <div key={i} className="border border-line bg-cream/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Review {i + 1}</span>
                      <RowControls
                        index={i}
                        count={data.reviews.length}
                        onMove={(to) => mutate((d) => ({ ...d, reviews: moveItem(d.reviews, i, to) }))}
                        onRemove={() => mutate((d) => ({ ...d, reviews: d.reviews.filter((_, idx) => idx !== i) }))}
                        removeTitle="Remove review"
                      />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Field label="Name" value={rev.name} onChange={(v) => setReview(i, { ...rev, name: v })} max={70} />
                      <Field label="Role / company" value={rev.role ?? ""} onChange={(v) => setReview(i, { ...rev, role: v })} max={70} />
                      <Field label="Date" value={rev.date} onChange={(v) => setReview(i, { ...rev, date: v })} max={40} hint="e.g. 2 weeks ago" />
                      <Field label="Initials (fallback avatar)" value={rev.initials} onChange={(v) => setReview(i, { ...rev, initials: v.toUpperCase().slice(0, 3) })} max={3} />
                    </div>
                    <div className="mt-3">
                      <span className={labelClass}>Rating</span>
                      <StarSelect value={rev.rating} onChange={(v) => setReview(i, { ...rev, rating: v })} />
                    </div>
                    <div className="mt-3">
                      <ImageField label="Reviewer photo (optional)" dir="reviews" round value={rev.image ?? ""} onChange={(path) => setReview(i, { ...rev, image: path })} />
                    </div>
                    <div className="mt-3">
                      <Field label="Quote" value={rev.quote} onChange={(v) => setReview(i, { ...rev, quote: v })} role="quote" multiline />
                    </div>
                  </div>
                ))}
              </div>
              <AddButton
                label="Add review"
                onClick={() => mutate((d) => ({ ...d, reviews: [...d.reviews, { name: "", role: "", date: "", quote: "", rating: 5, image: "", initials: "" }] }))}
              />
            </Card>

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
