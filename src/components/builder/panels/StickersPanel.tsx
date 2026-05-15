'use client';

import { useResume } from '@/lib/store';
import { Sticker, StickerKind } from '@/lib/types';
import {
  Arrow,
  CoffeeCup,
  Flower,
  Heart,
  Leaf,
  PaperPlane,
  Spiral,
  Squiggle,
  Star,
} from '@/components/landing/Doodles';

const KINDS: { id: StickerKind; name: string; render: (props: { className?: string; color?: string }) => React.ReactElement }[] = [
  { id: 'star', name: 'star', render: Star },
  { id: 'heart', name: 'heart', render: Heart },
  { id: 'flower', name: 'flower', render: Flower },
  { id: 'leaf', name: 'leaf', render: Leaf },
  { id: 'spiral', name: 'spiral', render: Spiral },
  { id: 'coffee', name: 'coffee', render: CoffeeCup },
  { id: 'paper-plane', name: 'plane', render: PaperPlane },
  { id: 'arrow', name: 'arrow', render: Arrow },
  { id: 'squiggle', name: 'squiggle', render: Squiggle },
];

const PALETTE = ['#7A8B5C', '#3D4A2A', '#C77D7D', '#E8A5A5', '#4A3F35', '#BFB29E', '#000000'];

const id = () => Math.random().toString(36).slice(2, 10);

export function StickersPanel() {
  const stickers = useResume((s) => s.data.customization.stickers);
  const addSticker = useResume((s) => s.addSticker);
  const updateSticker = useResume((s) => s.updateSticker);
  const removeSticker = useResume((s) => s.removeSticker);
  const clearStickers = useResume((s) => s.clearStickers);

  const placeSticker = (kind: StickerKind) => {
    addSticker({
      id: id(),
      kind,
      x: 80,
      y: 12,
      rotation: -8,
      size: 56,
      color: '#7A8B5C',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-cocoa-soft leading-relaxed">
        drop hand-drawn doodles on your resume. they appear as a free layer over the page,
        so they don&apos;t shift your text. great on the handwriting templates.
      </div>

      <Block title="add a sticker">
        <div className="grid grid-cols-3 gap-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => placeSticker(k.id)}
              className="bg-paper border border-cocoa/15 rounded-xl p-3 hover:border-olive-ink hover:bg-cream2 transition flex flex-col items-center gap-1"
            >
              <k.render className="w-7 h-7" color="#3D4A2A" />
              <span className="text-[10px] text-cocoa-soft uppercase tracking-wider">{k.name}</span>
            </button>
          ))}
        </div>
      </Block>

      {stickers.length > 0 && (
        <Block title={`placed (${stickers.length})`}>
          <div className="space-y-3">
            {stickers.map((s) => (
              <StickerEditor
                key={s.id}
                sticker={s}
                onChange={(p) => updateSticker(s.id, p)}
                onRemove={() => removeSticker(s.id)}
              />
            ))}
            <button
              type="button"
              onClick={clearStickers}
              className="w-full text-xs text-cocoa-soft hover:text-strawberry-deep py-1"
            >
              clear all stickers
            </button>
          </div>
        </Block>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-hand)] text-xl text-olive-ink mb-3 leading-none">
        {title}
      </div>
      {children}
    </div>
  );
}

function StickerEditor({
  sticker,
  onChange,
  onRemove,
}: {
  sticker: Sticker;
  onChange: (patch: Partial<Sticker>) => void;
  onRemove: () => void;
}) {
  const Icon = KINDS.find((k) => k.id === sticker.kind)?.render ?? Star;
  return (
    <div className="bg-cream2/50 border border-cocoa/15 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ display: 'inline-block', transform: `rotate(${sticker.rotation}deg)` }}>
            <Icon className="w-6 h-6" color={sticker.color} />
          </span>
          <span className="text-xs text-cocoa-soft uppercase tracking-wider">{sticker.kind}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-cocoa-soft hover:text-strawberry-deep text-base leading-none"
          title="remove"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <Slider label="x" min={0} max={100} value={sticker.x} onChange={(x) => onChange({ x })} suffix="%" />
        <Slider label="y" min={0} max={100} value={sticker.y} onChange={(y) => onChange({ y })} suffix="%" />
        <Slider label="size" min={20} max={140} value={sticker.size} onChange={(size) => onChange({ size })} suffix="px" />
        <Slider label="rotation" min={-180} max={180} value={sticker.rotation} onChange={(rotation) => onChange({ rotation })} suffix="°" />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-cocoa-soft mr-1">color</span>
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange({ color: c })}
            className={`w-5 h-5 rounded-full border-2 transition ${
              sticker.color === c ? 'border-olive-ink scale-110' : 'border-cocoa/15 hover:scale-105'
            }`}
            style={{ background: c }}
            aria-label={`color ${c}`}
          />
        ))}
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  suffix,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center justify-between text-cocoa-soft">
        <span>{label}</span>
        <span className="text-olive-ink">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-matcha-deep"
      />
    </label>
  );
}
