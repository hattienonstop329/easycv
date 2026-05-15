'use client';

import { useState } from 'react';
import { useResume } from '@/lib/store';
import { SortableList, SortableItem, DragHandle } from '../controls/Sortable';
import { Section } from '@/lib/types';
import { SECTION_PRESETS } from '@/lib/section-presets';

export function SectionsPanel() {
  const sections = useResume((s) => s.data.sections);
  const customSections = useResume((s) => s.data.customSections);
  const reorder = useResume((s) => s.reorderSections);
  const toggle = useResume((s) => s.toggleSection);
  const rename = useResume((s) => s.renameSection);
  const remove = useResume((s) => s.removeSection);
  const addCustom = useResume((s) => s.addCustomSection);
  const updateBody = useResume((s) => s.updateCustomSectionBody);
  const [presetsOpen, setPresetsOpen] = useState(false);

  return (
    <div>
      <div className="text-xs text-cocoa-soft mb-3 leading-relaxed">
        drag to reorder. tap the dot to hide. rename anything. add a custom section
        for things like volunteering, publications, or interests.
      </div>

      <SortableList items={sections} onReorder={reorder}>
        {(s: Section) => (
          <SortableItem id={s.id}>
            {({ listeners }) => (
              <div
                className={`bg-paper border border-cocoa/15 rounded-xl ${
                  !s.visible ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-2 p-2">
                  <DragHandle listeners={listeners} />
                  <button
                    type="button"
                    onClick={() => toggle(s.id)}
                    className={`w-3 h-3 rounded-full border-2 transition shrink-0 ${
                      s.visible
                        ? 'bg-matcha border-matcha-deep'
                        : 'bg-transparent border-cocoa/30 hover:border-cocoa-soft'
                    }`}
                    title={s.visible ? 'hide' : 'show'}
                  />
                  <input
                    value={s.title}
                    onChange={(e) => rename(s.id, e.target.value)}
                    className="flex-1 bg-transparent text-sm text-olive-ink focus:outline-none px-2 py-1 min-w-0"
                  />
                  <span className="text-[10px] text-cocoa-soft uppercase tracking-wider shrink-0">
                    {s.type}
                  </span>
                  {s.type === 'custom' && (
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="text-cocoa-soft hover:text-strawberry-deep px-1 text-base shrink-0 leading-none"
                      title="delete this section"
                    >
                      ×
                    </button>
                  )}
                </div>

                {s.type === 'custom' && (
                  <div className="px-2 pb-2 pt-0">
                    <textarea
                      value={customSections[s.id]?.body ?? ''}
                      onChange={(e) => updateBody(s.id, e.target.value)}
                      placeholder="Write anything you want here — publications, volunteering, hobbies. Plain text or short paragraphs."
                      className="w-full bg-cream/40 border border-cocoa/10 rounded-lg px-3 py-2 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition placeholder:text-cocoa-soft/60 resize-y min-h-[70px]"
                    />
                  </div>
                )}
              </div>
            )}
          </SortableItem>
        )}
      </SortableList>

      <div className="mt-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => addCustom('Custom')}
            className="border-2 border-dashed border-cocoa/25 rounded-xl py-2.5 text-sm text-cocoa-soft hover:border-matcha hover:text-matcha-deep hover:bg-matcha/5 transition font-[family-name:var(--font-hand)] text-lg"
          >
            + blank
          </button>
          <button
            type="button"
            onClick={() => setPresetsOpen((o) => !o)}
            className={`border-2 border-dashed rounded-xl py-2.5 text-sm transition font-[family-name:var(--font-hand)] text-lg ${
              presetsOpen
                ? 'border-strawberry-deep text-strawberry-deep bg-strawberry/5'
                : 'border-cocoa/25 text-cocoa-soft hover:border-strawberry-deep hover:text-strawberry-deep hover:bg-strawberry/5'
            }`}
          >
            {presetsOpen ? '× hide presets' : '✦ from preset'}
          </button>
        </div>

        {presetsOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTION_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  addCustom(p.title, p.body);
                  setPresetsOpen(false);
                }}
                className="text-left bg-paper border border-cocoa/15 rounded-xl p-3 hover:border-strawberry-deep hover:shadow-sm hover:-translate-y-0.5 transition group"
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="text-strawberry-deep">{p.icon}</span>
                  <div className="text-sm font-medium text-olive-ink">{p.title}</div>
                </div>
                <div className="text-[11px] text-cocoa-soft italic mt-0.5">{p.hint}</div>
                <div className="text-[10px] text-cocoa-soft mt-1.5 line-clamp-2 leading-snug opacity-70 group-hover:opacity-100">
                  {p.body.replace(/\*\*/g, '').slice(0, 90)}…
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
