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

const RENDERERS: Record<StickerKind, (props: { className?: string; color?: string }) => React.ReactElement> = {
  star: Star,
  heart: Heart,
  flower: Flower,
  leaf: Leaf,
  spiral: Spiral,
  coffee: CoffeeCup,
  'paper-plane': PaperPlane,
  arrow: Arrow,
  squiggle: Squiggle,
};

export function StickerLayer({ stickers }: { stickers: Sticker[] }) {
  if (stickers.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {stickers.map((s) => {
        const C = RENDERERS[s.kind] ?? Star;
        return (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
              width: s.size,
              height: s.size,
            }}
          >
            <C color={s.color} className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
}
