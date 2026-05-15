'use client';

import { useEffect, useState } from 'react';
import { useUI } from '@/lib/ui-store';

const SHORTCUTS: ReadonlyArray<{ keys: string; label: string }> = [
  { keys: '⌘ Z', label: 'undo' },
  { keys: '⌘ ⇧ Z', label: 'redo' },
  { keys: '?', label: 'open this overlay' },
  { keys: 'esc', label: 'close overlay or modal' },
  { keys: 'tab', label: 'next field' },
  { keys: '⇧ tab', label: 'previous field' },
];

const TIPS = [
  'click any section in the resume preview to jump to its panel.',
  'every field auto-saves to your browser — refresh-safe.',
  'duplicate the current resume to make a "designer cut" / "eng cut".',
  'paste a JD into the "match jd" panel to see missing keywords.',
  'switch the page format (A4 / Letter) in the design panel.',
  'add a custom section for volunteering, publications, or hobbies.',
];

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  const openTour = useUI((s) => s.openTour);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-cocoa-soft/40 backdrop-blur no-print"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-paper border border-cocoa/15 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep -rotate-1 inline-block">
              keyboard ✦
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-olive-ink font-light">
              shortcuts & tips
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-cocoa-soft hover:text-olive-ink text-xl leading-none"
            aria-label="close"
          >
            ×
          </button>
        </div>

        <div className="space-y-1.5 mb-5">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between text-sm">
              <span className="text-cocoa">{s.label}</span>
              <kbd className="bg-cream2 border border-cocoa/15 rounded px-2 py-0.5 font-mono text-xs text-olive-ink">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t border-cocoa/10 pt-4">
          <div className="text-[10px] uppercase tracking-widest text-cocoa-soft mb-2">tips</div>
          <ul className="space-y-1.5 text-sm text-cocoa">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-strawberry-deep">·</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-cocoa/10 pt-4 mt-4 flex items-center justify-between">
          <span className="text-xs text-cocoa-soft">need a refresher?</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              // Tiny delay so this overlay closes before the tour opens.
              setTimeout(() => openTour(), 120);
            }}
            className="text-xs text-paper bg-olive-ink hover:bg-olive px-3 py-1.5 rounded-full font-medium transition"
          >
            ▶ replay the tour
          </button>
        </div>
      </div>
    </div>
  );
}
