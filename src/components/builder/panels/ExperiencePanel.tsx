'use client';

import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { useUI } from '@/lib/ui-store';
import { AddButton, FieldRow, Input, ItemCard, Textarea } from '../controls/Field';
import { SortableList, SortableItem, DragHandle } from '../controls/Sortable';
import { MonthInput } from '../controls/MonthInput';
import { EmptyState } from '../controls/EmptyState';
import { wordCount } from '@/lib/writing-checks';
import { ExperienceItem } from '@/lib/types';

export function ExperiencePanel() {
  const items = useResume((s) => s.data.experience);
  const add = useResume((s) => s.addExperience);
  const remove = useResume((s) => s.removeExperience);
  const update = useResume((s) => s.updateExperience);
  const reorder = useResume((s) => s.reorderExperience);

  if (items.length === 0) {
    return (
      <EmptyState
        title="add your first job"
        body="lead with your most recent role. each job gets a few short bullet points — what you shipped and why it mattered."
        actionLabel="add a job"
        onAction={add}
      />
    );
  }

  return (
    <div>
      <SortableList items={items} onReorder={reorder}>
        {(item) => (
          <SortableItem id={item.id}>
            {({ listeners }) => (
              <ItemCard
                onRemove={() => remove(item.id)}
                dragHandle={<DragHandle listeners={listeners} />}
              >
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="role">
                    <Input
                      value={item.role}
                      onChange={(e) => update(item.id, { role: e.target.value })}
                      placeholder="Senior Designer"
                    />
                  </FieldRow>
                  <FieldRow label="company">
                    <Input
                      value={item.company}
                      onChange={(e) => update(item.id, { company: e.target.value })}
                      placeholder="Studio Name"
                    />
                  </FieldRow>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <FieldRow label="start">
                    <MonthInput
                      value={item.start}
                      onChange={(v) => update(item.id, { start: v })}
                      placeholder="Jan 2022"
                    />
                  </FieldRow>
                  <FieldRow label="end">
                    <MonthInput
                      value={item.end}
                      onChange={(v) => update(item.id, { end: v })}
                      placeholder="Present"
                      disabled={item.current}
                    />
                  </FieldRow>
                  <FieldRow label="location">
                    <Input
                      value={item.location}
                      onChange={(e) => update(item.id, { location: e.target.value })}
                      placeholder="Remote"
                    />
                  </FieldRow>
                </div>
                <label className="inline-flex items-center gap-2 mt-2 text-sm text-cocoa-soft cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) =>
                      update(item.id, {
                        current: e.target.checked,
                        end: e.target.checked ? '' : item.end,
                      })
                    }
                    className="accent-matcha-deep"
                  />
                  i still work here
                </label>
                <BulletList item={item} update={update} />
              </ItemCard>
            )}
          </SortableItem>
        )}
      </SortableList>
      <AddButton onClick={add} label="add a job" />
    </div>
  );
}

function BulletList({
  item,
  update,
}: {
  item: ExperienceItem;
  update: (eid: string, patch: Partial<ExperienceItem>) => void;
}) {
  const focusTarget = useUI((s) => s.focusTarget);
  const clearFocusTarget = useUI((s) => s.clearFocusTarget);
  const allJobs = useResume((s) => s.data.experience);
  const moveBullet = useResume((s) => s.moveBulletToExperience);
  const otherJobs = allJobs.filter((j) => j.id !== item.id);
  const cardRef = useRef<HTMLDivElement>(null);
  const bulletRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

  useEffect(() => {
    if (!focusTarget) return;
    // exp:<itemId> or exp:<itemId>.bullets.<i>
    const match = focusTarget.match(/^exp:([^.]+)(?:\.bullets\.(\d+))?$/);
    if (!match || match[1] !== item.id) return;
    const bulletIdx = match[2] !== undefined ? parseInt(match[2], 10) : null;
    if (bulletIdx !== null && bulletRefs.current[bulletIdx]) {
      bulletRefs.current[bulletIdx]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      bulletRefs.current[bulletIdx]?.focus();
    } else {
      cardRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    // Clear so it doesn't re-trigger on every render.
    clearFocusTarget();
  }, [focusTarget, item.id, clearFocusTarget]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= item.bullets.length) return;
    const next = [...item.bullets];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    update(item.id, { bullets: next });
  };
  return (
    <div className="mt-3" ref={cardRef}>
      <div className="text-[11px] uppercase tracking-widest text-cocoa-soft mb-1 font-[family-name:var(--font-hand)] text-base normal-case">
        bullets
      </div>
      <div className="space-y-2">
        {item.bullets.map((b, i) => {
          const wc = wordCount(b);
          const tone =
            wc === 0 ? 'text-cocoa-soft/50' : wc > 32 ? 'text-strawberry-deep' : wc > 25 ? 'text-stone2' : 'text-cocoa-soft';
          return (
            <div key={i} className="group">
              <div className="flex gap-2 items-start">
                <span className="text-strawberry-deep mt-2">•</span>
                <Textarea
                  ref={(el) => {
                    bulletRefs.current[i] = el;
                  }}
                  value={b}
                  onChange={(e) => {
                    const next = [...item.bullets];
                    next[i] = e.target.value;
                    update(item.id, { bullets: next });
                  }}
                  placeholder="What did you ship? What changed because of you?"
                  className="min-h-[44px]"
                />
                <div className="flex flex-col items-center gap-0.5 mt-1 opacity-60 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    className="text-cocoa-soft hover:text-olive-ink disabled:opacity-30 text-xs leading-none p-0.5"
                    title="move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === item.bullets.length - 1}
                    className="text-cocoa-soft hover:text-olive-ink disabled:opacity-30 text-xs leading-none p-0.5"
                    title="move down"
                  >
                    ▼
                  </button>
                  {otherJobs.length > 0 && (
                    <MoveToMenu
                      jobs={otherJobs}
                      onPick={(toId) => moveBullet(item.id, i, toId)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const next = item.bullets.filter((_, idx) => idx !== i);
                      update(item.id, { bullets: next.length ? next : [''] });
                    }}
                    className="text-cocoa-soft hover:text-strawberry-deep text-sm leading-none p-0.5"
                    title="remove"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={`text-[10px] mt-0.5 ml-5 ${tone}`}>
                {wc} word{wc === 1 ? '' : 's'}
                {wc > 32 && ' · try splitting'}
                {wc > 25 && wc <= 32 && ' · getting long'}
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => update(item.id, { bullets: [...item.bullets, ''] })}
        className="mt-2 text-sm text-matcha-deep font-[family-name:var(--font-hand)] hover:text-olive-ink"
      >
        + add bullet
      </button>
    </div>
  );
}

function MoveToMenu({
  jobs,
  onPick,
}: {
  jobs: ExperienceItem[];
  onPick: (toId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-cocoa-soft hover:text-olive-ink text-xs leading-none p-0.5"
        title="move bullet to another job"
      >
        ⇄
      </button>
      {open && (
        <div className="absolute right-full top-0 mr-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg z-30 min-w-[180px] py-1">
          <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-cocoa-soft">
            move to
          </div>
          {jobs.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => {
                onPick(j.id);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-1.5 text-xs text-cocoa hover:bg-cream2 truncate"
            >
              {j.role || 'Untitled'} · {j.company || '—'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
