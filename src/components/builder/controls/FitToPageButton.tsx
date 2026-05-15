'use client';

import { useCallback, useState } from 'react';
import { useResume } from '@/lib/store';
import { usePreviewMetrics, isOverflowing } from '@/lib/preview-metrics-store';
import { useToasts } from '@/lib/toast-store';
import { Density } from '@/lib/types';

// Densities listed largest → smallest. fitToPage walks left → right past current.
const DENSITY_ORDER: Density[] = ['spacious', 'comfortable', 'compact'];

function nextFrame(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function FitToPageButton({
  variant = 'pill',
  className,
}: {
  variant?: 'pill' | 'chip';
  className?: string;
}) {
  const density = useResume((s) => s.data.customization.density);
  const update = useResume((s) => s.updateCustomization);
  const push = useToasts((s) => s.push);
  const [running, setRunning] = useState(false);

  const fit = useCallback(async () => {
    if (running) return;
    setRunning(true);
    try {
      // If we're already fitting, say so up-front
      const start = usePreviewMetrics.getState();
      if (!isOverflowing(start)) {
        push('already fits in one page ✦', { tone: 'praise' });
        return;
      }
      const idx = DENSITY_ORDER.indexOf(density);
      let landed: Density | null = null;
      for (let i = idx + 1; i < DENSITY_ORDER.length; i++) {
        const d = DENSITY_ORDER[i];
        update({ density: d });
        // Two paint frames + a tiny delay to let the ResizeObserver settle.
        await nextFrame();
        await nextFrame();
        await wait(60);
        if (!isOverflowing(usePreviewMetrics.getState())) {
          landed = d;
          break;
        }
      }
      if (landed) {
        push(`shrunk to ${landed} — fits ✦`, { tone: 'praise' });
      } else {
        push('still overflowing at compact — try shorter bullets, or accept a 2-page resume');
      }
    } finally {
      setRunning(false);
    }
  }, [density, update, push, running]);

  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={fit}
        disabled={running}
        className={`text-paper bg-cocoa/80 hover:bg-cocoa text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full transition disabled:opacity-60 ${className ?? ''}`}
        title="auto-shrink density until the resume fits one page"
      >
        {running ? 'fitting…' : 'shrink to fit'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={fit}
      disabled={running}
      className={`bg-olive-ink/95 text-paper hover:bg-olive transition px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-60 ${className ?? ''}`}
      title="auto-shrink density until the resume fits one page"
    >
      <span aria-hidden>⇲</span>
      {running ? 'fitting page…' : 'shrink to fit one page'}
    </button>
  );
}
