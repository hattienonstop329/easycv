import Link from 'next/link';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Nav } from '@/components/landing/Nav';
import { Footer } from '@/components/landing/Footer';
import {
  Arrow,
  Broom,
  CodeJson,
  CoffeeCup,
  DocPdf,
  DragHandle,
  Flower,
  Heart,
  ImageIcon,
  Keyboard,
  Layers,
  Leaf,
  Letter,
  Lock,
  PaperPlane,
  Palette,
  PhotoFrame,
  Ruler,
  ShareLink,
  Sparkles,
  SplitView,
  Star,
  Target,
  TypeAa,
  Undo,
  Upload,
} from '@/components/landing/Doodles';

export const metadata: Metadata = {
  title: 'easycv — every feature, no signup',
  description:
    'The full feature list for easycv: drag-and-drop editing, per-section typography, AI rewrites, JD keyword matcher, PDF/PNG/JSON export, share links, undo/redo, PWA offline, and zero accounts. All free, all local.',
  alternates: { canonical: '/features' },
  openGraph: {
    title: 'easycv — every feature, no signup',
    description:
      'Drag-and-drop builder, AI assists, JD matcher, PDF/PNG/JSON export, fully local. Free.',
    url: '/features',
    type: 'website',
  },
};

interface Feature {
  title: string;
  body: string;
  icon: ReactNode;
}

interface FeatureGroup {
  eyebrow: string;
  title: string;
  sub: string;
  items: Feature[];
}

