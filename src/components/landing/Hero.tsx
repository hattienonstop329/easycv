import Link from 'next/link';
import {
  Arrow,
  CoffeeCup,
  Flower,
  Leaf,
  Spiral,
  Star,
  Underline,
} from './Doodles';

function FieldDemo({ label, value, multi = false }: { label: string; value: string; multi?: boolean }) {
  return (
    <div>
      <div className="text-cocoa-soft mb-1 font-[family-name:var(--font-hand)] text-sm">
        {label}
      </div>
      <div
        className={`bg-paper border border-cocoa/10 rounded-xl px-3 py-2 text-sm text-olive-ink ${
          multi ? 'min-h-[60px]' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative pt-16 md:pt-24 pb-32 px-6 md:px-12">
      <Star className="absolute top-32 left-[8%] w-10 h-10 wobble hidden md:block" color="#7A8B5C" />
      <Flower className="absolute top-48 right-[10%] w-14 h-14 float-slow hidden md:block" />
      <CoffeeCup className="absolute bottom-24 left-[12%] w-16 h-16 hidden md:block" />
      <Leaf className="absolute bottom-16 right-[18%] w-20 h-20 wobble hidden md:block" />
      <Spiral className="absolute top-40 right-[35%] w-10 h-10 hidden md:block" color="#C77D7D" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col items-center text-center">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep -rotate-2 mb-4">
            psst — no signup, no cloud, just yours ✦
          </span>
          <h1 className="font-[family-name:var(--font-serif)] text-6xl md:text-[7.5rem] leading-[0.95] font-light text-olive-ink tracking-tight">
            a resume that
            <br />
            <span className="relative inline-block">
              <span className="font-[family-name:var(--font-hand)] italic font-bold text-matcha-deep">
                feels like you
              </span>
              <Underline className="absolute -bottom-3 left-0 w-full" />
            </span>
          </h1>
          <p className="mt-10 max-w-xl text-lg md:text-xl text-cocoa-soft leading-relaxed">
            drag, drop, doodle. Five hand-picked templates with a paper-warm soul.
            Built in your browser, saved on your laptop, exported when you&apos;re ready.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/builder"
              className="group relative inline-flex items-center gap-2 bg-olive-ink text-paper px-8 py-4 rounded-full text-lg font-medium hover:bg-olive transition scribble-shadow"
            >
              start your cv
              <span className="group-hover:translate-x-1 transition">→</span>
            </Link>
            <a
              href="#templates"
              className="inline-flex items-center gap-2 text-cocoa hover:text-olive-ink transition font-[family-name:var(--font-hand)] text-2xl"
            >
              peek the templates
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-cocoa-soft">
            <span className="inline-block w-2 h-2 rounded-full bg-matcha animate-pulse" />
            100% local · no account · auto-saves to your browser
          </div>
        </div>

        <div className="mt-24 relative max-w-5xl mx-auto">
          <Arrow className="absolute -top-20 -left-8 w-32 h-20 -rotate-12 hidden md:block" color="#C77D7D" />
          <span className="absolute -top-20 left-32 font-[family-name:var(--font-hand)] text-xl text-strawberry-deep -rotate-6 hidden md:block">
            edit on the left
          </span>
          <Arrow className="absolute -top-12 -right-8 w-32 h-20 rotate-12 scale-x-[-1] hidden md:block" color="#C77D7D" />
          <span className="absolute -top-12 right-36 font-[family-name:var(--font-hand)] text-xl text-strawberry-deep rotate-6 hidden md:block">
            see it on the right!
          </span>

          <div className="rounded-3xl border-2 border-cocoa/15 bg-cream overflow-hidden soft-shadow">
            <div className="grid md:grid-cols-2 min-h-[440px]">
              <div className="p-8 border-r border-cocoa/10 bg-cream2/40">
                <div className="text-xs font-[family-name:var(--font-hand)] text-cocoa-soft uppercase tracking-widest mb-3">
                  the desk
                </div>
                <div className="space-y-3">
                  <FieldDemo label="full name" value="Aria Hollis" />
                  <FieldDemo label="title" value="Product Designer · Hand-letterer" />
                  <div className="grid grid-cols-2 gap-3">
                    <FieldDemo label="email" value="aria@easycv.app" />
                    <FieldDemo label="phone" value="+1 (415) 555-0142" />
                  </div>
                  <FieldDemo
                    label="about"
                    value="Designer with seven years building delightful, paper-warm interfaces…"
                    multi
                  />
                </div>
              </div>
              <div className="p-8 notebook-bg">
                <div className="text-xs font-[family-name:var(--font-hand)] text-cocoa-soft uppercase tracking-widest mb-3">
                  the page
                </div>
                <div>
                  <div className="font-[family-name:var(--font-serif)] text-4xl font-light text-olive-ink">
                    Aria Hollis
                  </div>
                  <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep -mt-1">
                    Product Designer · Hand-letterer
                  </div>
                  <div className="mt-2 text-xs text-cocoa-soft tracking-wide">
                    aria@easycv.app · +1 (415) 555-0142 · Brooklyn, NY
                  </div>
                  <div className="mt-6">
                    <div className="font-[family-name:var(--font-hand)] text-2xl text-matcha-deep">
                      <span className="squiggle">about</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-cocoa">
                      Designer with seven years building delightful, paper-warm interfaces.
                      I sketch first, ship second, and believe a resume should feel like a love letter.
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="font-[family-name:var(--font-hand)] text-2xl text-matcha-deep">
                      <span className="squiggle">experience</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-olive-ink">Marigold Studio · Sr. Designer</span>
                        <span className="text-cocoa-soft">2022 – Now</span>
                      </div>
                      <ul className="text-sm mt-1 ml-4 list-disc text-cocoa-soft space-y-1">
                        <li>Led the editor redesign — +18% retention.</li>
                        <li>Built a hand-drawn icon system across 4 surfaces.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 bg-strawberry text-cocoa-soft px-4 py-2 rounded-2xl rotate-3 scribble-shadow font-[family-name:var(--font-hand)] text-lg">
            live preview · auto-saves ✦
          </div>
        </div>
      </div>
    </section>
  );
}
