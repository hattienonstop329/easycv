import Link from 'next/link';
import { ReactNode } from 'react';
import {
  DocPdf,
  DragHandle,
  Lock,
  Palette,
  Sparkles,
  SplitView,
} from './Doodles';

const HIGHLIGHTS: ReadonlyArray<{
  title: string;
  body: string;
  color: string;
  rotate: string;
  icon: ReactNode;
}> = [
  {
    title: 'split-view editor',
    body: 'Type on the left, watch the page bloom on the right. Live A4 / Letter preview, no surprises.',
    color: 'bg-cream2',
    rotate: '-rotate-2',
    icon: <SplitView className="w-10 h-10" color="#3D4A2A" />,
  },
  {
    title: 'drag to reorder',
    body: 'Sections, jobs, projects, bullets — everything snaps into place with @dnd-kit.',
    color: 'bg-strawberry/40',
    rotate: 'rotate-1',
    icon: <DragHandle className="w-10 h-10" color="#5D6E42" />,
  },
  {
    title: 'design every detail',
    body: 'Colors, fonts, density, paper texture — plus per-section overrides for type and color.',
    color: 'bg-matcha/30',
    rotate: '-rotate-1',
    icon: <Palette className="w-10 h-10" color="#3D4A2A" />,
  },
  {
    title: 'ai when you want it',
    body: 'Bring your own Anthropic key. Polish bullets, match a JD, rewrite a section — only on click.',
    color: 'bg-stone/50',
    rotate: 'rotate-2',
    icon: <Sparkles className="w-10 h-10" color="#C77D7D" />,
  },
  {
    title: 'export anywhere',
    body: 'PDF, PNG, ATS plain text, JSON Resume — and a share-by-link URL that fits in a tweet.',
    color: 'bg-cream2',
    rotate: 'rotate-1',
    icon: <DocPdf className="w-10 h-10" color="#3D4A2A" />,
  },
  {
    title: 'lives on your laptop',
    body: 'No accounts, no servers, no telemetry. Your story stays in your browser. Works offline.',
    color: 'bg-matcha/30',
    rotate: '-rotate-2',
    icon: <Lock className="w-10 h-10" color="#3D4A2A" />,
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
          <p className="mt-4 text-cocoa-soft max-w-xl mx-auto">
            six of the favourites — there&rsquo;s a whole lot more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {HIGHLIGHTS.map((n) => (
            <div
              key={n.title}
              className={`${n.color} ${n.rotate} p-6 md:p-7 rounded-2xl border border-cocoa/10 soft-shadow hover:rotate-0 transition-transform duration-300`}
            >
              <div className="mb-3 inline-flex p-2 rounded-xl bg-paper/70 border border-cocoa/10">
                {n.icon}
              </div>
              <h3 className="font-[family-name:var(--font-hand)] text-2xl md:text-3xl text-olive-ink mb-1.5 leading-tight">
                {n.title}
              </h3>
              <p className="text-cocoa-soft leading-relaxed text-sm">{n.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-olive-ink hover:text-olive font-[family-name:var(--font-hand)] text-2xl underline decoration-strawberry-deep/40 underline-offset-4 hover:decoration-strawberry-deep transition"
          >
            see every feature <span aria-hidden>→</span>
          </Link>
          <div className="mt-2 text-xs text-cocoa-soft">~25 features, all free, no signup.</div>
        </div>
      </div>
    </section>
  );
}
