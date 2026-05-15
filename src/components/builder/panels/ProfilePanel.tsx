'use client';

import { useResume } from '@/lib/store';
import { FieldRow, Input, Textarea } from '../controls/Field';

export function ProfilePanel() {
  const profile = useResume((s) => s.data.profile);
  const updateProfile = useResume((s) => s.updateProfile);
  return (
    <div className="space-y-3">
      <FieldRow label="full name">
        <Input
          value={profile.fullName}
          onChange={(e) => updateProfile({ fullName: e.target.value })}
          placeholder="Aria Hollis"
        />
      </FieldRow>
      <FieldRow label="headline / title">
        <Input
          value={profile.title}
          onChange={(e) => updateProfile({ title: e.target.value })}
          placeholder="Product Designer · Hand-letterer"
        />
      </FieldRow>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="email">
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
            placeholder="hi@you.com"
          />
        </FieldRow>
        <FieldRow label="phone">
          <Input
            value={profile.phone}
            onChange={(e) => updateProfile({ phone: e.target.value })}
            placeholder="+1 …"
          />
        </FieldRow>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="location">
          <Input
            value={profile.location}
            onChange={(e) => updateProfile({ location: e.target.value })}
            placeholder="Brooklyn, NY"
          />
        </FieldRow>
        <FieldRow label="website">
          <Input
            value={profile.website}
            onChange={(e) => updateProfile({ website: e.target.value })}
            placeholder="you.studio"
          />
        </FieldRow>
      </div>
      <FieldRow label="about you">
        <Textarea
          value={profile.summary}
          onChange={(e) => updateProfile({ summary: e.target.value })}
          placeholder="A short note in your voice — two or three sentences."
        />
      </FieldRow>
    </div>
  );
}
