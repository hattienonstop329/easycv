'use client';

import { useMemo, useState } from 'react';
import { useResume } from '@/lib/store';
import { lintResume, lintScore, readingLevel, WritingIssue } from '@/lib/writing-checks';
import { useAIKey } from '@/lib/ai-store';
import { useOpenAIDialog } from '@/lib/ui-store';
import { useToasts } from '@/lib/toast-store';
import { rewriteSummary } from '@/lib/ai';

const KIND_COLOR: Record<WritingIssue['kind'], string> = {
  'weak-verb': 'bg-strawberry/15 border-strawberry/30 text-cocoa',
  cliche: 'bg-strawberry/15 border-strawberry/30 text-cocoa',
  'long-bullet': 'bg-stone/30 border-stone/50 text-cocoa',
  'starts-with-i': 'bg-cream2 border-cocoa/15 text-cocoa',
  'no-quantification': 'bg-cream2 border-cocoa/15 text-cocoa',
  'first-person': 'bg-cream2 border-cocoa/15 text-cocoa',
  'tense-mix': 'bg-strawberry/15 border-strawberry/30 text-cocoa',
};

const KIND_LABEL: Record<WritingIssue['kind'], string> = {
  'weak-verb': 'weak verb',
  cliche: 'cliché',
  'long-bullet': 'too long',
  'starts-with-i': 'first person',
  'no-quantification': 'add numbers',
  'first-person': 'first person',
  'tense-mix': 'mixed tense',
};

export function PolishPanel() {
  const data = useResume((s) => s.data);
  const updateProfile = useResume((s) => s.updateProfile);
  const apiKey = useAIKey((s) => s.apiKey);
  const openAIDialog = useOpenAIDialog();
  const push = useToasts((s) => s.push);
  const [aiRunning, setAiRunning] = useState(false);
  const issues = useMemo(() => lintResume(data), [data]);
  const score = lintScore(issues);

  const aiSummary = async () => {
    if (!apiKey) {
      openAIDialog();
      return;
    }
    if (!data.profile.summary.trim()) {
      push('write a draft summary first — ai sharpens what you have');
      return;
    }
    setAiRunning(true);
    try {
      const next = await rewriteSummary(data.profile.summary, data.profile.title);
      updateProfile({ summary: next });
      push('summary rewritten with ai ✦', { tone: 'praise' });
    } catch (err) {
      push(err instanceof Error ? `ai rewrite failed: ${err.message}` : 'ai rewrite failed');
    } finally {
      setAiRunning(false);
    }
  };
  const reading = useMemo(() => {
    const corpus = [
      data.profile.summary,
      ...data.experience.flatMap((e) => e.bullets),
      ...data.projects.map((p) => p.description),
      ...data.awards.map((a) => a.description),
    ]
      .filter(Boolean)
      .join(' ');
    return readingLevel(corpus);
  }, [data]);

  const grouped: Record<WritingIssue['location']['panel'], WritingIssue[]> = {
    profile: [],
    experience: [],
    projects: [],
    awards: [],
    education: [],
    letter: [],
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

        {reading && (
          <div className="mt-4 pt-3 border-t border-cocoa/10 flex items-center gap-3">
            <div>
              <div className="font-[family-name:var(--font-serif)] text-2xl text-olive-ink leading-none">
                grade {reading.grade.toFixed(1)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mt-1">
                reading level
              </div>
            </div>
            <div className="flex-1">
              <div
                className={`text-xs italic ${
                  reading.tone === 'easy'
                    ? 'text-matcha-deep'
                    : reading.tone === 'mid'
                      ? 'text-cocoa-soft'
                      : 'text-strawberry-deep'
                }`}
              >
                {reading.label}
              </div>
              <div className="text-[10px] text-cocoa-soft mt-0.5">
                {reading.words} words · {reading.sentences} sentence{reading.sentences === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-paper border border-cocoa/15 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-cocoa-soft">ai rewrite</div>
            <div className="text-sm text-olive-ink mt-0.5">
              {apiKey ? 'rewrite the summary or any bullet using claude.' : 'add an api key to enable real rewrites.'}
            </div>
          </div>
          {apiKey ? (
            <button
              type="button"
              onClick={aiSummary}
              disabled={aiRunning}
              className="bg-strawberry-deep text-paper text-xs px-3 py-1.5 rounded-full font-medium hover:bg-strawberry transition disabled:opacity-60 whitespace-nowrap"
            >
              {aiRunning ? 'rewriting…' : '✨ rewrite summary'}
            </button>
          ) : (
            <button
              type="button"
              onClick={openAIDialog}
              className="bg-olive-ink text-paper text-xs px-3 py-1.5 rounded-full font-medium hover:bg-olive transition whitespace-nowrap"
            >
              add api key
            </button>
          )}
        </div>
        <div className="text-[10px] text-cocoa-soft mt-2 italic">
          your key stays in this browser. only the bullet text is sent to anthropic.
        </div>
      </div>

      {issues.length === 0 && (
        <div className="text-center py-8 text-cocoa-soft text-sm italic">
          your writing reads clean. nothing to polish right now.
        </div>
      )}

      {(['profile', 'experience', 'projects', 'awards', 'letter'] as const).map((panel) => {
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
