'use client';

import { useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { SkillGroup, SkillItem } from '@/lib/types';
import { AddButton, FieldRow, Input, ItemCard } from '../controls/Field';
import { SortableList, SortableItem, DragHandle } from '../controls/Sortable';
import { EmptyState } from '../controls/EmptyState';
import { ResetSectionLink } from '../controls/ResetSectionLink';
import { focusInsideRef, useFocusOnTarget } from '../controls/useFocusOnTarget';
import { PanelHints } from '../controls/PanelHints';
import { SectionFormatDisclosure } from '../controls/SectionFormatDisclosure';
import { uid } from '@/lib/uid';

export function SkillsPanel() {
  const items = useResume((s) => s.data.skills);
  const add = useResume((s) => s.addSkillGroup);
  const remove = useResume((s) => s.removeSkillGroup);
  const update = useResume((s) => s.updateSkillGroup);
  const reorder = useResume((s) => s.reorderSkillGroups);
  const refs = useRef(new Map<string, HTMLDivElement | null>());

  useFocusOnTarget('skill', (id) => {
    focusInsideRef({ current: refs.current.get(id) ?? null });
  });

  if (items.length === 0) {
    return (
      <EmptyState
        title="group your skills"
        body="organize skills into categories like Languages, Frameworks, or Design — each with its own list. proficiency dots are optional."
        actionLabel="add a skill group"
        onAction={add}
      />
    );
  }

  return (
    <div>
      <PanelHints panel="skills" />
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-xs text-cocoa-soft leading-relaxed">
          proficiency dots are optional — leave them empty to show the skill name only.
        </div>
        <ResetSectionLink section="skills" label="skill groups" />
      </div>

      <SortableList items={items} onReorder={reorder}>
        {(item) => (
          <SortableItem id={item.id}>
            {({ listeners }) => (
              <div ref={(el) => { refs.current.set(item.id, el); }}>
                <ItemCard
                  onRemove={() => remove(item.id)}
                  dragHandle={<DragHandle listeners={listeners} />}
                >
                  <FieldRow label="category">
                    <Input
                      value={item.category}
                      onChange={(e) => update(item.id, { category: e.target.value })}
                      placeholder="Craft"
                    />
                  </FieldRow>

                  <SkillItems group={item} onChange={(items) => update(item.id, { items })} />
                </ItemCard>
              </div>
            )}
          </SortableItem>
        )}
      </SortableList>
      <AddButton onClick={add} label="add a skill group" />
      <SectionFormatDisclosure sectionType="skills" />
    </div>
  );
}

function SkillItems({
  group,
  onChange,
}: {
  group: SkillGroup;
  onChange: (items: SkillItem[]) => void;
}) {
  // SkillItem has no id in the schema, so we maintain parallel client-side
  // keys to keep input focus/IME state stable across add/remove. The
  // length-change branch realigns after external mutations.
  const [keys, setKeys] = useState<string[]>(() => group.items.map(() => uid()));
  const [trackedLen, setTrackedLen] = useState(group.items.length);
  if (trackedLen !== group.items.length) {
    setTrackedLen(group.items.length);
    setKeys((prev) => {
      const next: string[] = [];
      for (let i = 0; i < group.items.length; i++) next.push(prev[i] ?? uid());
      return next;
    });
  }

  const setItem = (idx: number, patch: Partial<SkillItem>) => {
    onChange(group.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeItem = (idx: number) => {
    onChange(group.items.filter((_, i) => i !== idx));
    setKeys((prev) => prev.filter((_, i) => i !== idx));
  };
  const addItem = () => {
    onChange([...group.items, { name: '' }]);
    setKeys((prev) => [...prev, uid()]);
  };

  return (
    <div className="mt-3">
      <div className="text-[11px] uppercase tracking-widest text-cocoa-soft mb-2 font-[family-name:var(--font-hand)] text-base normal-case">
        skills
      </div>
      <div className="space-y-1.5">
        {group.items.length === 0 && (
          <div className="text-xs text-cocoa-soft/60 italic">no skills yet — add one below.</div>
        )}
        {group.items.map((it, i) => (
          <div key={keys[i] ?? i} className="flex items-center gap-2">
            <input
              value={it.name}
              onChange={(e) => setItem(i, { name: e.target.value })}
              placeholder="React"
              className="flex-1 bg-paper border border-cocoa/15 rounded-lg px-2.5 py-1.5 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition placeholder:text-cocoa-soft/60 min-w-0"
            />
            <DotPicker value={it.level} onChange={(level) => setItem(i, { level })} />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-cocoa-soft hover:text-strawberry-deep text-base leading-none px-1 shrink-0"
              title="remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 text-sm text-matcha-deep font-[family-name:var(--font-hand)] hover:text-olive-ink"
      >
        + add skill
      </button>
    </div>
  );
}

function DotPicker({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: 1 | 2 | 3 | 4 | 5 | undefined) => void;
}) {
  return (
    <div
      className="flex items-center gap-0.5 shrink-0"
      title="proficiency (click to set, click again to clear)"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value !== undefined && n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? undefined : (n as 1 | 2 | 3 | 4 | 5))}
            className={`w-3 h-3 rounded-full transition ${
              filled
                ? 'bg-matcha-deep border-2 border-matcha-deep'
                : 'bg-transparent border-2 border-cocoa/25 hover:border-cocoa-soft'
            }`}
            aria-label={`set proficiency to ${n}`}
          />
        );
      })}
    </div>
  );
}
