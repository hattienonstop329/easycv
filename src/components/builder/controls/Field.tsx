'use client';

import { TextareaHTMLAttributes, InputHTMLAttributes, forwardRef } from 'react';

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] uppercase tracking-widest text-cocoa-soft mb-1 font-[family-name:var(--font-hand)] text-base normal-case tracking-normal">
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-paper border border-cocoa/15 rounded-xl px-3 py-2 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition placeholder:text-cocoa-soft/60 ${
        props.className ?? ''
      }`}
    />
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`w-full bg-paper border border-cocoa/15 rounded-xl px-3 py-2 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition placeholder:text-cocoa-soft/60 resize-y min-h-[70px] ${
          props.className ?? ''
        }`}
      />
    );
  },
);

export function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function ItemCard({
  children,
  onRemove,
  dragHandle,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  dragHandle?: React.ReactNode;
}) {
  return (
    <div className="bg-cream2/50 border border-cocoa/15 rounded-2xl p-4 relative group">
      <div className="flex items-start justify-between gap-2 mb-3">
        {dragHandle}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-cocoa-soft hover:text-strawberry-deep transition opacity-60 group-hover:opacity-100"
          >
            remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mt-3 border-2 border-dashed border-cocoa/25 rounded-xl py-3 text-sm text-cocoa-soft hover:border-matcha hover:text-matcha-deep hover:bg-matcha/5 transition font-[family-name:var(--font-hand)] text-lg"
    >
      + {label}
    </button>
  );
}
