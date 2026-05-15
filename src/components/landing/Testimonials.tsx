import { Squiggle } from './Doodles';

const QUOTES = [
  {
    who: 'maya, illustrator',
    text: "finally, a resume that doesn't look like a tax form.",
    rotate: '-rotate-1',
    bg: 'bg-strawberry/30',
  },
  {
    who: 'jonas, dev',
    text: 'i made my whole CV at the airport. no internet. it just worked.',
    rotate: 'rotate-2',
    bg: 'bg-matcha/30',
  },
  {
    who: 'priya, copywriter',
    text: 'the notebook template made the recruiter ask if i hand-wrote it.',
    rotate: '-rotate-2',
    bg: 'bg-cream2',
  },
] as const;

export function Testimonials() {
  return (
    <section className="px-6 md:px-12 py-24 bg-cream2/30 border-y-2 border-cocoa/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep -rotate-1 inline-block">
            from the postbox ✉
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-5xl text-olive-ink mt-3 font-light">
            kind words.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUOTES.map((q) => (
            <div key={q.who} className={`${q.bg} ${q.rotate} p-6 rounded-2xl border border-cocoa/10 soft-shadow`}>
              <Squiggle className="w-20 h-3 mb-3" />
              <p className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-snug">
                &ldquo;{q.text}&rdquo;
              </p>
              <div className="mt-4 text-sm text-cocoa-soft">— {q.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
