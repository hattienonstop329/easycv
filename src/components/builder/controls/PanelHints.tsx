'use client';

import { useMemo } from 'react';
import { useResume } from '@/lib/store';
import { scoreResume } from '@/lib/completeness';
import { lintResume, type WritingIssue } from '@/lib/writing-checks';
import type { PanelId } from '../shell/PanelSwitcher';

// Maps each panel to which completeness checklist items "live" there.
const ITEMS_BY_PANEL: Partial<Record<PanelId, string[]>> = {
  profile: ['name', 'title', 'email', 'contact', 'summary', 'website'],
  experience: ['experience', 'experience-2', 'dates', 'numbers'],
  education: ['education'],
  skills: ['skills'],
  projects: ['projects-or-awards'],
};

const LINT_PANELS: Partial<Record<PanelId, WritingIssue['location']['panel']>> = {
  profile: 'profile',
  experience: 'experience',
  projects: 'projects',
  awards: 'awards',
  education: 'education',
};

/**
 * Banner shown at the top of editing panels — surfaces the most pressing
 * fix-it-now items for *this* panel: missing fields and writing flags.
 * Renders nothing when there's nothing to nag about.
 */
export function PanelHints({ panel }: { panel: PanelId }) {
  const data = useResume((s) => s.data);

  const { missing, issues } = useMemo(() => {
    const score = scoreResume(data);
    const ids = new Set(ITEMS_BY_PANEL[panel] ?? []);
    const missing = score.checklist.filter((c) => !c.done && ids.has(c.id));
    const lintPanel = LINT_PANELS[panel];
    const issues = lintPanel
      ? lintResume(data).filter((i) => i.location.panel === lintPanel && i.severity === 'warn')
      : [];
    return { missing, issues };
  }, [data, panel]);

  if (missing.length === 0 && issues.length === 0) return null;

  return (
    <div className="mb-4 bg-cream2/70 border border-cocoa/10 rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mb-1.5 flex items-center gap-1.5">
        <span className="text-strawberry-deep">✦</span>
        next moves
      </div>
      <ul className="space-y-1">
        {missing.map((m) => (
          <HintRow key={`m-${m.id}`} kind="missing" label={m.label} hint={m.hint} />
        ))}
        {/* Cap lint issues so the banner doesn't dominate the panel */}
        {issues.slice(0, 3).map((i, idx) => (
          <HintRow
            key={`i-${idx}`}
            kind="polish"
            label={i.message}
            hint={`"${i.location.excerpt}"`}
          />
        ))}
        {issues.length > 3 && (
          <li className="text-[11px] text-cocoa-soft italic pl-4">
            + {issues.length - 3} more — see the polish panel
          </li>
        )}
      </ul>
    </div>
  );
}

function HintRow({
  kind,
  label,
  hint,
}: {
  kind: 'missing' | 'polish';
  label: string;
  hint?: string;
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span
        className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
          kind === 'missing' ? 'bg-strawberry-deep' : 'bg-stone2'
        }`}
        aria-hidden
      />
      <span className="flex-1 min-w-0">
        <span className="text-cocoa">{label}</span>
        {hint && (
          <span className="block text-[11px] text-cocoa-soft italic truncate">{hint}</span>
        )}
      </span>
    </li>
  );
}
