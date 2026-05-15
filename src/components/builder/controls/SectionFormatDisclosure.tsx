'use client';

import { useState } from 'react';
import { useResume } from '@/lib/store';
import { FONTS } from '@/lib/design-tokens';
import {
  BulletSymbol,
  FontKey,
  SectionType,
  SectionTypography,
  SectionTypographyMap,
} from '@/lib/types';

// Module-level constant so the Zustand selector returns a stable reference.
const EMPTY_TYPOGRAPHY: SectionTypographyMap = {};

const BULLET_SYMBOLS: { id: BulletSymbol; label: string }[] = [
  { id: '•', label: '•' },
  { id: '–', label: '–' },
  { id: '→', label: '→' },
  { id: '✦', label: '✦' },
  { id: '·', label: '·' },
  { id: 'none', label: 'none' },
];

export function SectionFormatDisclosure({
  sectionType,
  supportsBullets = false,
  label = 'format this section',
}: {
  sectionType: SectionType;
  supportsBullets?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const typography = useResume((s) => s.data.customization.typography) ?? EMPTY_TYPOGRAPHY;
  const update = useResume((s) => s.updateSectionTypography);
  const current: SectionTypography = typography[sectionType] ?? {};
  const customCount = Object.keys(current).length;

  const set = (patch: Partial<SectionTypography>) => update(sectionType, patch);
  const reset = () => update(sectionType, null);

  return (
    <div className="mt-4 border border-cocoa/15 rounded-2xl bg-paper overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-cream2/60 transition"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-cocoa-soft">
            {label}
          </span>
          {customCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-strawberry-deep/15 text-strawberry-deep">
              {customCount} custom
            </span>
          )}
        </span>
        <span className={`text-cocoa-soft text-xs transition-transform ${open ? 'rotate-90' : ''}`}>
          ›
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-1 space-y-4 border-t border-cocoa/10">
          {customCount > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={reset}
                className="text-[11px] text-strawberry-deep hover:text-strawberry"
              >
                reset all section overrides
              </button>
            </div>
          )}

          <Group title="size & spacing">
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
          </Group>

          <Group title="fonts">
            <FontSelect
              label="heading font"
              value={current.fontHead}
              onChange={(v) => set({ fontHead: v })}
              onClear={() => set({ fontHead: undefined })}
            />
            <FontSelect
              label="body font"
              value={current.fontBody}
              onChange={(v) => set({ fontBody: v })}
              onClear={() => set({ fontBody: undefined })}
            />
          </Group>

          <Group title="colors">
            <ColorRow
              label="title color"
              value={current.accent}
              onChange={(v) => set({ accent: v })}
              onClear={() => set({ accent: undefined })}
            />
            <ColorRow
              label="item title color"
              value={current.heading}
              onChange={(v) => set({ heading: v })}
              onClear={() => set({ heading: undefined })}
            />
            <ColorRow
              label="body text color"
              value={current.text}
              onChange={(v) => set({ text: v })}
              onClear={() => set({ text: undefined })}
            />
          </Group>

          {supportsBullets && (
            <Group title="bullets">
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
            </Group>
          )}

          <div className="text-[10px] text-cocoa-soft/70 italic leading-relaxed">
            empty values fall back to the global design. only the fields you change override.
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div className="text-[10px] uppercase tracking-widest text-cocoa-soft/80">{title}</div>
      {children}
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

function FontSelect({
  label,
  value,
  onChange,
  onClear,
}: {
  label: string;
  value: FontKey | undefined;
  onChange: (v: FontKey) => void;
  onClear: () => void;
}) {
  const isCustom = value !== undefined;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] uppercase tracking-widest text-cocoa-soft">{label}</label>
        {isCustom && (
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] text-cocoa-soft hover:text-strawberry-deep"
          >
            default
          </button>
        )}
      </div>
      <select
        value={value ?? ''}
        onChange={(e) => {
          if (e.target.value === '') onClear();
          else onChange(e.target.value as FontKey);
        }}
        className="w-full bg-paper border border-cocoa/15 rounded-lg px-2.5 py-1.5 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition"
      >
        <option value="">use global default</option>
        {FONTS.map((f) => (
          <option key={f.key} value={f.key}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  onClear,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  const isCustom = value !== undefined && value !== '';
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-[11px] uppercase tracking-widest text-cocoa-soft flex-1 min-w-0">
        {label}
      </label>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="relative w-7 h-7 rounded-full border-2 border-cocoa/15 overflow-hidden shadow-sm"
          style={{ background: isCustom ? value : 'transparent' }}
        >
          {!isCustom && (
            <span className="absolute inset-0 flex items-center justify-center text-[9px] text-cocoa-soft/60">
              auto
            </span>
          )}
          <input
            type="color"
            value={isCustom ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label={`${label} picker`}
          />
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
  );
}
