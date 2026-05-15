import { ResumeData, Section } from '@/lib/types';
import { dateRange, sectionHasContent, TemplateProps, visibleSections } from '../shared';

export function NotebookTemplate({ data }: TemplateProps) {
  const sections = visibleSections(data);
  return (
    <div
      className="w-full h-full text-cocoa font-[family-name:var(--font-sans)]"
      style={{
        backgroundColor: '#F6F1E8',
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(122, 139, 92, 0.18) 28px)',
        padding: '48px 56px',
      }}
    >
      <header className="mb-6 pb-4 border-b-2 border-dashed border-matcha/40">
        <h1 className="font-[family-name:var(--font-serif)] text-5xl font-light text-olive-ink leading-none">
          {data.profile.fullName || 'Your Name'}
        </h1>
        <div className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep mt-1">
          {data.profile.title || 'your title'}
        </div>
        <div className="mt-3 text-xs text-cocoa-soft tracking-wide flex flex-wrap gap-x-3 gap-y-1">
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[family-name:var(--font-hand)] text-3xl text-matcha-deep leading-none mb-2">
      <span
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8' preserveAspectRatio='none'><path d='M2,4 Q15,1 30,4 T60,4 T90,4 T118,4' fill='none' stroke='%23C77D7D' stroke-width='2' stroke-linecap='round'/></svg>\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 100%',
          backgroundSize: '100% 8px',
          paddingBottom: '6px',
        }}
      >
        {children}
      </span>
    </h2>
  );
}

function SectionBlock({ section, data }: { section: Section; data: ResumeData }) {
  switch (section.type) {
    case 'summary':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-sm leading-relaxed text-cocoa">{data.profile.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-3">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <div>
                    <span className="font-medium text-olive-ink">{e.role || 'Role'}</span>
                    <span className="text-cocoa-soft"> · {e.company || 'Company'}</span>
                  </div>
                  <div className="text-xs text-cocoa-soft whitespace-nowrap">
                    {dateRange(e.start, e.end, e.current)}
                    {e.location ? ` · ${e.location}` : ''}
                  </div>
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
    case 'education':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-2">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between items-baseline gap-2">
                <div>
                  <div className="font-medium text-olive-ink">{e.school || 'School'}</div>
                  <div className="text-sm text-cocoa-soft">
                    {e.degree}
                    {e.field ? `, ${e.field}` : ''}
                  </div>
                  {e.notes && <div className="text-xs text-cocoa-soft italic mt-0.5">{e.notes}</div>}
                </div>
                <div className="text-xs text-cocoa-soft whitespace-nowrap">
                  {dateRange(e.start, e.end, false)}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'skills':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-1.5">
            {data.skills.map((g) => (
              <div key={g.id} className="text-sm">
                <span className="font-medium text-olive-ink">{g.category}: </span>
                <span className="text-cocoa">{g.items.map((i) => i.name).join(' · ')}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'projects':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <div className="font-medium text-olive-ink">{p.name}</div>
                  {p.link && <div className="text-xs text-cocoa-soft">{p.link}</div>}
                </div>
                <div className="text-sm text-cocoa">{p.description}</div>
                {p.tech.length > 0 && (
                  <div className="text-xs text-cocoa-soft italic">{p.tech.join(' · ')}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    case 'certifications':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-1">
            {data.certifications.map((c) => (
              <div key={c.id} className="text-sm flex justify-between">
                <span>
                  <span className="font-medium text-olive-ink">{c.name}</span>
                  {c.issuer && <span className="text-cocoa-soft"> · {c.issuer}</span>}
                </span>
                <span className="text-cocoa-soft text-xs">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'languages':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
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
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-1.5">
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
    default:
      return null;
  }
}
