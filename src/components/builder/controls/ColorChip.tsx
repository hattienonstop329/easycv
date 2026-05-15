'use client';

import { ChangeEvent } from 'react';

export function ColorChip({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  label?: string;
}) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return (
    <label className="flex items-center gap-2 text-sm text-cocoa-soft cursor-pointer">
      <span
        className="relative w-7 h-7 rounded-full border-2 border-cocoa/15 overflow-hidden shadow-sm"
        style={{ background: value }}
      >
        <input
          type="color"
          value={value}
          onChange={handle}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </span>
      {label && <span className="text-xs">{label}</span>}
    </label>
  );
}
