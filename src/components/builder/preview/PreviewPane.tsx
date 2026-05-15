'use client';

import { useEffect, useState } from 'react';
import { PreviewPaper, PreviewMode } from './PreviewPaper';

export function PreviewPane({ mode = 'resume' }: { mode?: PreviewMode }) {
  const [scale, setScale] = useState(0.78);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1536) setScale(1);
      else if (w >= 1280) setScale(0.92);
      else if (w >= 1024) setScale(0.78);
      else if (w >= 768) setScale(0.7);
      else if (w >= 480) {
        // Phone: scale to fit available width minus padding (16px each side).
        // A4 = 794px; Letter = 816px. Use the larger so both formats fit.
        setScale(Math.min(0.95, (w - 32) / 816));
      } else {
        setScale(Math.min(0.95, (w - 24) / 816));
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return (
    <div className="bg-stone/30 overflow-y-auto thin-scroll h-full p-3 md:p-8 flex justify-center items-start">
      <PreviewPaper scale={scale} mode={mode} />
    </div>
  );
}
