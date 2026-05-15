import { ResumeData, Section } from '@/lib/types';
import { dateRange, sectionHasContent, TemplateProps, visibleSections } from '../shared';

export function PolaroidTemplate({ data }: TemplateProps) {
  const sections = visibleSections(data);
  return (
    <div
      className="w-full h-full text-cocoa font-[family-name:var(--font-sans)] relative overflow-hidden"
      style={{
        backgroundColor: '#FBF8F1',
        backgroundImage: 'radial-gradient(rgba(74, 63, 53, 0.15) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        padding: '48px 48px',
      }}
    >
      {/* Header polaroid */}
      <header className="bg-paper border border-cocoa/20 p-4 -rotate-1 mb-8 relative inline-block w-full max-w-md soft-shadow">
        <div
          className="absolute -top-3 left-12 w-20 h-5"
          style={{ backgroundColor: 'rgba(232, 165, 165, 0.7)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        />
        <h1 className="font-[family-name:var(--font-hand)] text-5xl text-olive-ink leading-none">
          {data.profile.fullName || 'Your Name'}
        </h1>
        <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep mt-1">
          {data.profile.title} ✦
        </div>
        <div className="mt-2 text-xs text-cocoa-soft flex flex-wrap gap-x-2 gap-y-0.5">
          {data.profile.email && <span>{data.profile.email}</span>}
          {data.profile.phone && <span>· {data.profile.phone}</span>}
          {data.profile.location && <span>· {data.profile.location}</span>}
          {data.profile.website && <span>· {data.profile.website}</span>}
        </div>
      </header>

      <div className="space-y-5">
        {sections.map((s) => sectionHasContent(data, s) && <SectionBlock key={s.id} section={s} data={data} />)}
      </div>
    </div>
  );
}

const tagColors = [
  { bg: 'bg-matcha/40', text: 'text-olive-ink' },
  { bg: 'bg-strawberry/40', text: 'text-cocoa' },
  { bg: 'bg-stone/60', text: 'text-cocoa' },
  { bg: 'bg-cream2', text: 'text-olive-ink' },
];

function StickerLabel({ children, idx = 0 }: { children: React.ReactNode; idx?: number }) {
  const c = tagColors[idx % tagColors.length];
  return (
    <span
      className={`inline-block ${c.bg} ${c.text} px-2 py-0.5 rounded font-[family-name:var(--font-hand)] text-xl -rotate-1`}
    >
      {children}
    </span>
  );
}

function SectionBlock({ section, data }: { section: Section; data: ResumeData }) {
  const idx = ['summary', 'experience', 'projects', 'education', 'skills', 'languages', 'awards', 'certifications'].indexOf(
    section.type,
  );
  switch (section.type) {
    case 'summary':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <p className="mt-2 text-sm leading-relaxed text-cocoa">{data.profile.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 space-y-3">
            {data.experience.map((e, i) => (
              <div
                key={e.id}
                className={`bg-paper border border-cocoa/15 rounded-lg p-3 ${i % 2 === 0 ? 'rotate-[0.4deg]' : '-rotate-[0.4deg]'}`}
              >
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium text-olive-ink">{e.role}</span>
                    <span className="text-cocoa-soft text-sm"> · {e.company}</span>
                  </div>
                  <div className="text-xs text-cocoa-soft">{dateRange(e.start, e.end, e.current)}</div>
                </div>
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 ml-4 list-disc text-sm text-cocoa space-y-0.5 marker:text-strawberry-deep">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    case 'projects':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {data.projects.map((p, i) => (
              <div
                key={p.id}
                className={`bg-paper border border-cocoa/20 rounded-lg p-3 soft-shadow ${i % 2 === 0 ? '-rotate-[0.6deg]' : 'rotate-[0.6deg]'}`}
              >
                <div className="font-medium text-olive-ink">{p.name}</div>
                {p.link && <div className="text-xs text-strawberry-deep">{p.link}</div>}
                <div className="text-sm text-cocoa mt-1">{p.description}</div>
                {p.tech.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {p.tech.map((t) => (
                      <span key={t} className="text-[10px] bg-matcha/30 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    case 'education':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 space-y-2">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between items-baseline">
                <div>
                  <div className="font-medium text-olive-ink">{e.school}</div>
                  <div className="text-sm text-cocoa-soft">
                    {e.degree}
                    {e.field ? `, ${e.field}` : ''}
                  </div>
                  {e.notes && <div className="text-xs italic text-cocoa-soft">{e.notes}</div>}
                </div>
                <div className="text-xs text-cocoa-soft">{dateRange(e.start, e.end, false)}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'skills':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 space-y-2">
            {data.skills.map((g) => (
              <div key={g.id}>
                <div className="text-xs font-bold text-olive-ink uppercase tracking-wider">{g.category}</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {g.items.map((s, i) => (
                    <span key={i} className="bg-cream2 border border-cocoa/15 px-2 py-0.5 rounded-full text-xs">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'languages':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {data.languages.map((l) => (
              <div key={l.id}>
                <span className="font-medium text-olive-ink">{l.name}</span>
                {l.level && <span className="text-cocoa-soft"> — {l.level}</span>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'awards':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 space-y-1.5">
            {data.awards.map((a) => (
              <div key={a.id} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-olive-ink">{a.name}</span>
                  <span className="text-xs text-cocoa-soft">{a.date}</span>
                </div>
                {a.issuer && <div className="text-xs text-cocoa-soft">{a.issuer}</div>}
                {a.description && <div className="text-cocoa">{a.description}</div>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'certifications':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <div className="mt-2 space-y-1">
            {data.certifications.map((c) => (
              <div key={c.id} className="text-sm flex justify-between">
                <span>
                  <span className="font-medium text-olive-ink">{c.name}</span>
                  {c.issuer && <span className="text-cocoa-soft"> · {c.issuer}</span>}
                </span>
                <span className="text-xs text-cocoa-soft">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'custom':
      return (
        <section>
          <StickerLabel idx={idx}>{section.title}</StickerLabel>
          <p className="mt-2 text-sm leading-relaxed text-cocoa whitespace-pre-wrap">
            {data.customSections[section.id]?.body}
          </p>
        </section>
      );
  }
  return null;
}
