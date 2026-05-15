import { ResumeData, Section } from '@/lib/types';
import { dateRange, sectionHasContent, TemplateProps, visibleSections } from '../shared';

export function EditorialTemplate({ data }: TemplateProps) {
  const sections = visibleSections(data);
  return (
    <div
      className="w-full h-full text-cocoa font-[family-name:var(--font-sans)]"
      style={{ backgroundColor: '#FBF8F1', padding: '56px 64px' }}
    >
      <header className="border-b-[3px] border-olive-ink pb-6 mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-7xl leading-[0.85] text-olive-ink font-light tracking-tight">
              {(data.profile.fullName || 'Your Name').split(' ').map((part, i, arr) => (
                <span key={i} className="block">
                  {part}
                  {i === arr.length - 1 ? <span className="text-strawberry-deep">.</span> : ''}
                </span>
              ))}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.4em] text-cocoa-soft">
              {data.profile.title}
            </div>
            <div className="text-xs text-cocoa-soft mt-3 space-y-0.5">
              {data.profile.email && <div>{data.profile.email}</div>}
              {data.profile.phone && <div>{data.profile.phone}</div>}
              {data.profile.location && <div>{data.profile.location}</div>}
              {data.profile.website && <div>{data.profile.website}</div>}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-7">
          {sections.map((s) => sectionHasContent(data, s) && <SectionBlock key={s.id} section={s} data={data} />)}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-3">
      <div className="col-span-3">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-strawberry-deep font-bold">
          {children}
        </h2>
      </div>
      <div className="col-span-9 border-t border-olive-ink/30 mt-2.5" />
    </div>
  );
}

function ColumnedRow({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">{left}</div>
      <div className="col-span-9">{right}</div>
    </div>
  );
}

function SectionBlock({ section, data }: { section: Section; data: ResumeData }) {
  switch (section.type) {
    case 'summary':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <ColumnedRow
            left={<div className="text-xs italic text-cocoa-soft">a short note</div>}
            right={
              <p className="font-[family-name:var(--font-serif)] text-lg leading-snug text-olive-ink font-light">
                {data.profile.summary}
              </p>
            }
          />
        </section>
      );
    case 'experience':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <ColumnedRow
                key={e.id}
                left={
                  <div>
                    <div className="text-xs text-cocoa-soft">{dateRange(e.start, e.end, e.current)}</div>
                    {e.location && <div className="text-xs italic text-cocoa-soft">{e.location}</div>}
                  </div>
                }
                right={
                  <div>
                    <div className="font-[family-name:var(--font-serif)] text-xl text-olive-ink leading-tight">
                      {e.role}
                    </div>
                    <div className="text-sm text-cocoa-soft uppercase tracking-wide">{e.company}</div>
                    {e.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1 text-sm text-cocoa space-y-0.5 marker:text-strawberry-deep ml-4 list-disc">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </section>
      );
    case 'education':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-3">
            {data.education.map((e) => (
              <ColumnedRow
                key={e.id}
                left={<div className="text-xs text-cocoa-soft">{dateRange(e.start, e.end, false)}</div>}
                right={
                  <div>
                    <div className="font-[family-name:var(--font-serif)] text-lg text-olive-ink">{e.school}</div>
                    <div className="text-sm text-cocoa-soft">
                      {e.degree}
                      {e.field ? `, ${e.field}` : ''}
                    </div>
                    {e.notes && <div className="text-xs italic text-cocoa-soft mt-0.5">{e.notes}</div>}
                  </div>
                }
              />
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
              <ColumnedRow
                key={g.id}
                left={<div className="text-xs text-cocoa-soft uppercase tracking-wide">{g.category}</div>}
                right={<div className="text-sm text-cocoa">{g.items.map((i) => i.name).join(' · ')}</div>}
              />
            ))}
          </div>
        </section>
      );
    case 'projects':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-3">
            {data.projects.map((p) => (
              <ColumnedRow
                key={p.id}
                left={
                  <div>
                    {p.tech.length > 0 && <div className="text-xs italic text-cocoa-soft">{p.tech.join(' · ')}</div>}
                  </div>
                }
                right={
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-[family-name:var(--font-serif)] text-lg text-olive-ink">{p.name}</span>
                      {p.link && <span className="text-xs text-cocoa-soft">{p.link}</span>}
                    </div>
                    <div className="text-sm text-cocoa">{p.description}</div>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      );
    case 'languages':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <ColumnedRow
            left={<div className="text-xs italic text-cocoa-soft">spoken</div>}
            right={
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {data.languages.map((l) => (
                  <div key={l.id}>
                    <span className="font-medium text-olive-ink">{l.name}</span>
                    {l.level && <span className="text-cocoa-soft"> · {l.level}</span>}
                  </div>
                ))}
              </div>
            }
          />
        </section>
      );
    case 'certifications':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-1.5">
            {data.certifications.map((c) => (
              <ColumnedRow
                key={c.id}
                left={<div className="text-xs text-cocoa-soft">{c.date}</div>}
                right={
                  <div className="text-sm">
                    <span className="font-medium text-olive-ink">{c.name}</span>
                    {c.issuer && <span className="text-cocoa-soft"> — {c.issuer}</span>}
                  </div>
                }
              />
            ))}
          </div>
        </section>
      );
    case 'awards':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-2">
            {data.awards.map((a) => (
              <ColumnedRow
                key={a.id}
                left={<div className="text-xs text-cocoa-soft">{a.date}</div>}
                right={
                  <div>
                    <div className="font-[family-name:var(--font-serif)] text-base text-olive-ink">{a.name}</div>
                    {a.issuer && <div className="text-xs text-cocoa-soft">{a.issuer}</div>}
                    {a.description && <div className="text-sm text-cocoa">{a.description}</div>}
                  </div>
                }
              />
            ))}
          </div>
        </section>
      );
    case 'custom':
      return (
        <section>
          <SectionTitle>{section.title}</SectionTitle>
          <ColumnedRow
            left={<div className="text-xs italic text-cocoa-soft">{/* spacer */}</div>}
            right={
              <p className="text-sm leading-snug text-cocoa whitespace-pre-wrap">
                {data.customSections[section.id]?.body}
              </p>
            }
          />
        </section>
      );
  }
  return null;
}