const GROUPS: ReadonlyArray<FeatureGroup> = [
  {
    eyebrow: 'editing',
    title: 'a real builder, not a form',
    sub: 'type on the left, watch the page bloom on the right.',
    items: [
      {
        title: 'split-view editor',
        body: 'Live A4 / Letter preview that updates as you type. No "preview" buttons, no surprises.',
        icon: <SplitView className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'drag to reorder everything',
        body: 'Sections, jobs, projects, bullets, skill groups — all drag-and-drop with @dnd-kit.',
        icon: <DragHandle className="w-12 h-12" color="#5D6E42" />,
      },
      {
        title: 'multiple resume versions',
        body: 'Keep a "design lead" version and a "frontend engineer" version side-by-side. Switch instantly.',
        icon: <Layers className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'undo / redo with shortcuts',
        body: 'Time-travel through every edit with ⌘Z / ⌘⇧Z. Zundo-powered, infinite stack.',
        icon: <Undo className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'command palette',
        body: '⌘K to jump to any section, apply a template, change a color, or trigger an export.',
        icon: <Keyboard className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'import from pdf or json',
        body: 'Drop a resume PDF and we extract profile, experience, education, skills, projects, certs, awards, languages.',
        icon: <Upload className="w-12 h-12" color="#3D4A2A" />,
      },
    ],
  },
  {
    eyebrow: 'design',
    title: 'looks that are actually yours',
    sub: 'twelve resume templates + five cover letters, every detail editable.',
    items: [
      {
        title: '12 resume templates',
        body: 'Seven professional (ATS-safe), five creative (handwritten, scrapbook, editorial).',
        icon: <Flower className="w-12 h-12" color="#C77D7D" />,
      },
      {
        title: '5 cover-letter templates',
        body: 'Pair with the matching resume — same colors, same fonts, one cohesive set.',
        icon: <Letter className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'theme presets + custom colors',
        body: 'Earth, Slate, Charcoal, Navy, Forest, Crimson, Mono, Orchid, Paper — or hand-pick every hex.',
        icon: <Palette className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'nine typefaces, paired smartly',
        body: 'Inter, Lato, Rubik, Fraunces, Lora, Playfair, JetBrains Mono, Caveat, Kalam — separate heading + body.',
        icon: <TypeAa className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'per-section format overrides',
        body: 'Title size, body size, line height, spacing, bullet symbol, font, AND color — for every section individually.',
        icon: <Ruler className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'density + paper textures',
        body: 'Compact / Comfortable / Spacious, plus plain, cream, lined, grid, dotted, or coffee-stained paper.',
        icon: <Leaf className="w-12 h-12" color="#7A8B5C" />,
      },
      {
        title: 'photo + stickers',
        body: 'Optional headshot for templates that support it, plus playful sticker layer (stars, leaves, doodles).',
        icon: <PhotoFrame className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'custom sections',
        body: 'Need "Publications" or "Conferences" or "Volunteering"? Add any heading with markdown body.',
        icon: <Star className="w-12 h-12" color="#7A8B5C" />,
      },
    ],
  },
  {
    eyebrow: 'polish',
    title: 'help that doesn\'t feel pushy',
    sub: 'opt-in assists. nothing sent anywhere without you choosing.',
    items: [
      {
        title: 'writing checks',
        body: 'Flags weak verbs, clichés, passive voice, and over-long bullets in real time. Suggests rewrites.',
        icon: <Broom className="w-12 h-12" color="#5D6E42" />,
      },
      {
        title: 'ai rewrite (your key)',
        body: 'Bring your own Anthropic API key. Stored locally, only sent to Claude when you click "rewrite".',
        icon: <Sparkles className="w-12 h-12" color="#C77D7D" />,
      },
      {
        title: 'jd keyword matcher',
        body: 'Paste a job description, get a coverage score and the keywords you\'re missing.',
        icon: <Target className="w-12 h-12" color="#5D6E42" />,
      },
      {
        title: 'completeness score',
        body: 'A friendly checklist of what\'s still missing — name, contact, summary, dates, numbers, sections.',
        icon: <Heart className="w-12 h-12" color="#C77D7D" />,
      },
      {
        title: 'diff versus old version',
        body: 'See exactly what changed between versions — word-level diff, highlighted in place.',
        icon: <Layers className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'daily writing prompt',
        body: 'A small nudge per day if you\'re stuck — a verb, an angle, a question to answer in a bullet.',
        icon: <PaperPlane className="w-12 h-12" color="#5D6E42" />,
      },
    ],
  },
  {
    eyebrow: 'export & share',
    title: 'take it everywhere',
    sub: 'print-ready PDF, ATS plain text, JSON Resume, and quick share links.',
    items: [
      {
        title: 'pdf export',
        body: 'Vector PDF via browser print — pixel-perfect, A4 or US Letter, hyperlinked email and website.',
        icon: <DocPdf className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'png snapshot',
        body: 'High-res PNG of the preview, ready for portfolio sites, Linkedin uploads, or Twitter.',
        icon: <ImageIcon className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'plain text (ats)',
        body: 'ATS-friendly .txt that strips every flourish — perfect for paste-into-Workday forms.',
        icon: <CoffeeCup className="w-12 h-12" color="#4A3F35" />,
      },
      {
        title: 'json resume + easycv backup',
        body: 'Open-standard JSON Resume export, plus easycv\'s native JSON for round-trip imports.',
        icon: <CodeJson className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'read-only share links',
        body: 'Encode the whole resume into a URL fragment. No backend, no expiry, no tracking.',
        icon: <ShareLink className="w-12 h-12" color="#3D4A2A" />,
      },
    ],
  },
  {
    eyebrow: 'privacy',
    title: 'your story, your laptop',
    sub: 'no accounts, no servers, no telemetry. ever.',
    items: [
      {
        title: 'lives in localstorage',
        body: 'Every word stays in your browser. We don\'t have a database. We couldn\'t leak your resume if we tried.',
        icon: <Lock className="w-12 h-12" color="#3D4A2A" />,
      },
      {
        title: 'works offline (pwa)',
        body: 'Install as a desktop / mobile app. Edit on a plane, on a train, in a tunnel. Syncs with… nothing.',
        icon: <Heart className="w-12 h-12" color="#C77D7D" />,
      },
      {
        title: 'no signup, no email',
        body: 'No "verify your email", no "upgrade to pro", no welcome drip campaign. Just the builder.',
        icon: <PaperPlane className="w-12 h-12" color="#5D6E42" />,
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="paper-bg min-h-screen text-cocoa">
      <Nav />

      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-12 max-w-6xl mx-auto">
        <header className="text-center mb-12 relative">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep -rotate-1 inline-block">
            the whole pantry ✿
          </span>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl text-olive-ink mt-3 font-light leading-[1.05]">
            every feature, no signup.
          </h1>
          <p className="mt-5 text-cocoa-soft max-w-2xl mx-auto leading-relaxed">
            a long list with proper icons — because you should know exactly what you’re
            getting before you start. and what you’re getting is &ldquo;all of it, free, in your browser.&rdquo;
          </p>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
            <Arrow className="w-16 h-12 rotate-90" color="#7A8B5C" />
          </div>
        </header>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto space-y-20">
        {GROUPS.map((g) => (
          <FeatureSection key={g.title} group={g} />
        ))}

        <div className="text-center pt-8">
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-olive-ink text-paper px-8 py-4 rounded-full text-lg font-medium hover:bg-olive transition scribble-shadow"
          >
            start building →
          </Link>
          <div className="mt-4 text-xs text-cocoa-soft">
            no signup. no card. your draft is yours.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureSection({ group }: { group: FeatureGroup }) {
  return (
    <section>
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.25em] text-strawberry-deep">
          {group.eyebrow}
        </div>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-olive-ink font-light mt-1">
          {group.title}
        </h2>
        <p className="text-sm text-cocoa-soft italic mt-1 max-w-2xl">{group.sub}</p>
        <div className="mt-4 h-px bg-cocoa/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {group.items.map((f) => (
          <FeatureCard key={f.title} feature={f} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="bg-white border border-cocoa/15 rounded-2xl p-6 soft-shadow hover:-translate-y-1 transition-transform">
      <div className="mb-4 inline-flex p-2 rounded-xl bg-cream2/70 border border-cocoa/10">
        {feature.icon}
      </div>
      <h3 className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-tight">
        {feature.title}
      </h3>
      <p className="text-sm text-cocoa-soft leading-relaxed mt-2">{feature.body}</p>
    </article>
  );
}
