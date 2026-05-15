import { ResumeData, Section } from '@/lib/types';
import { dateRange, sectionHasContent, TemplateProps, visibleSections } from '../shared';

export function MinimalinkTemplate({ data }: TemplateProps) {
  const sections = visibleSections(data);
  return (
    <div
      className="w-full h-full text-cocoa font-mono text-sm"
      style={{ backgroundColor: '#FBF8F1', padding: '64px 72px' }}
    >
      <header className="mb-6">
        <h1 className="text-3xl text-olive-ink lowercase">{data.profile.fullName || 'your name'}</h1>
        <div className="text-sm text-cocoa-soft lowercase mt-0.5">{data.profile.title}</div>
        <div className="text-xs text-cocoa-soft mt-2 flex flex-wrap gap-x-3 gap-y-0.5 lowercase">
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
    <div className="border-t border-cocoa/40 pt-2 mb-2 flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.3em] text-cocoa-soft">{children}</span>
      <span className="text-cocoa-soft text-xs">─</span>
    </div>
  );
}

function SectionBlock({ section, data }: { section: Section; data: ResumeData }) {
  switch (section.type) {
    case 'summary':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-xs leading-relaxed text-cocoa">{data.profile.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-3">
            {data.experience.map((e) => (
              <div key={e.id} className="text-xs">
                <div className="flex justify-between">
                  <span>
                    <span className="text-olive-ink">{e.role.toLowerCase()}</span>
                    <span className="text-cocoa-soft"> @ {e.company.toLowerCase()}</span>
                  </span>
                  <span className="text-cocoa-soft">{dateRange(e.start, e.end, e.current).toLowerCase()}</span>
                </div>
                {e.location && <div className="text-cocoa-soft text-[10px]">{e.location.toLowerCase()}</div>}
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-cocoa">
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i}>— {b}</li>
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
          <div className="space-y-1.5">
            {data.education.map((e) => (
              <div key={e.id} className="text-xs">
                <div className="flex justify-between">
                  <span className="text-olive-ink">{e.school.toLowerCase()}</span>
                  <span className="text-cocoa-soft">{dateRange(e.start, e.end, false).toLowerCase()}</span>
                </div>
                <div className="text-cocoa-soft">
                  {e.degree.toLowerCase()}
                  {e.field ? `, ${e.field.toLowerCase()}` : ''}
                </div>
                {e.notes && <div className="text-cocoa-soft italic">{e.notes}</div>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'skills':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-1 text-xs">
            {data.skills.map((g) => (
              <div key={g.id}>
                <span className="text-olive-ink">{g.category.toLowerCase()}/</span>
                <span className="text-cocoa"> {g.items.map((i) => i.name).join(', ').toLowerCase()}</span>
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
              <div key={p.id} className="text-xs">
                <div className="flex justify-between">
                  <span className="text-olive-ink">{p.name.toLowerCase()}</span>
                  {p.link && <span className="text-cocoa-soft">↗ {p.link}</span>}
                </div>
                <div className="text-cocoa">{p.description}</div>
                {p.tech.length > 0 && (
                  <div className="text-cocoa-soft text-[10px]">[{p.tech.join(', ').toLowerCase()}]</div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    case 'languages':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="text-xs flex flex-wrap gap-x-4 gap-y-0.5">
            {data.languages.map((l) => (
              <div key={l.id}>
                <span className="text-olive-ink">{l.name.toLowerCase()}</span>
                {l.level && <span className="text-cocoa-soft"> ({l.level.toLowerCase()})</span>}
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
              <div key={a.id} className="text-xs">
                <div className="flex justify-between">
                  <span className="text-olive-ink">{a.name.toLowerCase()}</span>
                  <span className="text-cocoa-soft">{a.date}</span>
                </div>
                {a.issuer && <div className="text-cocoa-soft">{a.issuer.toLowerCase()}</div>}
                {a.description && <div className="text-cocoa">{a.description}</div>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'certifications':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="text-xs space-y-0.5">
            {data.certifications.map((c) => (
              <div key={c.id} className="flex justify-between">
                <span>
                  <span className="text-olive-ink">{c.name.toLowerCase()}</span>
                  {c.issuer && <span className="text-cocoa-soft"> · {c.issuer.toLowerCase()}</span>}
                </span>
                <span className="text-cocoa-soft">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'custom':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-xs leading-relaxed text-cocoa whitespace-pre-wrap">
            {data.customSections[section.id]?.body}
          </p>
        </section>
      );
  }
  return null;
}
