import Link from 'next/link';
import { LetterTemplateId, TemplateId } from '@/lib/types';
import { TEMPLATE_REGISTRY } from '@/lib/design-tokens';
import { LETTER_TEMPLATES } from '@/components/templates/letter';
import { LetterThumbnail, TemplateThumbnail } from './TemplateThumbnail';
import { Arrow, Heart, PaperPlane, Spiral, Star } from './Doodles';

// Cycle through these for visual variety on a long card grid.
const ROTATIONS = [
  '-rotate-[2deg]',
  'rotate-[1.5deg]',
  '-rotate-[1deg]',
  'rotate-[2.5deg]',
  '-rotate-[1.5deg]',
  'rotate-[1deg]',
];
const TAPES = [
  'bg-strawberry/70',
  'bg-matcha/60',
  'bg-cream2',
  'bg-stone/70',
  'bg-strawberry/55',
  'bg-matcha/45',
];

const FAVE_RESUME: TemplateId = 'onyx';
const FAVE_LETTER: LetterTemplateId = 'marquee-letter';

// How many cards we preview on the home page. The full set lives on /templates.
const HOME_PRO_COUNT = 3;
const HOME_CREATIVE_COUNT = 3;
const HOME_LETTER_COUNT = 2;

export function TemplateGallery() {
  const professional = TEMPLATE_REGISTRY
    .filter((t) => t.category === 'professional')
    .slice(0, HOME_PRO_COUNT);
  const creative = TEMPLATE_REGISTRY
    .filter((t) => t.category === 'creative')
    .slice(0, HOME_CREATIVE_COUNT);
  const letters = LETTER_TEMPLATES.slice(0, HOME_LETTER_COUNT);

  const totalResumes = TEMPLATE_REGISTRY.length;
  const totalLetters = LETTER_TEMPLATES.length;

  return (
    <section
      id="templates"
      className="px-6 md:px-12 py-24 dotted-bg border-y-2 border-cocoa/10 relative overflow-hidden"
    >
      <Star className="absolute top-12 right-[8%] w-12 h-12 wobble" color="#7A8B5C" />
      <Heart className="absolute bottom-20 left-[6%] w-6 h-6 float-slow" />
      <Spiral className="absolute bottom-[40%] right-[4%] w-10 h-10" color="#C77D7D" />

      <div className="max-w-6xl mx-auto relative">
        <header className="text-center mb-16 relative">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep rotate-1 inline-block">
            a taste of the gallery ✦
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl text-olive-ink mt-3 font-light">
            pick your paper.
          </h2>
          <p className="mt-4 text-cocoa-soft max-w-xl mx-auto">
            a quick peek — {totalResumes} resume looks and {totalLetters} matching cover letters
            live in the full gallery. switch any time, your data follows you.
          </p>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
            <Arrow className="w-16 h-12 rotate-90" color="#7A8B5C" />
          </div>
        </header>

        <Subheader
          eyebrow="for the recruiter"
          title="professional"
          sub="ATS-safe layouts that recruiters expect — minimal, executive, sidebar, technical."
        />
        <Grid>
          {professional.map((t, i) => (
            <ResumeCard
              key={t.id}
              id={t.id}
              name={t.name}
              tag={t.tag}
              styleIndex={i}
              badge={t.id === FAVE_RESUME ? '★ recommended' : undefined}
            />
          ))}
        </Grid>

        <Subheader
          eyebrow="for the personality"
          title="creative"
          sub="for designers, writers, and anyone who scribbles in the margins."
          spacingClass="mt-20"
        />
        <Grid>
          {creative.map((t, i) => (
            <ResumeCard
              key={t.id}
              id={t.id}
              name={t.name}
              tag={t.tag}
              styleIndex={i + HOME_PRO_COUNT}
            />
          ))}
        </Grid>

        <Subheader
          eyebrow="the application package"
          title="cover letters"
          sub="each letter pairs with a resume — same colors, same fonts."
          spacingClass="mt-20"
        />
        <Grid>
          {letters.map((t, i) => (
            <LetterCard
              key={t.id}
              id={t.id as LetterTemplateId}
              name={t.name.replace(' Letter', '')}
              tag={t.tag}
              styleIndex={i + HOME_PRO_COUNT + HOME_CREATIVE_COUNT}
              badge={t.id === FAVE_LETTER ? '★ pairs with Marquee' : undefined}
            />
          ))}
          <BlankCard />
        </Grid>

        <div className="mt-20 text-center space-y-3">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 bg-olive-ink text-paper px-8 py-4 rounded-full text-lg font-medium hover:bg-olive transition scribble-shadow"
          >
            see all {totalResumes + totalLetters} templates
            <span>→</span>
          </Link>
          <div className="text-xs text-cocoa-soft">
            previews are real, not mockups — every card renders the actual template.
          </div>
        </div>
      </div>
    </section>
  );
}

