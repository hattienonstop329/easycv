'use client';

import { useEffect, useRef, useState } from 'react';
import { ResumePreview } from '@/components/templates';
import { ResumeData } from '@/lib/types';

const MAX_PAGE_WIDTH_PX = 816; // Letter width — the wider of the two formats.

export function ViewerPaper({
  data,
  pageWidth,
  pageHeight,
}: {
  data: ResumeData;
  pageWidth: string;
  pageHeight: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  // Start at 1 so SSR/initial render uses the page's natural size; the
  // observer below shrinks it on mount if the container is narrower.
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const calc = () => {
      const styles = window.getComputedStyle(el);
      const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const usable = el.clientWidth - padX;
      if (usable <= 0) return;
      setScale(Math.min(1, usable / MAX_PAGE_WIDTH_PX));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="flex-1 p-4 md:p-10 flex justify-center items-start overflow-x-hidden"
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        <div
          id="resume-preview"
          className="bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] rounded-sm origin-top"
          style={{ width: pageWidth, minHeight: pageHeight }}
        >
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
}
