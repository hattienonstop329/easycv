import { ReactNode } from 'react';
import { CoffeeCup, Flower, PaperPlane, Spiral } from './Doodles';

const NOTES: ReadonlyArray<{ title: string; body: string; color: string; rotate: string; icon: ReactNode }> = [
  {
    title: 'split-view editor',
    body: 'Type on the left. Watch your resume bloom on the right. No "preview" buttons, no surprises.',
    color: 'bg-cream2',
    rotate: '-rotate-2',
    icon: <PaperPlane className="w-10 h-10" />,
  },
  {
    title: 'drag to reorder',
    body: 'Sections, jobs, projects, bullets — everything snaps into place with a satisfying nudge.',
    color: 'bg-strawberry/40',
    rotate: 'rotate-1',
    icon: <Spiral className="w-10 h-10" color="#5D6E42" />,
  },
  {
    title: 'five soulful templates',
    body: 'From notebook scribbles to clean editorial. Switch any time without losing a word.',
    color: 'bg-matcha/30',
    rotate: '-rotate-1',
    icon: <Flower className="w-10 h-10" />,
  },
  {
    title: 'lives on your laptop',
    body: 'No accounts, no servers, no telemetry. Your story stays in your browser, period.',
    color: 'bg-stone/50',
    rotate: 'rotate-2',
    icon: <CoffeeCup className="w-10 h-10" />,
  },
];

export function Features() {
  return (
    <section id="why" className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep -rotate-1 inline-block">
            what makes it nice ✿
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl text-olive-ink mt-3 font-light">
            a builder, not a form.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {NOTES.map((n) => (
            <div
              key={n.title}
              className={`${n.color} ${n.rotate} p-8 rounded-2xl border border-cocoa/10 soft-shadow hover:rotate-0 transition-transform duration-300`}
            >
              <div className="mb-4">{n.icon}</div>
              <h3 className="font-[family-name:var(--font-hand)] text-3xl text-olive-ink mb-2">
                {n.title}
              </h3>
              <p className="text-cocoa-soft leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
