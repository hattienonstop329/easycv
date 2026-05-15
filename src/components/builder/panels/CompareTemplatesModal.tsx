'use client';

import { useEffect, useState } from 'react';
import { useResume } from '@/lib/store';
import { ResumePreview } from '@/components/templates';
import { TEMPLATE_REGISTRY } from '@/lib/design-tokens';
import { TemplateId } from '@/lib/types';
import { useToasts } from '@/lib/toast-store';

export function CompareTemplatesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const data = useResume((s) => s.data);
  const setTemplate = useResume((s) => s.setTemplate);
  const push = useToasts((s) => s.push);

  // Default sides: A = the active template, B = the next one in the registry.
  const [aId, setAId] = useState<TemplateId>(data.template);
  const [bId, setBId] = useState<TemplateId>(() => {
    const idx = TEMPLATE_REGISTRY.findIndex((t) => t.id === data.template);
    return TEMPLATE_REGISTRY[(idx + 1) % TEMPLATE_REGISTRY.length].id;
  });

  // Keep "A" pinned to whatever is active so users always compare against current.
  useEffect(() => {
    if (open) setAId(data.template);
  }, [open, data.template]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const apply = (id: TemplateId) => {
    setTemplate(id);
    const meta = TEMPLATE_REGISTRY.find((t) => t.id === id);
    push(`switched to ${meta?.name ?? id}`, { tone: 'praise' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-cocoa/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-6xl max-h-[92vh] bg-paper border border-cocoa/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-cocoa/10 flex items-center justify-between gap-3">
          <div>
            <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep -rotate-1 inline-block">
              try them side by side ✦
            </div>
            <div className="font-[family-name:var(--font-serif)] text-xl text-olive-ink leading-tight">
              compare two templates
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-cocoa-soft hover:text-olive-ink text-xl leading-none w-8 h-8 rounded-full hover:bg-cream2"
            aria-label="close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-5 overflow-hidden">
          <CompareSide
            label="A"
            side="left"
            templateId={aId}
            setTemplateId={setAId}
            onApply={apply}
            isActive={aId === data.template}
            data={data}
          />
          <CompareSide
            label="B"
            side="right"
            templateId={bId}
            setTemplateId={setBId}
            onApply={apply}
            isActive={bId === data.template}
            data={data}
          />
        </div>

        <div className="border-t border-cocoa/10 px-5 py-2.5 flex items-center justify-between text-[11px] text-cocoa-soft bg-cream/60">
          <span>both previews use your current data — switching is one click</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}

function CompareSide({
  label,
  templateId,
  setTemplateId,
  onApply,
  isActive,
  data,
}: {
  label: 'A' | 'B';
  side: 'left' | 'right';
  templateId: TemplateId;
  setTemplateId: (t: TemplateId) => void;
  onApply: (t: TemplateId) => void;
  isActive: boolean;
  data: ReturnType<typeof useResume.getState>['data'];
}) {
  const meta = TEMPLATE_REGISTRY.find((t) => t.id === templateId);

  return (
    <div className="flex flex-col bg-cream/40 border border-cocoa/10 rounded-2xl overflow-hidden min-h-0">
      <div className="px-3 py-2 border-b border-cocoa/10 flex items-center gap-2 bg-paper">
        <span className="bg-olive-ink text-paper text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
          {label}
        </span>
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value as TemplateId)}
          className="flex-1 bg-transparent border border-cocoa/15 rounded-lg px-2 py-1 text-sm text-olive-ink"
        >
          {TEMPLATE_REGISTRY.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.tag}
            </option>
          ))}
        </select>
        {isActive ? (
          <span className="text-[10px] text-matcha-deep px-2 py-1 whitespace-nowrap">✓ active</span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(templateId)}
            className="bg-olive-ink text-paper text-xs font-medium px-3 py-1 rounded-full hover:bg-olive transition whitespace-nowrap"
            title={`switch to ${meta?.name ?? templateId}`}
          >
            use this →
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto thin-scroll p-3 flex justify-center bg-cocoa/5">
        {/*
          Each side renders the resume at a fixed CSS width, then the wrapper
          container scales it down to fit. We use the CSS container query
          classes already defined in globals (`thumb-shell` / `thumb-page`).
        */}
        <div className="thumb-shell w-full max-w-[420px]">
          <div className="thumb-page">
            <ResumePreview data={{ ...data, template: templateId }} />
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-t border-cocoa/10 text-[11px] text-cocoa-soft bg-paper italic truncate">
        {meta?.tag}
      </div>
    </div>
  );
}
