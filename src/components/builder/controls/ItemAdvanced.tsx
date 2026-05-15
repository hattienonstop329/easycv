'use client';

import { useState } from 'react';
import { ItemOverrides } from '@/lib/types';

export function ItemAdvanced({
  value,
  onChange,
}: {
  value: ItemOverrides | undefined;
  onChange: (next: ItemOverrides | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const dirty = value && Object.values(value).some((v) => v !== undefined && v !== false);
  const v = value ?? {};

  const set = (patch: Partial<ItemOverrides>) => {
    const merged: ItemOverrides = { ...v, ...patch };
    // Strip cleared values so saved shape stays small.
    for (const k of Object.keys(merged) as Array<keyof ItemOverrides>) {
      if (merged[k] === undefined || merged[k] === false) delete merged[k];
    }
    onChange(Object.keys(merged).length > 0 ? merged : undefined);
  };

  const reset = () => onChange(undefined);

  return (
    <div className="mt-3 border-t border-cocoa/10 pt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[11px] text-cocoa-soft hover:text-olive-ink transition"
      >
        <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
        advanced
        {dirty && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-strawberry-deep"
            aria-label="this item has overrides"
          />
        )}
      </button>

      {open && (
        <div className="mt-2 space-y-3 bg-paper rounded-xl border border-cocoa/10 p-3">
          <Slider
            label="font size"
            value={v.fontSize}
            defaultValue={1.0}
            min={0.7}
            max={1.5}
            step={0.05}
            format={(x) => `${(x * 100).toFixed(0)}%`}
            onChange={(x) => set({ fontSize: x })}
            onClear={() => set({ fontSize: undefined })}
          />
          <Slider
            label="extra space above"
            value={v.spaceBefore}
            defaultValue={0}
            min={0}
            max={48}
            step={2}
            format={(x) => `${x}px`}
            onChange={(x) => set({ spaceBefore: x })}
            onClear={() => set({ spaceBefore: undefined })}
          />
          <Toggle
            label="force page break before"
            value={!!v.pageBreakBefore}
            onChange={(x) => set({ pageBreakBefore: x ? true : undefined })}
            hint="when printed, this item starts on a fresh page"
          />
          <Toggle
            label="keep on a single page"
            value={!!v.keepTogether}
            onChange={(x) => set({ keepTogether: x ? true : undefined })}
            hint="don't split this item across two pages"
          />

          {dirty && (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] text-strawberry-deep hover:text-strawberry"
            >
              clear all overrides
            </button>
          )}
        </div>
      )}
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
        <label className="text-[10px] uppercase tracking-widest text-cocoa-soft">{label}</label>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] tabular-nums ${isCustom ? 'text-olive-ink' : 'text-cocoa-soft'}`}>
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

function Toggle({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-matcha-deep mt-0.5"
      />
      <span className="flex-1">
        <span className="text-xs text-cocoa">{label}</span>
        {hint && <span className="block text-[10px] text-cocoa-soft italic">{hint}</span>}
      </span>
    </label>
  );
}
