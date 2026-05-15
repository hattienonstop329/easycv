'use client';

import { useResume } from '@/lib/store';
import { AddButton, FieldRow, Input, ItemCard, Textarea } from '../controls/Field';
import { EmptyState } from '../controls/EmptyState';
import { ItemAdvanced } from '../controls/ItemAdvanced';
import { SectionFormatDisclosure } from '../controls/SectionFormatDisclosure';

export function CertificationsEditor() {
  const items = useResume((s) => s.data.certifications);
  const add = useResume((s) => s.addCertification);
  const remove = useResume((s) => s.removeCertification);
  const update = useResume((s) => s.updateCertification);

  if (items.length === 0) {
    return (
      <EmptyState
        title="add a certification"
        body="industry credentials, training programs, professional memberships — anything with an issuing body and a date."
        actionLabel="add certification"
        onAction={add}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((c) => (
        <ItemCard key={c.id} onRemove={() => remove(c.id)}>
          <FieldRow label="name">
            <Input value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} placeholder="AWS Certified Cloud Practitioner" />
          </FieldRow>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <FieldRow label="issuer">
              <Input value={c.issuer} onChange={(e) => update(c.id, { issuer: e.target.value })} placeholder="Amazon" />
            </FieldRow>
            <FieldRow label="date">
              <Input value={c.date} onChange={(e) => update(c.id, { date: e.target.value })} placeholder="2024" />
            </FieldRow>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="add certification" />
      <SectionFormatDisclosure sectionType="certifications" />
    </div>
  );
}

export function LanguagesEditor() {
  const items = useResume((s) => s.data.languages);
  const add = useResume((s) => s.addLanguage);
  const remove = useResume((s) => s.removeLanguage);
  const update = useResume((s) => s.updateLanguage);

  if (items.length === 0) {
    return (
      <EmptyState
        title="add a language"
        body="list any languages you can work in. levels like Native, Fluent, Conversational, or Reading are common."
        actionLabel="add language"
        onAction={add}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((l) => (
        <ItemCard key={l.id} onRemove={() => remove(l.id)}>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="language">
              <Input value={l.name} onChange={(e) => update(l.id, { name: e.target.value })} placeholder="English" />
            </FieldRow>
            <FieldRow label="level">
              <Input value={l.level} onChange={(e) => update(l.id, { level: e.target.value })} placeholder="Native" />
            </FieldRow>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="add language" />
      <SectionFormatDisclosure sectionType="languages" />
    </div>
  );
}

export function AwardsEditor() {
  const items = useResume((s) => s.data.awards);
  const add = useResume((s) => s.addAward);
  const remove = useResume((s) => s.removeAward);
  const update = useResume((s) => s.updateAward);

  if (items.length === 0) {
    return (
      <EmptyState
        title="brag a little"
        body="awards, recognitions, hackathon wins, scholarships — things people gave you for doing good work."
        actionLabel="add award"
        onAction={add}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((a) => (
        <ItemCard key={a.id} onRemove={() => remove(a.id)}>
          <FieldRow label="name">
            <Input value={a.name} onChange={(e) => update(a.id, { name: e.target.value })} placeholder="Best in Show" />
          </FieldRow>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <FieldRow label="issuer">
              <Input value={a.issuer} onChange={(e) => update(a.id, { issuer: e.target.value })} placeholder="AIGA" />
            </FieldRow>
            <FieldRow label="date">
              <Input value={a.date} onChange={(e) => update(a.id, { date: e.target.value })} placeholder="2023" />
            </FieldRow>
          </div>
          <FieldRow label="description">
            <Textarea value={a.description} onChange={(e) => update(a.id, { description: e.target.value })} />
          </FieldRow>
          <ItemAdvanced
            value={a.overrides}
            onChange={(o) => update(a.id, { overrides: o })}
          />
        </ItemCard>
      ))}
      <AddButton onClick={add} label="add award" />
      <SectionFormatDisclosure sectionType="awards" />
    </div>
  );
}
