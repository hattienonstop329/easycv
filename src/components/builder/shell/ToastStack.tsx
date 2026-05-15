'use client';

import { useToasts } from '@/lib/toast-store';

export function ToastStack() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="no-print fixed top-20 right-4 z-[80] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto text-left px-4 py-2 rounded-2xl shadow-lg border max-w-[260px] animate-[toastIn_180ms_ease-out] transition ${
            t.tone === 'praise'
              ? 'bg-strawberry/40 border-strawberry/50 text-cocoa'
              : 'bg-paper border-cocoa/15 text-olive-ink'
          }`}
        >
          <div className={`font-[family-name:var(--font-hand)] text-lg leading-tight ${t.tone === 'praise' ? '-rotate-1' : ''}`}>
            {t.message}
          </div>
        </button>
      ))}
      <style jsx>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
