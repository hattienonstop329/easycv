'use client';

import { ReactNode } from 'react';

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="text-center py-8 px-4 bg-cream2/40 border-2 border-dashed border-cocoa/15 rounded-2xl">
      {icon && <div className="flex items-center justify-center mb-3 text-cocoa-soft">{icon}</div>}
      <div className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-none">
        {title}
      </div>
      <p className="text-sm text-cocoa-soft mt-2 max-w-[28ch] mx-auto leading-relaxed">{body}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1 bg-olive-ink text-paper px-4 py-2 rounded-full text-sm font-medium hover:bg-olive transition"
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
}
