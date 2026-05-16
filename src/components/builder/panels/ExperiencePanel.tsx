'use client';

import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { useUI } from '@/lib/ui-store';
import { AddButton, FieldRow, Input, ItemCard, Textarea } from '../controls/Field';
import { SortableList, SortableItem, DragHandle } from '../controls/Sortable';
import { MonthInput } from '../controls/MonthInput';
import { EmptyState } from '../controls/EmptyState';
import { wordCount, polishBullet } from '@/lib/writing-checks';
import { useToasts } from '@/lib/toast-store';
import { useAIKey } from '@/lib/ai-store';
import { useOpenAIDialog } from '@/lib/ui-store';
import { rewriteBullet } from '@/lib/ai';
import { ExperienceItem } from '@/lib/types';
import { PanelHints } from '../controls/PanelHints';
import { ItemAdvanced } from '../controls/ItemAdvanced';
import { SectionFormatDisclosure } from '../controls/SectionFormatDisclosure';
import { uid } from '@/lib/uid';

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
      <PanelHints panel="experience" />
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
                <ItemAdvanced
                  value={item.overrides}
                  onChange={(o) => update(item.id, { overrides: o })}
                />
              </ItemCard>
            )}
          </SortableItem>
        )}
      </SortableList>
      <AddButton onClick={add} label="add a job" />
      <SectionFormatDisclosure sectionType="experience" supportsBullets />
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
  const pushToast = useToasts((s) => s.push);
  const apiKey = useAIKey((s) => s.apiKey);
  const openAIDialog = useOpenAIDialog();
  const [aiRunningIdx, setAiRunningIdx] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bulletRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  // Stable per-bullet keys so reorder/delete don't relocate textarea focus.
  // Kept in lockstep with `item.bullets` via the wrapped mutations below; the
  // length-change branch below realigns after external mutations (e.g.
  // cross-job bullet moves) using the "derived state from props" pattern.
  const [bulletKeys, setBulletKeys] = useState<string[]>(() => item.bullets.map(() => uid()));
  const [trackedLen, setTrackedLen] = useState(item.bullets.length);
  if (trackedLen !== item.bullets.length) {
    setTrackedLen(item.bullets.length);
    setBulletKeys((prev) => {
      const next: string[] = [];
      for (let i = 0; i < item.bullets.length; i++) {
        next.push(prev[i] ?? uid());
      }
      return next;
    });
  }

  const aiRewrite = async (i: number) => {
    if (!apiKey) {
      openAIDialog();
      return;
    }
    const original = item.bullets[i] ?? '';
    if (!original.trim()) {
      pushToast('this bullet is empty — write something first');
      return;
    }
    setAiRunningIdx(i);
    try {
      const ctx = [item.role, item.company].filter(Boolean).join(' at ');
      const result = await rewriteBullet(original, ctx);
      const next = [...item.bullets];
      next[i] = result;
      update(item.id, { bullets: next });
      pushToast('rewritten with ai ✦', { tone: 'praise' });
    } catch (err) {
      pushToast(err instanceof Error ? `ai rewrite failed: ${err.message}` : 'ai rewrite failed');
    } finally {
      setAiRunningIdx(null);
    }
  };

  const setBulletText = (i: number, value: string) => {
    const next = [...item.bullets];
    next[i] = value;
    update(item.id, { bullets: next });
  };

  const polish = (i: number) => {
    const original = item.bullets[i] ?? '';
    if (!original.trim()) {
      pushToast('this bullet is empty — write something first');
      return;
    }
    const { result, changes } = polishBullet(original);
    if (result === original || changes.length === 0) {
      pushToast('this bullet is already pretty tight ✦');
      return;
    }
    const next = [...item.bullets];
    next[i] = result;
    update(item.id, { bullets: next });
    pushToast(`polished — ${changes.length} change${changes.length === 1 ? '' : 's'}`, { tone: 'praise' });
  };

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
    setBulletKeys((prev) => {
      const k = [...prev];
      const [r] = k.splice(from, 1);
      k.splice(to, 0, r);
      return k;
    });
  };

  const removeBullet = (i: number) => {
    const nextBullets = item.bullets.filter((_, idx) => idx !== i);
    update(item.id, { bullets: nextBullets.length ? nextBullets : [''] });
    setBulletKeys((prev) =>
      nextBullets.length ? prev.filter((_, idx) => idx !== i) : [uid()],
    );
  };

  const addBullet = () => {
    update(item.id, { bullets: [...item.bullets, ''] });
    setBulletKeys((prev) => [...prev, uid()]);
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
            <div key={bulletKeys[i] ?? i} className="group">
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
                    onClick={() => polish(i)}
                    className="text-matcha-deep hover:text-olive-ink text-sm leading-none p-0.5"
                    title="polish this bullet — strip filler, capitalize, add a number placeholder"
                  >
                    ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => aiRewrite(i)}
                    disabled={aiRunningIdx === i}
                    className="text-strawberry-deep hover:text-olive-ink text-[11px] leading-none p-0.5 disabled:opacity-50"
                    title={
                      apiKey
                        ? 'rewrite this bullet with claude (uses your api key)'
                        : 'add an api key to enable ai rewrites'
                    }
                  >
                    {aiRunningIdx === i ? '⋯' : 'ai'}
                  </button>
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
                  <DirectivesMenu
                    text={b}
                    setText={(v) => setBulletText(i, v)}
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(i)}
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
        onClick={addBullet}
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

function DirectivesMenu({
  text,
  setText,
}: {
  text: string;
  setText: (next: string) => void;
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

  const indented = /^\[indent\]/i.test(text);
  const kept = /\[keep\]/i.test(text) && /\[\/keep\]/i.test(text);

  const insertBreak = () => {
    setText(text + (text.endsWith(' ') ? '' : ' ') + '[br]');
    setOpen(false);
  };
  const toggleIndent = () => {
    setText(indented ? text.replace(/^\[indent\]/i, '') : `[indent]${text}`);
    setOpen(false);
  };
  const toggleKeep = () => {
    if (kept) {
      setText(text.replace(/\[keep\]/gi, '').replace(/\[\/keep\]/gi, ''));
    } else {
      setText(`[keep]${text}[/keep]`);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-cocoa-soft hover:text-olive-ink text-xs leading-none p-0.5"
        title="formatting directives"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-full top-0 mr-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg z-30 min-w-[200px] py-1">
          <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-cocoa-soft">
            insert
          </div>
          <MenuRow onClick={insertBreak} hint="forces a line break here">
            ↵ line break <code className="text-[10px] text-cocoa-soft ml-1">[br]</code>
          </MenuRow>
          <MenuRow onClick={toggleIndent} active={indented} hint="extra left padding for this line">
            → indent
          </MenuRow>
          <MenuRow onClick={toggleKeep} active={kept} hint="don't split this bullet across pages">
            ◇ keep on one page
          </MenuRow>
        </div>
      )}
    </div>
  );
}

function MenuRow({
  children,
  onClick,
  active,
  hint,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-cream2 ${
        active ? 'text-olive-ink font-medium' : 'text-cocoa'
      }`}
    >
      <div>{children}{active && <span className="text-matcha-deep ml-1">·on</span>}</div>
      {hint && <div className="text-[10px] text-cocoa-soft italic">{hint}</div>}
    </button>
  );
}
