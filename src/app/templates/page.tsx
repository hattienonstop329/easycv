import Link from 'next/link';
import type { Metadata } from 'next';
import { TEMPLATE_REGISTRY } from '@/lib/design-tokens';
import { ResumePreview } from '@/components/templates';
import { DEFAULT_RESUME, TemplateId } from '@/lib/types';
import { Nav } from '@/components/landing/Nav';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'easycv — 12 free resume templates',
  description:
    'Twelve free resume templates from minimalist ATS-safe layouts to handwritten scrapbook designs. Pick one and start in your browser — no signup, no cloud, no email.',
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'easycv — 12 free resume templates',
    description:
      'Twelve free resume templates from minimalist ATS-safe layouts to handwritten scrapbook designs.',
    url: '/templates',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'easycv — 12 free resume templates',
    description:
      'Twelve free resume templates: modern, classic, technical, executive, creative.',
  },
};

export default function TemplatesPage() {
  const professional = TEMPLATE_REGISTRY.filter((t) => t.category === 'professional');
  const creative = TEMPLATE_REGISTRY.filter((t) => t.category === 'creative');

  return (
    <main className="paper-bg min-h-screen text-cocoa">
      <Nav />

      <section className="px-6 md:px-12 py-16 md:py-24 max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep -rotate-1 inline-block">
            twelve flavours ✦
          </span>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl text-olive-ink mt-3 font-light">
            free resume templates.
          </h1>
          <p className="mt-4 text-cocoa-soft max-w-xl mx-auto leading-relaxed">
            seven professional + five creative. all of them free, all of them yours,
            all of them fully editable in your browser. no signup, no cloud.
          </p>
        </header>

        <Section title="professional" sub="ATS-safe layouts that recruiters expect" templates={professional} />
        <Section
          title="creative"
          sub="for designers, writers, and anyone who scribbles in margins"
          templates={creative}
        />

        <div className="mt-16 text-center">
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-olive-ink text-paper px-8 py-4 rounded-full text-lg font-medium hover:bg-olive transition scribble-shadow"
          >
            start with any of them
            <span>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Section({
  title,
  sub,
  templates,
}: {
  title: string;
  sub: string;
  templates: typeof TEMPLATE_REGISTRY;
}) {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl text-olive-ink font-light">
          {title}
        </h2>
        <p className="text-sm text-cocoa-soft italic">{sub}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <TemplateCard key={t.id} id={t.id} name={t.name} tag={t.tag} />
        ))}
      </div>
    </section>
  );
}

function TemplateCard({ id, name, tag }: { id: TemplateId; name: string; tag: string }) {
  return (
    <Link
      href={`/builder?template=${id}`}
      className="group bg-white border border-cocoa/15 rounded-2xl overflow-hidden soft-shadow hover:-translate-y-1 transition-transform"
    >
      <div className="thumb-shell aspect-[4/5]">
        <div className="thumb-page">
          <ResumePreview data={{ ...DEFAULT_RESUME, template: id }} />
        </div>
      </div>
      <div className="p-4 border-t border-cocoa/10">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-[family-name:var(--font-serif)] text-xl text-olive-ink">{name}</h3>
          <span className="text-xs text-strawberry-deep group-hover:translate-x-1 transition opacity-0 group-hover:opacity-100">
            use →
          </span>
        </div>
        <div className="text-[11px] text-cocoa-soft uppercase tracking-widest mt-1">{tag}</div>
      </div>
    </Link>
  );
}
