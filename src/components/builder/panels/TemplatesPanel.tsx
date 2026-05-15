'use client';

import { useState } from 'react';
import { useResume } from '@/lib/store';
import { TEMPLATE_REGISTRY } from '@/lib/design-tokens';
import { LetterTemplateId, TemplateCategory, TemplateId } from '@/lib/types';
import { ResumePreview } from '@/components/templates';
import { LETTER_TEMPLATES, LetterPreview } from '@/components/templates/letter';
import type { DocumentMode } from '../shell/PanelSwitcher';

export function TemplatesPanel({ mode = 'resume' }: { mode?: DocumentMode }) {
  return mode === 'letter' ? <LetterTemplates /> : <ResumeTemplates />;
}

function ResumeTemplates() {
  const data = useResume((s) => s.data);
  const setTemplate = useResume((s) => s.setTemplate);
  const [filter, setFilter] = useState<'all' | TemplateCategory>('all');

  const list = TEMPLATE_REGISTRY.filter((t) => filter === 'all' || t.category === filter);

  return (
    <div>
      <div className="mb-4 text-xs text-cocoa-soft leading-relaxed">
        switch templates any time — your data follows you between layouts.
      </div>

      <div className="flex gap-1 mb-4">
        {(['all', 'professional', 'creative'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs transition ${
              filter === f
                ? 'bg-olive-ink text-paper'
                : 'text-cocoa-soft hover:text-olive-ink hover:bg-cream2'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {list.map((t) => {
          const isActive = t.id === data.template;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={`group text-left bg-paper border-2 rounded-xl overflow-hidden transition hover:shadow-md hover:-translate-y-0.5 ${
                isActive ? 'border-olive-ink ring-2 ring-olive-ink/20' : 'border-cocoa/15'
              }`}
            >
              <ResumeThumb id={t.id} />
              <div className="p-2.5 border-t border-cocoa/10">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-sm font-medium text-olive-ink">{t.name}</div>
                  {isActive && <span className="text-[10px] text-matcha-deep">✓ active</span>}
                </div>
                <div className="text-[10px] text-cocoa-soft mt-0.5 leading-tight">{t.tag}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LetterTemplates() {
  const data = useResume((s) => s.data);
  const setTpl = useResume((s) => s.setLetterTemplate);

  return (
    <div>
      <div className="mb-4 text-xs text-cocoa-soft leading-relaxed">
        each letter template pairs with a matching resume look — colors and fonts come from the design panel.
      </div>

      <div className="grid grid-cols-2 gap-3">
        {LETTER_TEMPLATES.map((t) => {
          const isActive = t.id === data.letter.template;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTpl(t.id as LetterTemplateId)}
              className={`group text-left bg-paper border-2 rounded-xl overflow-hidden transition hover:shadow-md hover:-translate-y-0.5 ${
                isActive ? 'border-olive-ink ring-2 ring-olive-ink/20' : 'border-cocoa/15'
              }`}
            >
              <LetterThumb id={t.id as LetterTemplateId} />
              <div className="p-2.5 border-t border-cocoa/10">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-sm font-medium text-olive-ink">
                    {t.name.replace(' Letter', '')}
                  </div>
                  {isActive && <span className="text-[10px] text-matcha-deep">✓ active</span>}
                </div>
                <div className="text-[10px] text-cocoa-soft mt-0.5 leading-tight">{t.tag}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResumeThumb({ id }: { id: TemplateId }) {
  const data = useResume((s) => s.data);
  return (
    <div className="thumb-shell aspect-[4/5]">
      <div className="thumb-page">
        <ResumePreview data={{ ...data, template: id }} />
      </div>
    </div>
  );
}

function LetterThumb({ id }: { id: LetterTemplateId }) {
  const data = useResume((s) => s.data);
  return (
    <div className="thumb-shell aspect-[4/5]">
      <div className="thumb-page">
        <LetterPreview data={{ ...data, letter: { ...data.letter, template: id } }} />
      </div>
    </div>
  );
}
