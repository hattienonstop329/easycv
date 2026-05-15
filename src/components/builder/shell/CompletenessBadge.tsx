'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { scoreResume, type CompletenessScore } from '@/lib/completeness';
import type { PanelId } from './PanelSwitcher';

const TONE_RING: Record<CompletenessScore['tone'], string> = {
  low: 'stroke-strawberry-deep',
  mid: 'stroke-stone',
  good: 'stroke-matcha',
  great: 'stroke-olive-ink',
};

const TONE_TEXT: Record<CompletenessScore['tone'], string> = {
  low: 'text-strawberry-deep',
  mid: 'text-cocoa',
  good: 'text-olive-ink',
  great: 'text-olive-ink',
};

export function CompletenessBadge({
  setPanel,
}: {
  setPanel?: (p: PanelId) => void;
}) {
  const data = useResume((s) => s.data);
  const score = useMemo(() => scoreResume(data), [data]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Circle math: 18 radius → circumference 113.097
  const r = 9;
  const c = 2 * Math.PI * r;
  const dash = (score.percent / 100) * c;
  const remaining = score.checklist.filter((i) => !i.done);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-cream2 transition group"
        title={`resume ${score.percent}% complete`}
        aria-label={`resume ${score.percent}% complete — click for checklist`}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
          <circle cx="11" cy="11" r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-cocoa/15" />
          <circle
            cx="11"
            cy="11"
            r={r}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            className={TONE_RING[score.tone]}
          />
        </svg>
        <span className={`text-xs font-medium tabular-nums ${TONE_TEXT[score.tone]}`}>
          {score.percent}%
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-paper border border-cocoa/15 rounded-xl shadow-xl z-40 w-[300px] overflow-hidden">
          <div className="px-4 py-3 bg-cream/60 border-b border-cocoa/10">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-cocoa-soft">resume</div>
                <div className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-none mt-0.5">
                  {score.percent}% — {score.label}
                </div>
              </div>
              <div className="text-[11px] text-cocoa-soft">
                {score.checklist.filter((i) => i.done).length}/{score.checklist.length}
              </div>
            </div>
          </div>

          <div className="max-h-[340px] overflow-y-auto thin-scroll py-1">
            {remaining.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-cocoa-soft">
                <div className="text-2xl mb-2">✦</div>
                everything's filled in. nice.
              </div>
            ) : (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-cocoa-soft">
                  still to do
                </div>
                {remaining.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.panel && setPanel) setPanel(item.panel);
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-cream2 group/item flex items-start gap-2.5 transition"
                  >
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-cocoa/30 shrink-0 group-hover/item:border-strawberry-deep" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-cocoa">{item.label}</span>
                      {item.hint && (
                        <span className="block text-[11px] text-cocoa-soft italic mt-0.5">
                          {item.hint}
                        </span>
                      )}
                    </span>
                    <span className="text-cocoa-soft text-xs opacity-0 group-hover/item:opacity-100 transition">
                      →
                    </span>
                  </button>
                ))}
                <div className="border-t border-cocoa/10 mt-1 pt-1 pb-1">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-cocoa-soft">
                    done
                  </div>
                  {score.checklist
                    .filter((i) => i.done)
                    .map((item) => (
                      <div key={item.id} className="px-3 py-1 flex items-center gap-2.5 text-sm text-cocoa-soft/80">
                        <span className="w-4 h-4 rounded-full bg-matcha/40 border border-matcha-deep/40 shrink-0 flex items-center justify-center text-[10px] text-olive-ink">
                          ✓
                        </span>
                        <span className="line-through decoration-cocoa/30">{item.label}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
