import { ResumeData, Section } from '@/lib/types';
import { dateRange, sectionHasContent, TemplateProps, visibleSections } from '../shared';

export function MatchaTemplate({ data }: TemplateProps) {
  const sidebarTypes = new Set(['skills', 'languages', 'certifications']);
  const sections = visibleSections(data);
  const sidebar = sections.filter((s) => sidebarTypes.has(s.type));
  const main = sections.filter((s) => !sidebarTypes.has(s.type));

  return (
    <div
      className="w-full h-full grid grid-cols-[34%_66%] text-cocoa font-[family-name:var(--font-sans)]"
      style={{ backgroundColor: '#FBF8F1' }}
    >
      <aside style={{ backgroundColor: '#3D4A2A' }} className="text-paper p-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl leading-tight">
            {data.profile.fullName || 'Your Name'}
          </h1>
          <div className="text-sm opacity-80 mt-1">{data.profile.title}</div>
        </div>

        <div className="space-y-1.5 text-xs opacity-90 mb-8">
          {data.profile.email && <div>{data.profile.email}</div>}
          {data.profile.phone && <div>{data.profile.phone}</div>}
          {data.profile.location && <div>{data.profile.location}</div>}
          {data.profile.website && <div>{data.profile.website}</div>}
        </div>

        <div className="space-y-6">
          {sidebar.map(
            (s) => sectionHasContent(data, s) && <SidebarSection key={s.id} section={s} data={data} />,
          )}
        </div>
      </aside>

      <main className="p-8">
        <div className="space-y-6">
          {main.map(
            (s) => sectionHasContent(data, s) && <MainSection key={s.id} section={s} data={data} />,
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 opacity-90">
      {children}
    </h3>
  );
}

function SidebarSection({ section, data }: { section: Section; data: ResumeData }) {
  switch (section.type) {
    case 'skills':
      return (
        <section>
          <SidebarTitle>{section.title}</SidebarTitle>
          <div className="space-y-2 text-xs">
            {data.skills.map((g) => (
              <div key={g.id}>
                <div className="font-bold opacity-100">{g.category}</div>
                <div className="opacity-75">{g.items.map((i) => i.name).join(' · ')}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'languages':
      return (
        <section>
          <SidebarTitle>{section.title}</SidebarTitle>
          <div className="space-y-1 text-xs">
            {data.languages.map((l) => (
              <div key={l.id} className="flex justify-between">
                <span>{l.name}</span>
                <span className="opacity-70">{l.level}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'certifications':
      return (
        <section>
          <SidebarTitle>{section.title}</SidebarTitle>
          <div className="space-y-1.5 text-xs">
            {data.certifications.map((c) => (
              <div key={c.id}>
                <div className="font-medium">{c.name}</div>
                <div className="opacity-70">
                  {c.issuer}
                  {c.date ? ` · ${c.date}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
  }
  return null;
}

function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-matcha-deep mb-3 border-b border-matcha/40 pb-1">
      {children}
    </h2>
  );
}

function MainSection({ section, data }: { section: Section; data: ResumeData }) {
  switch (section.type) {
    case 'summary':
      return (
        <section>
          <MainTitle>{section.title}</MainTitle>
          <p className="text-sm leading-relaxed text-cocoa">{data.profile.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section>
          <MainTitle>{section.title}</MainTitle>
          <div className="space-y-3.5">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-olive-ink">{e.role}</span>
                    <span className="text-cocoa-soft"> — {e.company}</span>
                  </div>
                  <div className="text-xs text-cocoa-soft">{dateRange(e.start, e.end, e.current)}</div>
                </div>
                {e.location && <div className="text-xs text-cocoa-soft italic">{e.location}</div>}
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 ml-4 list-disc text-sm text-cocoa space-y-0.5 marker:text-matcha-deep">
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
          <MainTitle>{section.title}</MainTitle>
          <div className="space-y-2">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold text-olive-ink">{e.school}</div>
                  <div className="text-sm text-cocoa">
                    {e.degree}
                    {e.field ? `, ${e.field}` : ''}
                  </div>
                  {e.notes && <div className="text-xs text-cocoa-soft italic">{e.notes}</div>}
                </div>
                <div className="text-xs text-cocoa-soft">{dateRange(e.start, e.end, false)}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'projects':
      return (
        <section>
          <MainTitle>{section.title}</MainTitle>
          <div className="space-y-2.5">
            {data.projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-olive-ink">{p.name}</span>
                  {p.link && <span className="text-xs text-cocoa-soft">{p.link}</span>}
                </div>
                <div className="text-sm text-cocoa">{p.description}</div>
                {p.tech.length > 0 && (
                  <div className="text-xs text-matcha-deep mt-0.5">{p.tech.join(' · ')}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    case 'awards':
      return (
        <section>
          <MainTitle>{section.title}</MainTitle>
          <div className="space-y-1.5">
            {data.awards.map((a) => (
              <div key={a.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-olive-ink">{a.name}</span>
                  <span className="text-xs text-cocoa-soft">{a.date}</span>
                </div>
                {a.issuer && <div className="text-xs text-cocoa-soft">{a.issuer}</div>}
                {a.description && <div className="text-sm text-cocoa">{a.description}</div>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'custom':
      return (
        <section>
          <MainTitle>{section.title}</MainTitle>
          <p className="text-sm leading-relaxed text-cocoa whitespace-pre-wrap">
            {data.customSections[section.id]?.body}
          </p>
        </section>
      );
  }
  return null;
}
