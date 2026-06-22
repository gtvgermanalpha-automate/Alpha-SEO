"use client";

import type { Office, SiteSettings } from "@/lib/cms/siteSchema";
import { AddButton, Field, moveItem, RowControls, StringList } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { Card, EditorHeader, LoadGate, SaveBtn, StatusBanners, useObjectEditor } from "@/components/admin/objectEditor";

const OFFICE_FIELDS: { key: keyof Office; label: string }[] = [
  { key: "city", label: "City / office name" },
  { key: "addressLine", label: "Address" },
  { key: "postcode", label: "Postcode" },
  { key: "phone", label: "Phone — for call links (e.g. +1 647 365 0782)" },
  { key: "phoneDisplay", label: "Phone — shown on the page (e.g. +1 647 365 0782)" },
];

export function SettingsEditor() {
  const { data, mutate, load, loadError, saving, saved, saveError, issues, save } =
    useObjectEditor<SiteSettings>("settings");

  const setContact = (key: keyof SiteSettings["contact"], value: string) =>
    mutate((d) => ({ ...d, contact: { ...d.contact, [key]: value } }));
  const setSocial = (key: keyof SiteSettings["social"], value: string) =>
    mutate((d) => ({ ...d, social: { ...d.social, [key]: value } }));
  const setOffice = (i: number, next: Office) =>
    mutate((d) => ({ ...d, offices: d.offices.map((o, idx) => (idx === i ? next : o)) }));

  return (
    <div className="pb-16">
      <EditorHeader title="Site & contact details" file="settings.json" saving={saving} onSave={save} />
      <StatusBanners saved={saved} saveError={saveError} issues={issues} />

      <LoadGate load={load} loadError={loadError}>
        {data && (
          <>
            <Card title="Business identity" description="Your firm name, registration and the description search engines show.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" value={data.name} onChange={(v) => mutate((d) => ({ ...d, name: v }))} role="name" />
                <Field label="Short name (logo / abbreviations)" value={data.shortName} onChange={(v) => mutate((d) => ({ ...d, shortName: v }))} role="shortName" />
                <Field label="Website URL" value={data.url} onChange={(v) => mutate((d) => ({ ...d, url: v }))} role="url" hint="https://…" />
              </div>
              <Field label="Description" value={data.description} onChange={(v) => mutate((d) => ({ ...d, description: v }))} role="description" multiline hint="Used for SEO + structured data" />
              <div>
                <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">
                  Pillars (shown beneath the logo)
                </span>
                <StringList
                  items={data.pillars}
                  onChange={(pillars) => mutate((d) => ({ ...d, pillars }))}
                  addLabel="Add pillar"
                  placeholder="e.g. Tax"
                  role="pillars"
                />
              </div>
            </Card>

            <Card
              title="Hero image"
              description="The cut-out photo on the home-page hero. Leave empty to use the built-in default. PNG with a transparent background works best."
            >
              <ImageField
                label="Hero cut-out"
                dir="hero"
                value={data.heroImage}
                onChange={(path) => mutate((d) => ({ ...d, heroImage: path }))}
              />
            </Card>

            <Card
              title="Brand logos"
              description="The logo shown in the header and footer. Leave empty to use the default Alpha logo. A transparent PNG works best — it's auto-trimmed and compressed on upload."
            >
              <ImageField
                label="Header logo"
                dir="brand"
                value={data.logoLinear}
                onChange={(path) => mutate((d) => ({ ...d, logoLinear: path }))}
              />
              <ImageField
                label="Footer logo"
                dir="brand"
                value={data.logoCircular}
                onChange={(path) => mutate((d) => ({ ...d, logoCircular: path }))}
              />
            </Card>

            <Card
              title="Primary contact"
              description="Used in the header, the call buttons and search-engine data. This is your main (Toronto) office."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone — for call links" value={data.contact.phone} onChange={(v) => setContact("phone", v)} role="phone" hint="e.g. +1 647 365 0782" />
                <Field label="Phone — shown on the page" value={data.contact.phoneDisplay} onChange={(v) => setContact("phoneDisplay", v)} role="phoneDisplay" hint="e.g. +1 647 365 0782" />
                <Field label="Email" value={data.contact.email} onChange={(v) => setContact("email", v)} role="email" />
                <Field label="Opening hours" value={data.contact.hours} onChange={(v) => setContact("hours", v)} role="hours" />
                <Field label="Address" value={data.contact.addressLine} onChange={(v) => setContact("addressLine", v)} role="addressLine" />
                <Field label="City" value={data.contact.city} onChange={(v) => setContact("city", v)} role="city" />
                <Field label="Postcode" value={data.contact.postcode} onChange={(v) => setContact("postcode", v)} role="postcode" />
              </div>
            </Card>

            <Card title="Offices" description="Shown in the footer and on the contact page. The first office should match your primary contact above.">
              <div className="space-y-4">
                {data.offices.map((office, i) => (
                  <div key={i} className="border border-line bg-cream/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Office {i + 1}</span>
                      <RowControls
                        index={i}
                        count={data.offices.length}
                        onMove={(to) => mutate((d) => ({ ...d, offices: moveItem(d.offices, i, to) }))}
                        onRemove={() => mutate((d) => ({ ...d, offices: d.offices.filter((_, idx) => idx !== i) }))}
                        removeTitle="Remove office"
                      />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {OFFICE_FIELDS.map(({ key, label }) => (
                        <Field
                          key={key}
                          label={label}
                          value={office[key]}
                          onChange={(v) => setOffice(i, { ...office, [key]: v })}
                          role={key}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <AddButton
                label="Add office"
                onClick={() =>
                  mutate((d) => ({
                    ...d,
                    offices: [...d.offices, { city: "", addressLine: "", postcode: "", phone: "", phoneDisplay: "" }],
                  }))
                }
              />
            </Card>

            <Card title="Social links" description="Used by the social icons in the header, footer and side rail.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="LinkedIn URL" value={data.social.linkedin} onChange={(v) => setSocial("linkedin", v)} role="linkedin" hint="https://…" />
                <Field label="Twitter / X URL" value={data.social.twitter} onChange={(v) => setSocial("twitter", v)} role="twitter" hint="https://…" />
                <Field label="Facebook URL" value={data.social.facebook} onChange={(v) => setSocial("facebook", v)} role="facebook" hint="https://…" />
              </div>
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
