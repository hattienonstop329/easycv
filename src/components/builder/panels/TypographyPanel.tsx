'use client';

import { useState } from 'react';
import { useResume } from '@/lib/store';
import { BulletSymbol, SectionType, SectionTypography, SectionTypographyMap } from '@/lib/types';

// Stable empty fallback — using {} inline inside a Zustand selector triggers
// infinite re-renders because every call returns a new reference.
const EMPTY_TYPOGRAPHY: SectionTypographyMap = {};

const SECTION_OPTIONS: { type: SectionType; label: string; supportsBullets: boolean }[] = [
  { type: 'experience', label: 'experience', supportsBullets: true },
  { type: 'projects', label: 'projects', supportsBullets: false },
  { type: 'education', label: 'education', supportsBullets: false },
  { type: 'skills', label: 'skills', supportsBullets: false },
  { type: 'summary', label: 'summary', supportsBullets: false },
  { type: 'languages', label: 'languages', supportsBullets: false },
  { type: 'certifications', label: 'certifications', supportsBullets: false },
  { type: 'awards', label: 'awards', supportsBullets: false },
  { type: 'custom', label: 'custom blocks', supportsBullets: false },
];

const BULLET_SYMBOLS: { id: BulletSymbol; label: string }[] = [
  { id: '•', label: '•' },
  { id: '–', label: '–' },
  { id: '→', label: '→' },
  { id: '✦', label: '✦' },
  { id: '·', label: '·' },
  { id: 'none', label: 'none' },
];

export function TypographyPanel() {
  const typography = useResume((s) => s.data.customization.typography) ?? EMPTY_TYPOGRAPHY;
  const update = useResume((s) => s.updateSectionTypography);
  const [active, setActive] = useState<SectionType>('experience');
  const current: SectionTypography = typography[active] ?? {};
  const meta = SECTION_OPTIONS.find((s) => s.type === active)!;

  const set = (patch: Partial<SectionTypography>) => update(active, patch);
  const reset = () => update(active, null);
  const dirtyCount = Object.keys(typography).filter(
    (k) => Object.keys(typography[k as SectionType] ?? {}).length > 0,
  ).length;

  return (
    <div className="space-y-5">
      <div className="text-xs text-cocoa-soft leading-relaxed">
        fine-tune the look of each section. defaults come from your template &amp; density —
        sliders only kick in when you move them. {dirtyCount > 0 && (
          <span className="text-strawberry-deep">
            {dirtyCount} section{dirtyCount === 1 ? '' : 's'} customized.
          </span>
        )}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mb-1.5">section</div>
        <div className="grid grid-cols-3 gap-1">
          {SECTION_OPTIONS.map((s) => {
            const isCustom = Object.keys(typography[s.type] ?? {}).length > 0;
            return (
              <button
                key={s.type}
                type="button"
                onClick={() => setActive(s.type)}
                className={`text-xs px-2 py-1.5 rounded-lg border transition relative ${
                  active === s.type
                    ? 'border-olive-ink bg-cream2 text-olive-ink'
                    : 'border-cocoa/15 text-cocoa-soft hover:bg-cream2'
                }`}
              >
                {s.label}
                {isCustom && (
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-strawberry-deep"
                    aria-label="customized"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-paper border border-cocoa/15 rounded-2xl p-4 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-cocoa-soft">editing</div>
            <div className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-none">
              {meta.label}
            </div>
          </div>
          {Object.keys(current).length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-strawberry-deep hover:text-strawberry"
            >
              reset
            </button>
          )}
        </div>

        <Slider
          label="title size"
          value={current.titleSize}
          defaultValue={1.0}
          min={0.7}
          max={1.5}
          step={0.05}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => set({ titleSize: v })}
          onClear={() => set({ titleSize: undefined })}
        />
        <Slider
          label="body size"
          value={current.bodySize}
          defaultValue={1.0}
          min={0.7}
          max={1.4}
          step={0.05}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => set({ bodySize: v })}
          onClear={() => set({ bodySize: undefined })}
        />
        <Slider
          label="line height"
          value={current.lineHeight}
          defaultValue={1.4}
          min={1.0}
          max={2.0}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ lineHeight: v })}
          onClear={() => set({ lineHeight: undefined })}
        />
        <Slider
          label="space between items"
          value={current.itemGap}
          defaultValue={10}
          min={0}
          max={32}
          step={1}
          format={(v) => `${v}px`}
          onChange={(v) => set({ itemGap: v })}
          onClear={() => set({ itemGap: undefined })}
        />
        <Slider
          label="extra space above section"
          value={current.sectionGapTop}
          defaultValue={0}
          min={0}
          max={48}
          step={2}
          format={(v) => `${v}px`}
          onChange={(v) => set({ sectionGapTop: v })}
          onClear={() => set({ sectionGapTop: undefined })}
        />

        {meta.supportsBullets && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-widest text-cocoa-soft">
                bullet symbol
              </label>
              {current.bulletSymbol !== undefined && (
                <button
                  type="button"
                  onClick={() => set({ bulletSymbol: undefined })}
                  className="text-[10px] text-cocoa-soft hover:text-strawberry-deep"
                >
                  default
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {BULLET_SYMBOLS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => set({ bulletSymbol: b.id })}
                  className={`text-sm w-9 h-9 rounded-lg border transition flex items-center justify-center font-mono ${
                    current.bulletSymbol === b.id
                      ? 'border-olive-ink bg-cream2 text-olive-ink'
                      : 'border-cocoa/15 text-cocoa-soft hover:bg-cream2'
                  }`}
                >
                  {b.label === 'none' ? <span className="text-[10px]">none</span> : b.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  defaultValue,
  min,
  max,
  step,
  format,
  onChange,
  onClear,
}: {
  label: string;
  value: number | undefined;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  onClear: () => void;
}) {
  const isCustom = value !== undefined;
  const display = value ?? defaultValue;
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-[11px] uppercase tracking-widest text-cocoa-soft">{label}</label>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] tabular-nums ${isCustom ? 'text-olive-ink' : 'text-cocoa-soft'}`}>
            {format(display)}
            {!isCustom && <span className="text-cocoa-soft/60"> · default</span>}
          </span>
          {isCustom && (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] text-cocoa-soft hover:text-strawberry-deep"
              title="reset to default"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={display}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-matcha-deep"
      />
    </div>
  );
}
