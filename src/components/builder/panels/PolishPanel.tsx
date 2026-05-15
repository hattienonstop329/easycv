'use client';

import { useMemo } from 'react';
import { useResume } from '@/lib/store';
import { lintResume, lintScore, WritingIssue } from '@/lib/writing-checks';

const KIND_COLOR: Record<WritingIssue['kind'], string> = {
  'weak-verb': 'bg-strawberry/15 border-strawberry/30 text-cocoa',
  cliche: 'bg-strawberry/15 border-strawberry/30 text-cocoa',
  'long-bullet': 'bg-stone/30 border-stone/50 text-cocoa',
  'starts-with-i': 'bg-cream2 border-cocoa/15 text-cocoa',
  'no-quantification': 'bg-cream2 border-cocoa/15 text-cocoa',
  'first-person': 'bg-cream2 border-cocoa/15 text-cocoa',
};

const KIND_LABEL: Record<WritingIssue['kind'], string> = {
  'weak-verb': 'weak verb',
  cliche: 'cliché',
  'long-bullet': 'too long',
  'starts-with-i': 'first person',
  'no-quantification': 'add numbers',
  'first-person': 'first person',
};

export function PolishPanel() {
  const data = useResume((s) => s.data);
  const issues = useMemo(() => lintResume(data), [data]);
  const score = lintScore(issues);

  const grouped: Record<WritingIssue['location']['panel'], WritingIssue[]> = {
    profile: [],
    experience: [],
    projects: [],
    awards: [],
    education: [],
  };
  for (const i of issues) grouped[i.location.panel].push(i);

  return (
    <div>
      <div className="text-xs text-cocoa-soft mb-3 leading-relaxed">
        we scan your text for weak verbs, clichés, and bullets that could be tighter.
        all checks run in your browser — nothing is sent anywhere.
      </div>

      <div className="bg-paper border border-cocoa/15 rounded-2xl p-4 mb-5">
        <div className="flex items-end gap-3">
          <div>
            <div className="font-[family-name:var(--font-serif)] text-5xl text-olive-ink leading-none font-light">
              {score}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mt-1">
              polish score
            </div>
          </div>
          <div className="flex-1">
            <div className="h-2 bg-cream2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-[width] duration-500 ${
                  score >= 90
                    ? 'bg-matcha-deep'
                    : score >= 70
                      ? 'bg-matcha'
                      : score >= 50
                        ? 'bg-stone2'
                        : 'bg-strawberry-deep'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="text-xs text-cocoa-soft mt-2">
              {issues.length === 0
                ? 'looking sharp ✦ no issues found.'
                : `${issues.length} suggestion${issues.length === 1 ? '' : 's'} below`}
            </div>
          </div>
        </div>
      </div>

      {issues.length === 0 && (
        <div className="text-center py-8 text-cocoa-soft text-sm italic">
          your writing reads clean. nothing to polish right now.
        </div>
      )}

      {(['profile', 'experience', 'projects', 'awards'] as const).map((panel) => {
        const list = grouped[panel];
        if (list.length === 0) return null;
        return (
          <section key={panel} className="mb-6">
            <div className="font-[family-name:var(--font-hand)] text-xl text-olive-ink mb-2 capitalize">
              {panel}
            </div>
            <div className="space-y-2">
              {list.map((issue, i) => (
                <IssueCard key={`${panel}-${i}`} issue={issue} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function IssueCard({ issue }: { issue: WritingIssue }) {
  return (
    <div className={`border rounded-xl p-3 ${KIND_COLOR[issue.kind]}`}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-cocoa-soft">
          {KIND_LABEL[issue.kind]}
        </span>
        {issue.location.bulletIndex !== undefined && (
          <span className="text-[10px] text-cocoa-soft">bullet #{issue.location.bulletIndex + 1}</span>
        )}
      </div>
      <div className="text-sm text-olive-ink">{issue.message}</div>
      <div className="mt-1.5 text-xs text-cocoa-soft italic line-clamp-2">
        “{issue.location.excerpt}”
      </div>
      {issue.suggestion && issue.suggestion.length > 0 && (
        <div className="mt-2 text-xs text-cocoa-soft">
          {issue.kind === 'cliche' || issue.kind === 'no-quantification' ? (
            issue.suggestion[0]
          ) : (
            <>
              try:{' '}
              {issue.suggestion.map((s, i) => (
                <span key={s}>
                  {i > 0 && ', '}
                  <span className="text-matcha-deep font-medium">{s}</span>
                </span>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