function Subheader({
  eyebrow,
  title,
  sub,
  spacingClass = '',
}: {
  eyebrow: string;
  title: string;
  sub: string;
  spacingClass?: string;
}) {
  return (
    <div className={`mb-8 ${spacingClass}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-strawberry-deep">
            {eyebrow}
          </div>
          <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-olive-ink font-light mt-1">
            {title}
          </h3>
        </div>
        <p className="text-sm text-cocoa-soft italic max-w-md">{sub}</p>
      </div>
      <div className="mt-4 h-px bg-cocoa/10" />
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
      {children}
    </div>
  );
}

function ResumeCard({
  id,
  name,
  tag,
  styleIndex,
  badge,
}: {
  id: TemplateId;
  name: string;
  tag: string;
  styleIndex: number;
  badge?: string;
}) {
  const rotate = ROTATIONS[styleIndex % ROTATIONS.length];
  const tape = TAPES[styleIndex % TAPES.length];
  return (
    <Link
      href={`/builder?template=${id}`}
      className={`group relative block ${rotate} hover:rotate-0 hover:-translate-y-1 transition-transform duration-300`}
    >
      <span
        aria-hidden
        className={`absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 ${tape} z-20 rotate-[-3deg]`}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      />
      <div className="bg-white p-2.5 border border-cocoa/15 rounded-sm soft-shadow relative">
        <TemplateThumbnail template={id} />
        {badge && (
          <span className="absolute -top-3 -right-3 bg-strawberry-deep text-paper text-[10px] font-medium px-2 py-1 rounded-full rotate-6 z-30 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      <CardLabel name={name} tag={tag} />
    </Link>
  );
}

function LetterCard({
  id,
  name,
  tag,
  styleIndex,
  badge,
}: {
  id: LetterTemplateId;
  name: string;
  tag: string;
  styleIndex: number;
  badge?: string;
}) {
  const rotate = ROTATIONS[styleIndex % ROTATIONS.length];
  const tape = TAPES[styleIndex % TAPES.length];
  return (
    <Link
      href={`/builder?template=onyx`}
      className={`group relative block ${rotate} hover:rotate-0 hover:-translate-y-1 transition-transform duration-300`}
      title={`${name} cover letter`}
    >
      <span
        aria-hidden
        className={`absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 ${tape} z-20 rotate-[-3deg]`}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      />
      {/* "letter" corner ribbon so users can tell it apart from the resume cards */}
      <span className="absolute -top-2 -left-2 z-30 bg-matcha-deep text-paper text-[9px] uppercase tracking-widest px-2 py-1 rounded -rotate-12 shadow-md">
        letter
      </span>
      <div className="bg-white p-2.5 border border-cocoa/15 rounded-sm soft-shadow relative">
        <LetterThumbnail template={id} />
        {badge && (
          <span className="absolute -top-3 -right-3 bg-strawberry-deep text-paper text-[10px] font-medium px-2 py-1 rounded-full rotate-6 z-30 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      <CardLabel name={name} tag={tag} />
    </Link>
  );
}

function CardLabel({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="mt-4 px-1">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-none">
          {name}
        </h3>
        <span className="font-[family-name:var(--font-hand)] text-strawberry-deep opacity-0 group-hover:opacity-100 transition translate-x-0 group-hover:translate-x-1 text-lg">
          pick →
        </span>
      </div>
      <div className="text-[10px] text-cocoa-soft mt-1 tracking-widest uppercase">
        {tag}
      </div>
    </div>
  );
}

function BlankCard() {
  return (
    <Link
      href="/builder"
      className="group relative block rotate-[1deg] hover:rotate-0 hover:-translate-y-1 transition-transform duration-300"
    >
      <span
        aria-hidden
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-matcha/50 z-20 rotate-[3deg]"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      />
      <div className="bg-cream border-2 border-dashed border-cocoa/30 p-2.5 rounded-sm soft-shadow">
        <div className="aspect-square w-full bg-cream flex flex-col items-center justify-center text-center">
          <PaperPlane className="w-10 h-10 mb-2" color="#5D6E42" />
          <div className="font-[family-name:var(--font-hand)] text-3xl text-olive-ink leading-none">
            a blank page
          </div>
          <p className="text-xs text-cocoa-soft mt-2 max-w-[20ch] px-4">
            no sample data. just you and the cursor.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 bg-olive-ink text-paper px-3.5 py-1.5 rounded-full text-xs font-medium scribble-shadow">
            start fresh →
          </div>
        </div>
      </div>
      <CardLabel name="(blank)" tag="your own canvas" />
    </Link>
  );
}
