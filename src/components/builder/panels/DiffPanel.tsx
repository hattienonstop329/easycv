'use client';

import { useMemo, useState } from 'react';
import { useResume } from '@/lib/store';
import { diffResumes, type FieldChange, type ItemDiff, type ResumeDiff } from '@/lib/resume-diff';
import { diffWords } from '@/lib/word-diff';
import type { ResumeData } from '@/lib/types';

const KIND_COLOR: Record<ItemDiff['kind'], string> = {
  added: 'bg-matcha/20 border-matcha/40',
  removed: 'bg-strawberry/15 border-strawberry/30',
  changed: 'bg-cream2 border-cocoa/15',
};

const KIND_LABEL: Record<ItemDiff['kind'], string> = {
  added: '+ added',
  removed: '− removed',
  changed: '~ changed',
};

const KIND_TEXT: Record<ItemDiff['kind'], string> = {
  added: 'text-matcha-deep',
  removed: 'text-strawberry-deep',
  changed: 'text-cocoa',
};

export function DiffPanel() {
  const data = useResume((s) => s.data);
  const versions = useResume((s) => s.versions);
  const versionsData = useResume((s) => s.versionsData);
  const activeId = useResume((s) => s.activeId);

  // Build the available pool: every version, with the active one's data coming from `data`.
  const pool: { id: string; name: string; data: ResumeData }[] = useMemo(
    () =>
      versions.map((v) => ({
        id: v.id,
        name: v.name + (v.id === activeId ? ' (current)' : ''),
        data: v.id === activeId ? data : versionsData[v.id] ?? data,
      })),
    [versions, versionsData, activeId, data],
  );

  const [aId, setAId] = useState<string>(() => pool[0]?.id ?? '');
  const [bId, setBId] = useState<string>(() => pool[1]?.id ?? pool[0]?.id ?? '');

  const a = pool.find((p) => p.id === aId);
  const b = pool.find((p) => p.id === bId);

  const diff = useMemo<ResumeDiff | null>(() => {
    if (!a || !b) return null;
    return diffResumes(a.data, b.data);
  }, [a, b]);

  if (pool.length < 2) {
    return (
      <div className="text-sm text-cocoa-soft">
        <p className="mb-3">save a second version to start comparing.</p>
        <p className="italic text-[12px]">
          tip: use the version picker in the toolbar to "save as new version" — perfect for keeping
          a "designer cut" alongside an "engineering cut" of your resume.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs text-cocoa-soft mb-3 leading-relaxed">
        compare two saved versions side-by-side. shows what was added, removed, or changed —
        nothing is sent anywhere.
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-cocoa-soft mb-1">
            from
          </label>
          <select
            value={aId}
            onChange={(e) => setAId(e.target.value)}
            className="w-full bg-paper border border-cocoa/15 rounded-xl px-3 py-2 text-sm text-olive-ink"
          >
            {pool.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-cocoa-soft mb-1">
            to
          </label>
          <select
            value={bId}
            onChange={(e) => setBId(e.target.value)}
            className="w-full bg-paper border border-cocoa/15 rounded-xl px-3 py-2 text-sm text-olive-ink"
          >
            {pool.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {aId === bId ? (
        <div className="text-center py-8 text-cocoa-soft text-sm italic">
          comparing a version to itself — pick two different versions.
        </div>
      ) : !diff ? null : (
        <DiffView diff={diff} />
      )}
    </div>
  );
}

function DiffView({ diff }: { diff: ResumeDiff }) {
  const totalChanges =
    diff.profile.length +
    (diff.template ? 1 : 0) +
    diff.experience.length +
    diff.education.length +
    diff.projects.length +
    diff.skills.length;

  if (totalChanges === 0) {
    return (
      <div className="text-center py-8 text-cocoa-soft text-sm italic">
        these two versions are identical ✦
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-paper border border-cocoa/15 rounded-2xl p-4 flex gap-4 text-sm">
        <Stat color="text-matcha-deep" label="added" n={diff.summary.added} />
        <Stat color="text-strawberry-deep" label="removed" n={diff.summary.removed} />
        <Stat color="text-cocoa" label="changed" n={diff.summary.changed} />
      </div>

      {diff.template && (
        <Section title="template">
          <FieldChangeRow change={diff.template} />
        </Section>
      )}

      {diff.profile.length > 0 && (
        <Section title="profile">
          {diff.profile.map((c) => (
            <FieldChangeRow key={c.field} change={c} />
          ))}
        </Section>
      )}

      {diff.experience.length > 0 && (
        <Section title="experience">
          {diff.experience.map((it) => (
            <ItemDiffCard key={it.id} item={it} />
          ))}
        </Section>
      )}
      {diff.projects.length > 0 && (
        <Section title="projects">
          {diff.projects.map((it) => (
            <ItemDiffCard key={it.id} item={it} />
          ))}
        </Section>
      )}
      {diff.education.length > 0 && (
        <Section title="education">
          {diff.education.map((it) => (
            <ItemDiffCard key={it.id} item={it} />
          ))}
        </Section>
      )}
      {diff.skills.length > 0 && (
        <Section title="skills">
          {diff.skills.map((it) => (
            <ItemDiffCard key={it.id} item={it} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Stat({ label, n, color }: { label: string; n: number; color: string }) {
  return (
    <div>
      <div className={`font-[family-name:var(--font-serif)] text-3xl leading-none ${color}`}>{n}</div>
      <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mt-1">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="font-[family-name:var(--font-hand)] text-xl text-olive-ink mb-2 capitalize">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function FieldChangeRow({ change }: { change: FieldChange }) {
  const both = !!change.before && !!change.after;
  return (
    <div className="bg-cream2 border border-cocoa/15 rounded-xl p-3 text-sm">
      <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mb-1">
        {change.field}
      </div>
      {both ? (
        <div className="bg-paper border-l-2 border-cocoa/30 pl-2 py-0.5 text-cocoa">
          <InlineWordDiff before={change.before} after={change.after} />
        </div>
      ) : (
        <div className="space-y-1">
          {change.before && (
            <div className="bg-strawberry/10 text-cocoa border-l-2 border-strawberry-deep pl-2 py-0.5 line-through decoration-strawberry-deep/40">
              {change.before}
            </div>
          )}
          {change.after && (
            <div className="bg-matcha/15 text-olive-ink border-l-2 border-matcha-deep pl-2 py-0.5">
              {change.after}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InlineWordDiff({ before, after }: { before: string; after: string }) {
  const parts = diffWords(before, after);
  return (
    <span>
      {parts.map((p, i) => {
        if (p.kind === 'same') return <span key={i}>{p.text}</span>;
        if (p.kind === 'add')
          return (
            <span key={i} className="bg-matcha/30 text-olive-ink rounded px-0.5">
              {p.text}
            </span>
          );
        return (
          <span key={i} className="bg-strawberry/25 text-cocoa rounded px-0.5 line-through decoration-strawberry-deep/60">
            {p.text}
          </span>
        );
      })}
    </span>
  );
}

function ItemDiffCard({ item }: { item: ItemDiff }) {
  return (
    <div className={`border rounded-xl p-3 ${KIND_COLOR[item.kind]}`}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <div>
          <div className="font-medium text-cocoa text-sm">{item.title}</div>
          {item.subtitle && (
            <div className="text-[11px] text-cocoa-soft">{item.subtitle}</div>
          )}
        </div>
        <span className={`text-[10px] uppercase tracking-widest ${KIND_TEXT[item.kind]}`}>
          {KIND_LABEL[item.kind]}
        </span>
      </div>
      {item.fieldChanges && item.fieldChanges.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {item.fieldChanges.map((fc) => (
            <div key={fc.field} className="text-xs">
              <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mb-0.5">
                {fc.field}
              </div>
              {fc.before && (
                <div className="text-cocoa-soft line-through decoration-strawberry-deep/40">{fc.before}</div>
              )}
              {fc.after && <div className="text-olive-ink">{fc.after}</div>}
            </div>
          ))}
        </div>
      )}
      {item.bullets && item.bullets.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-cocoa-soft">bullets</div>
          {item.bullets.map((bd, i) => (
            <div key={i} className="text-xs">
              {bd.kind === 'added' && (
                <div className="bg-matcha/15 text-olive-ink border-l-2 border-matcha-deep pl-2 py-0.5">
                  + {bd.after}
                </div>
              )}
              {bd.kind === 'removed' && (
                <div className="bg-strawberry/10 text-cocoa border-l-2 border-strawberry-deep pl-2 py-0.5 line-through decoration-strawberry-deep/40">
                  − {bd.before}
                </div>
              )}
              {bd.kind === 'changed' && (
                <div className="bg-cream2/50 border-l-2 border-cocoa/30 pl-2 py-0.5 text-cocoa">
                  <InlineWordDiff before={bd.before ?? ''} after={bd.after ?? ''} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
