'use client';

import { useEffect, useRef, useState } from 'react';

type Filter = 'none' | 'grayscale' | 'sepia' | 'high-contrast';

const FILTER_CSS: Record<Filter, string> = {
  none: 'none',
  grayscale: 'grayscale(1)',
  sepia: 'sepia(0.6)',
  'high-contrast': 'contrast(1.15) saturate(1.1)',
};

const OUTPUT_SIZE = 480; // square output, plenty of resolution for any template
const VIEWPORT_PX = 280; // editor preview size

interface Props {
  /** dataURL or remote URL of the image to crop */
  source: string;
  open: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export function PhotoEditModal({ source, open, onClose, onSave }: Props) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<Filter>('none');
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

  // Reset transform when a new source comes in.
  useEffect(() => {
    if (open) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setFilter('none');
      setImgDims(null);
    }
  }, [open, source]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
    };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({ x: dragRef.current.baseX + dx, y: dragRef.current.baseY + dy });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    dragRef.current = null;
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const save = async () => {
    if (!imgDims) return;
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background — white so transparent PNGs come out clean.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // The viewport in screen px maps to the OUTPUT_SIZE canvas. So the same
    // transform applied to the image in the viewport, scaled by OUTPUT/VIEWPORT,
    // applies to the canvas.
    const ratio = OUTPUT_SIZE / VIEWPORT_PX;
    // Compute the image's natural size when rendered at the chosen scale,
    // covering the viewport at scale=1.
    const cover = Math.max(VIEWPORT_PX / imgDims.w, VIEWPORT_PX / imgDims.h);
    const renderedW = imgDims.w * cover * scale;
    const renderedH = imgDims.h * cover * scale;
    // Top-left of the rendered image, in viewport-space, then scaled to canvas-space.
    const x = (VIEWPORT_PX - renderedW) / 2 + offset.x;
    const y = (VIEWPORT_PX - renderedH) / 2 + offset.y;

    if (filter !== 'none') {
      ctx.filter = FILTER_CSS[filter];
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = source;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });
    ctx.drawImage(img, x * ratio, y * ratio, renderedW * ratio, renderedH * ratio);

    onSave(canvas.toDataURL('image/jpeg', 0.92));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-cocoa/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-paper border border-cocoa/15 rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep -rotate-1 inline-block">
              just right ✦
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-olive-ink font-light">
              edit photo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-cocoa-soft hover:text-olive-ink text-xl leading-none"
            aria-label="close"
          >
            ×
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div
            className="relative bg-cocoa/10 rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ width: VIEWPORT_PX, height: VIEWPORT_PX }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source}
              alt="source"
              draggable={false}
              onLoad={onImgLoad}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
                transformOrigin: 'center',
                minWidth: '100%',
                minHeight: '100%',
                maxWidth: 'none',
                objectFit: 'cover',
                filter: FILTER_CSS[filter],
                pointerEvents: 'none',
              }}
            />
            <div className="absolute inset-0 ring-2 ring-paper/80 rounded-full pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-cocoa-soft mb-1">
              zoom · drag to position
            </label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-matcha-deep"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-cocoa-soft mb-1.5">
              filter
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['none', 'grayscale', 'sepia', 'high-contrast'] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    filter === f
                      ? 'border-olive-ink bg-cream2 text-olive-ink'
                      : 'border-cocoa/15 text-cocoa-soft hover:bg-cream2'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-cocoa-soft hover:text-olive-ink px-3 py-1.5"
          >
            cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!imgDims}
            className="bg-olive-ink text-paper px-4 py-2 rounded-full text-sm font-medium hover:bg-olive transition disabled:opacity-60"
          >
            save photo
          </button>
        </div>
      </div>
    </div>
  );
}
