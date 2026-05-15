'use client';

import { useResume } from '@/lib/store';

type SectionKind =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards';

export function ResetSectionLink({ section, label }: { section: SectionKind; label: string }) {
  const reset = useResume((s) => s.resetSection);
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm(`Clear all ${label}? You can restore from history if you change your mind.`)) {
          reset(section);
        }
      }}
      className="text-[11px] text-cocoa-soft hover:text-strawberry-deep transition"
      title="clear this section (a snapshot is saved first)"
    >
      reset section
    </button>
  );
}
