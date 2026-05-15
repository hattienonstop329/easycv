'use client';

import { useEffect, useState } from 'react';
import { useResume } from '@/lib/store';
import { PERSONAS } from '@/lib/personas';

const SEEN_KEY = 'easycv-seen-personas';

export function PersonaPicker() {
  const loadResume = useResume((s) => s.loadResume);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(SEEN_KEY);
    if (!seen) setOpen(true);
  }, []);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SEEN_KEY, '1');
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa-soft/40 backdrop-blur no-print">
      <div className="bg-paper border border-cocoa/15 rounded-3xl shadow-2xl max-w-3xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto thin-scroll">
        <div className="text-center mb-6">
          <div className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep -rotate-1 inline-block">
            welcome ✦
          </div>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-olive-ink mt-2 font-light">
            start with a sample.
          </h2>
          <p className="text-cocoa-soft mt-2 text-sm max-w-md mx-auto">
            pick a persona that&apos;s closest to you — you can rewrite anything, switch templates,
            or clear it all. nothing is sent anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                loadResume(p.data);
                dismiss();
              }}
              className="text-left bg-cream2/50 border border-cocoa/15 rounded-2xl p-4 hover:border-olive-ink hover:bg-cream2 hover:-translate-y-0.5 transition group"
            >
              <div className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-none">
                {p.name}
              </div>
              <div className="text-xs text-strawberry-deep mt-1 uppercase tracking-widest">
                {p.tagline}
              </div>
              <p className="text-xs text-cocoa-soft mt-2 leading-relaxed">{p.blurb}</p>
              <div className="mt-3 text-xs text-matcha-deep font-[family-name:var(--font-hand)] text-base opacity-0 group-hover:opacity-100 transition">
                use this →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={dismiss}
            className="text-sm text-cocoa-soft hover:text-olive-ink"
          >
            keep what i have
          </button>
          <div className="text-xs text-cocoa-soft">
            tip: press <kbd className="bg-cream2 border border-cocoa/15 rounded px-1.5 py-0.5 text-[10px]">?</kbd> for keyboard shortcuts
          </div>
        </div>
      </div>
    </div>
  );
}
