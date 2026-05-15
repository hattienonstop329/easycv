'use client';

import { ChangeEvent, useRef } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toMonthInputValue(text: string): string {
  // Try to parse "Jan 2022" / "01/2022" / "2022-01" / "2022" → "YYYY-MM"
  const t = text.trim();
  if (!t) return '';
  const isoMatch = t.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) return t;
  const slashMatch = t.match(/^(\d{1,2})[\/-](\d{4})$/);
  if (slashMatch) return `${slashMatch[2]}-${slashMatch[1].padStart(2, '0')}`;
  const monthMatch = t.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthMatch) {
    const idx = MONTHS.findIndex((m) => m.toLowerCase().startsWith(monthMatch[1].toLowerCase().slice(0, 3)));
    if (idx >= 0) return `${monthMatch[2]}-${String(idx + 1).padStart(2, '0')}`;
  }
  const yearOnly = t.match(/^(\d{4})$/);
  if (yearOnly) return `${yearOnly[1]}-01`;
  return '';
}

function fromMonthInputValue(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})$/);
  if (!m) return iso;
  const idx = parseInt(m[2], 10) - 1;
  return `${MONTHS[idx] ?? MONTHS[0]} ${m[1]}`;
}

export function MonthInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const monthRef = useRef<HTMLInputElement>(null);

  const handleMonth = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    onChange(fromMonthInputValue(e.target.value));
  };

  return (
    <div className="relative flex items-stretch">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-paper border border-cocoa/15 rounded-l-xl px-3 py-2 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition placeholder:text-cocoa-soft/60 disabled:opacity-50"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => monthRef.current?.showPicker?.()}
        className="px-2.5 bg-paper border border-l-0 border-cocoa/15 rounded-r-xl text-cocoa-soft hover:text-olive-ink hover:bg-cream2 disabled:opacity-50 transition"
        title="pick a month"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
          <path d="M2.5 6h11M5.5 1.5v3M10.5 1.5v3" />
        </svg>
      </button>
      <input
        ref={monthRef}
        type="month"
        value={toMonthInputValue(value)}
        onChange={handleMonth}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
      />
    </div>
  );
}
