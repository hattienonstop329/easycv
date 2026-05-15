import { CSSProperties, ReactNode } from 'react';
import { ResumeData, Section } from '@/lib/types';
import { dateRange, joinContact, sectionHasContent } from '../shared';
import { MD } from '@/lib/markdown';
import { Dots, SkillTokens } from '../SkillTokens';

// Tiny shared building blocks used across professional templates.
// Each block reads from CSS custom properties set by `styleVarsFor(customization)`
// on the template root, so colors and fonts swap in live.

export function ContactLine({ data, sep = '·' }: { data: ResumeData; sep?: string }) {
  const items = joinContact(data);
  if (items.length === 0) return null;
  return (
    <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
      {items.map((x, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 6px' }}>{sep}</span>}
          {x}
        </span>
      ))}
    </div>
  );
}

export function SectionGroup({
  title,
  children,
  titleStyle,
  containerStyle,
  panel,
}: {
  title: string;
  children: ReactNode;
  titleStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  /** Which builder panel this section maps to, for click-to-edit. */
  panel?: string;
}) {
  return (
    <section
      data-edit-panel={panel}
      style={{ marginBottom: 'var(--gap-section)', ...containerStyle }}
    >
      <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--accent)', margin: 0, ...titleStyle }}>{title}</h2>
      <div style={{ marginTop: 6 }}>{children}</div>
    </section>
  );
}

export function ExperienceList({ data, accent }: { data: ResumeData; accent?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
      {data.experience.map((e) => (
        <div key={e.id} data-edit-id={`exp:${e.id}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{e.role || 'Role'}</span>
              <span style={{ color: 'var(--muted)' }}> · {e.company || 'Company'}</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
              {dateRange(e.start, e.end, e.current)}
              {e.location ? ` · ${e.location}` : ''}
            </div>
          </div>
          {e.bullets.filter(Boolean).length > 0 && (
            <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
              {e.bullets.filter(Boolean).map((b, i) => (
                <li
                  key={i}
                  data-edit-id={`exp:${e.id}.bullets.${i}`}
                  style={{ color: 'var(--text)', marginBottom: 2, ...(accent ? { '--marker': accent } as CSSProperties : {}) }}
                >
                  <MD>{b}</MD>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function EducationList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
      {data.education.map((e) => (
        <div
          key={e.id}
          data-edit-id={`edu:${e.id}`}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}
        >
          <div>
            <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{e.school || 'School'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.92em' }}>
              {e.degree}
              {e.field ? `, ${e.field}` : ''}
            </div>
            {e.notes && <div style={{ color: 'var(--muted)', fontSize: '0.85em', fontStyle: 'italic' }}>{e.notes}</div>}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
            {dateRange(e.start, e.end, false)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
      {data.projects.map((p) => (
        <div key={p.id} data-edit-id={`proj:${p.id}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{p.name}</span>
            {p.link && <span style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{p.link}</span>}
          </div>
          <div style={{ color: 'var(--text)' }}><MD>{p.description}</MD></div>
          {p.tech.length > 0 && (
            <div style={{ color: 'var(--muted)', fontSize: '0.82em', fontStyle: 'italic' }}>{p.tech.join(' · ')}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SkillList({ data, asTags = false }: { data: ResumeData; asTags?: boolean }) {
  if (asTags) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
        {data.skills.map((g) => (
          <div key={g.id} data-edit-id={`skill:${g.id}`}>
            <div style={{ fontWeight: 600, color: 'var(--heading)', fontSize: '0.92em', marginBottom: 4 }}>
              {g.category}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {g.items.map((s, i) => (
                <span
                  key={i}
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                    color: 'var(--heading)',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: '0.82em',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {s.name}
                  {s.level && <Dots level={s.level} size={5} color="var(--accent)" />}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {data.skills.map((g) => (
        <div key={g.id} data-edit-id={`skill:${g.id}`}>
          <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{g.category}: </span>
          <span style={{ color: 'var(--text)' }}>
            <SkillTokens items={g.items} dotColor="var(--accent)" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function LanguageList({ data, oneLine = false }: { data: ResumeData; oneLine?: boolean }) {
  if (oneLine) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {data.languages.map((l) => (
          <div key={l.id}>
            <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{l.name}</span>
            {l.level && <span style={{ color: 'var(--muted)' }}> · {l.level}</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.languages.map((l) => (
        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--heading)' }}>{l.name}</span>
          {l.level && <span style={{ color: 'var(--muted)' }}>{l.level}</span>}
        </div>
      ))}
    </div>
  );
}

export function CertList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {data.certifications.map((c) => (
        <div key={c.id}>
          <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{c.name}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85em' }}>
            {c.issuer}
            {c.date ? ` · ${c.date}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AwardList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
      {data.awards.map((a) => (
        <div key={a.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{a.name}</span>
            {a.date && <span style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{a.date}</span>}
          </div>
          {a.issuer && <div style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{a.issuer}</div>}
          {a.description && <div style={{ color: 'var(--text)' }}><MD>{a.description}</MD></div>}
        </div>
      ))}
    </div>
  );
}

export function renderSection(s: Section, data: ResumeData, opts?: { skillTags?: boolean }) {
  if (!sectionHasContent(data, s)) return null;
  switch (s.type) {
    case 'summary':
      return (
        <SectionGroup key={s.id} title={s.title} panel="profile">
          <p style={{ margin: 0, color: 'var(--text)' }}><MD>{data.profile.summary}</MD></p>
        </SectionGroup>
      );
    case 'experience':
      return (
        <SectionGroup key={s.id} title={s.title} panel="experience">
          <ExperienceList data={data} />
        </SectionGroup>
      );
    case 'education':
      return (
        <SectionGroup key={s.id} title={s.title} panel="education">
          <EducationList data={data} />
        </SectionGroup>
      );
    case 'skills':
      return (
        <SectionGroup key={s.id} title={s.title} panel="skills">
          <SkillList data={data} asTags={opts?.skillTags} />
        </SectionGroup>
      );
    case 'projects':
      return (
        <SectionGroup key={s.id} title={s.title} panel="projects">
          <ProjectList data={data} />
        </SectionGroup>
      );
    case 'languages':
      return (
        <SectionGroup key={s.id} title={s.title} panel="languages">
          <LanguageList data={data} oneLine />
        </SectionGroup>
      );
    case 'certifications':
      return (
        <SectionGroup key={s.id} title={s.title} panel="certifications">
          <CertList data={data} />
        </SectionGroup>
      );
    case 'awards':
      return (
        <SectionGroup key={s.id} title={s.title} panel="awards">
          <AwardList data={data} />
        </SectionGroup>
      );
    case 'custom':
      return (
        <SectionGroup key={s.id} title={s.title} panel="sections">
          <p style={{ margin: 0, color: 'var(--text)' }}>
            <MD>{data.customSections[s.id]?.body}</MD>
          </p>
        </SectionGroup>
      );
    default:
      return null;
  }
}
