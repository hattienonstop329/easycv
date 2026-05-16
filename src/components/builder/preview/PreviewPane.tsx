'use client';

import { useEffect, useRef, useState } from 'react';
import { PreviewPaper, PreviewMode } from './PreviewPaper';

// Use the larger of the two supported page formats so either fits.
// A4 = 794px, Letter = 816px.
const MAX_PAGE_WIDTH_PX = 816;

export function PreviewPane({ mode = 'resume' }: { mode?: PreviewMode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.78);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      // Inner width of the scroll container minus its horizontal padding.
      const styles = window.getComputedStyle(el);
      const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const usable = el.clientWidth - padX;
      if (usable <= 0) return;
      // Cap at 1 so we never blow the page up larger than its native size.
      setScale(Math.min(1, usable / MAX_PAGE_WIDTH_PX));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-stone/30 overflow-y-auto thin-scroll h-full p-3 md:p-8 flex justify-center items-start"
    >
      <PreviewPaper scale={scale} mode={mode} />
    </div>
  );
}
