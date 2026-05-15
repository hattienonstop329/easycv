'use client';

import { useEffect, useState } from 'react';
import { todaysPrompt } from '@/lib/prompts';

const SEEN_KEY = 'easycv-prompt-seen-on';

export function DailyPromptChip() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    setPrompt(todaysPrompt());
    if (typeof window === 'undefined') return;
    const today = new Date().toISOString().slice(0, 10);
    const seen = window.localStorage.getItem(SEEN_KEY);
    if (seen !== today) setOpen(true);
  }, []);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString().slice(0, 10);
      window.localStorage.setItem(SEEN_KEY, today);
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="hidden lg:flex no-print absolute left-1/2 top-full -translate-x-1/2 mt-1 z-30 pointer-events-auto">
      <div className="bg-strawberry/35 border border-strawberry/40 text-cocoa-soft rounded-full pl-3 pr-2 py-1 flex items-center gap-2 shadow-sm">
        <span className="text-strawberry-deep font-[family-name:var(--font-hand)] text-base">
          today ✦
        </span>
        <span className="text-xs italic">{prompt}</span>
        <button
          type="button"
          onClick={dismiss}
          className="text-cocoa-soft hover:text-strawberry-deep leading-none text-sm w-5 h-5 rounded-full hover:bg-strawberry/30 transition"
          aria-label="dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
