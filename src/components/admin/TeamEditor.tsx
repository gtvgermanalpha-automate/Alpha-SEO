"use client";

import type { TeamContent, TeamMember } from "@/lib/team";
import { useObjectEditor, setIn, EditorHeader, StatusBanners, Card, LoadGate } from "@/components/admin/objectEditor";
import { Field, RowControls, AddButton, moveItem } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";

export function TeamEditor() {
  const ed = useObjectEditor<TeamContent>("team");
  const data = ed.data;

  return (
    <div className="pb-16">
      <EditorHeader title="Team page" file="team.json" saving={ed.saving} onSave={ed.save} />
      <StatusBanners saved={ed.saved} saveError={ed.saveError} issues={ed.issues} />
      <LoadGate load={ed.load} loadError={ed.loadError}>
        {data && (
          <>
            <Card title="Heading">
              <Field label="Heading" value={data.heading} role="heading" onChange={(v) => ed.mutate((p) => setIn(p, ["heading"], v))} />
              <Field label="Intro" value={data.intro} role="intro" multiline onChange={(v) => ed.mutate((p) => setIn(p, ["intro"], v))} />
            </Card>

            <Card title="Team members">
              <div className="space-y-4">
                {data.members.map((m, i) => (
                  <MemberRow
                    key={i}
                    member={m}
                    index={i}
                    count={data.members.length}
                    onField={(field, value) => ed.mutate((p) => setIn(p, ["members", i, field], value))}
                    onRemove={() => ed.mutate((p) => ({ ...p, members: p.members.filter((_, j) => j !== i) }))}
                    onMove={(to) => ed.mutate((p) => ({ ...p, members: moveItem(p.members, i, to) }))}
                  />
                ))}
              </div>
              <AddButton
                label="Add member"
                onClick={() =>
                  ed.mutate((p) => ({
                    ...p,
                    members: [...p.members, { name: "", role: "", image: "", imageAlt: "", bio: "" }],
                  }))
                }
              />
            </Card>
          </>
        )}
      </LoadGate>
    </div>
  );
}

function MemberRow({
  member,
  index,
  count,
  onField,
  onRemove,
  onMove,
}: {
  member: TeamMember;
  index: number;
  count: number;
  onField: (field: keyof TeamMember, value: string) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
}) {
  return (
    <div className="border border-line bg-cream/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">Member {index + 1}</span>
        <RowControls index={index} count={count} onMove={onMove} onRemove={onRemove} removeTitle="Remove member" />
      </div>
      <div className="mt-3 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={member.name} role="name" onChange={(v) => onField("name", v)} />
          <Field label="Role" value={member.role} role="role" onChange={(v) => onField("role", v)} />
        </div>
        <ImageField label="Photo" dir="team" round value={member.image ?? ""} onChange={(path) => onField("image", path)} />
        <Field label="Photo alt text" value={member.imageAlt ?? ""} role="imageAlt" onChange={(v) => onField("imageAlt", v)} />
        <Field label="Bio" value={member.bio} role="bio" multiline onChange={(v) => onField("bio", v)} />
      </div>
    </div>
  );
}
