'use client';

import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { ResumePreview } from '@/components/templates';
import { LetterPreview } from '@/components/templates/letter';
import { StickerLayer } from '@/components/templates/StickerLayer';
import { PAGE_SIZES } from '@/lib/design-tokens';
import { PaperTexture } from '@/lib/types';
import { usePreviewMetrics } from '@/lib/preview-metrics-store';
import { FitToPageButton } from '../controls/FitToPageButton';

const TEXTURE_CLASS: Record<PaperTexture, string> = {
  plain: '',
  cream: 'paper-tex-cream',
  lined: 'paper-tex-lined',
  grid: 'paper-tex-grid',
  dotted: 'paper-tex-dotted',
  coffee: 'paper-tex-coffee',
};

export type PreviewMode = 'resume' | 'letter';

export function PreviewPaper({ scale = 1, mode = 'resume' }: { scale?: number; mode?: PreviewMode }) {
  const data = useResume((s) => s.data);
  const size = PAGE_SIZES[data.customization.format];
  const ref = useRef<HTMLDivElement>(null);
  const [actualHeight, setActualHeight] = useState(0);
  const setMetrics = usePreviewMetrics((s) => s.setMetrics);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      setActualHeight(h);
      // Publish for the auto-fit feature + any other readers.
      if (mode === 'resume') {
        setMetrics({ contentHeightPx: h, pageHeightPx: size.heightPx });
      }
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [setMetrics, mode, size.heightPx]);

  const overflowing = actualHeight > size.heightPx + 4;
  const pages = Math.ceil(actualHeight / size.heightPx) || 1;
  const textureClass = TEXTURE_CLASS[data.customization.paperTexture] ?? '';

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      <div className="relative" style={{ width: size.widthMm, minHeight: size.heightMm }}>
        <div
          ref={ref}
          id="resume-preview"
          className={`bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] relative ${textureClass}`}
          style={{ width: size.widthMm, minHeight: size.heightMm }}
        >
          {mode === 'letter' ? <LetterPreview data={data} /> : <ResumePreview data={data} />}
          {mode === 'resume' && <StickerLayer stickers={data.customization.stickers} />}
        </div>

        {Array.from({ length: pages - 1 }).map((_, i) => (
          <PageBreakLine key={i} pageIndex={i + 1} pageHeightPx={size.heightPx} />
        ))}

        {overflowing && mode === 'resume' && (
          <div className="absolute -top-2 right-2 -translate-y-full no-print flex items-center gap-2">
            <div className="bg-strawberry-deep text-paper text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              spilling to page {pages}
            </div>
            <FitToPageButton variant="chip" />
          </div>
        )}
      </div>
    </div>
  );
}

function PageBreakLine({ pageIndex, pageHeightPx }: { pageIndex: number; pageHeightPx: number }) {
  return (
    <div
      className="absolute left-0 right-0 no-print pointer-events-none"
      style={{ top: pageHeightPx * pageIndex }}
    >
      <div className="border-t-2 border-dashed border-strawberry-deep/70" style={{ marginTop: -1 }} />
      <div className="absolute right-2 -top-2 -translate-y-full">
        <div className="bg-strawberry-deep text-paper text-[9px] uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
          page {pageIndex + 1}
        </div>
      </div>
    </div>
  );
}

export function PreviewPrint({ mode = 'resume' }: { mode?: PreviewMode }) {
  const data = useResume((s) => s.data);
  const size = PAGE_SIZES[data.customization.format];
  const textureClass = TEXTURE_CLASS[data.customization.paperTexture] ?? '';
  return (
    <div
      className={`print-only-page bg-white relative ${textureClass}`}
      style={{ width: size.widthMm, minHeight: size.heightMm }}
    >
      {mode === 'letter' ? <LetterPreview data={data} /> : <ResumePreview data={data} />}
      {mode === 'resume' && <StickerLayer stickers={data.customization.stickers} />}
    </div>
  );
}
