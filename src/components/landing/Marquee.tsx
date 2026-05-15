import { Star } from './Doodles';

const ITEMS = [
  'drag · drop',
  'no signup',
  'auto-saves',
  'pdf export',
  '5 templates',
  'paper-warm',
  'made local',
  'instant preview',
  'free forever',
] as const;

const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

export function Marquee() {
  return (
    <div className="border-y-2 border-cocoa/15 bg-cream2/60 overflow-hidden py-4">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {TRACK.map((t, i) => (
          <span
            key={i}
            className="font-[family-name:var(--font-hand)] text-3xl text-olive flex items-center gap-12"
          >
            {t}
            <Star className="w-5 h-5" color="#C77D7D" />
          </span>
        ))}
      </div>
    </div>
  );
}
