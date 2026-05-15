import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { dateRange, sectionHasContent } from '../shared';
import { ResumeData, Section } from '@/lib/types';
import { MD } from '@/lib/markdown';

export function Mono({ data }: TemplateProps) {
  const c = data.customization;
  return (
    <div
      style={{
        ...styleVarsFor(c),
        padding: '48px 56px',
        minHeight: '100%',
        fontFamily: 'var(--font-body)',
      }}
    >
      <header style={{ marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '2em',
            fontWeight: 700,
          }}
        >
          {data.profile.fullName || 'your_name'}
        </h1>
        {data.profile.title && (
          <div style={{ color: 'var(--muted)', marginTop: 2, fontFamily: 'var(--font-head)' }}>
            {'// '}{data.profile.title}
          </div>
        )}
        <div style={{ marginTop: 10, color: 'var(--text)', fontFamily: 'var(--font-head)', fontSize: '0.85em' }}>
          {data.profile.email && <span>{data.profile.email}  </span>}
          {data.profile.phone && <span>{data.profile.phone}  </span>}
          {data.profile.location && <span>{data.profile.location}  </span>}
          {data.profile.website && <span>{data.profile.website}</span>}
        </div>
      </header>

      <div>{visibleSections(data).map((s) => <SectionBlock key={s.id} s={s} data={data} />)}</div>
    </div>
  );
}

function SectionBlock({ s, data }: { s: Section; data: ResumeData }) {
  if (!sectionHasContent(data, s)) return null;
  return (
    <section style={{ marginBottom: 'var(--gap-section)' }}>
      <h2
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: '0.95em',
          color: 'var(--accent)',
          margin: 0,
          marginBottom: 6,
        }}
      >
        ## {s.title}
      </h2>
      <Body s={s} data={data} />
    </section>
  );
}

function Body({ s, data }: { s: Section; data: ResumeData }) {
  switch (s.type) {
    case 'summary':
      return <p style={{ margin: 0, color: 'var(--text)' }}><MD>{data.profile.summary}</MD></p>;
    case 'experience':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
          {data.experience.map((e) => (
            <div key={e.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{e.role}</span>
                  <span style={{ color: 'var(--muted)' }}> @ {e.company}</span>
                </div>
                <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.85em' }}>
                  {dateRange(e.start, e.end, e.current)}
                </div>
              </div>
              {e.location && (
                <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.82em' }}>
                  {e.location}
                </div>
              )}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 18 }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ color: 'var(--text)' }}>
                      <span style={{ fontFamily: 'var(--font-head)', color: 'var(--accent)' }}>→ </span>
                      <MD>{b}</MD>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    case 'education':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.education.map((e) => (
            <div key={e.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{e.school}</span>
                <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.85em' }}>
                  {dateRange(e.start, e.end, false)}
                </span>
              </div>
              <div style={{ color: 'var(--muted)' }}>
                {e.degree}
                {e.field ? `, ${e.field}` : ''}
              </div>
              {e.notes && <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{e.notes}</div>}
            </div>
          ))}
        </div>
      );
    case 'skills':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.skills.map((g) => (
            <div key={g.id}>
              <span style={{ fontFamily: 'var(--font-head)', color: 'var(--accent)' }}>{g.category}/</span>
              <span style={{ color: 'var(--text)' }}> {g.items.map((i) => i.name).join(', ')}</span>
            </div>
          ))}
        </div>
      );
    case 'projects':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
          {data.projects.map((p) => (
            <div key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{p.name}</span>
                {p.link && (
                  <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.85em' }}>
                    ↗ {p.link}
                  </span>
                )}
              </div>
              <div style={{ color: 'var(--text)' }}><MD>{p.description}</MD></div>
              {p.tech.length > 0 && (
                <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.82em' }}>
                  [{p.tech.join(', ')}]
                </div>
              )}
            </div>
          ))}
        </div>
      );
    case 'languages':
      return (
        <div style={{ color: 'var(--text)' }}>
          {data.languages.map((l, i) => (
            <span key={l.id}>
              {i > 0 && ' · '}
              <span style={{ color: 'var(--heading)' }}>{l.name}</span>
              {l.level && <span style={{ color: 'var(--muted)' }}> ({l.level})</span>}
            </span>
          ))}
        </div>
      );
    case 'certifications':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <span style={{ color: 'var(--heading)' }}>{c.name}</span>
                {c.issuer && <span style={{ color: 'var(--muted)' }}> · {c.issuer}</span>}
              </span>
              <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.85em' }}>{c.date}</span>
            </div>
          ))}
        </div>
      );
    case 'awards':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.awards.map((a) => (
            <div key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{a.name}</span>
                <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)', fontSize: '0.85em' }}>
                  {a.date}
                </span>
              </div>
              {a.issuer && <div style={{ color: 'var(--muted)' }}>{a.issuer}</div>}
              {a.description && <div style={{ color: 'var(--text)' }}>{a.description}</div>}
            </div>
          ))}
        </div>
      );
    case 'custom':
      return (
        <p style={{ margin: 0, color: 'var(--text)' }}>
          <MD>{data.customSections[s.id]?.body}</MD>
        </p>
      );
    default:
      return null;
  }
}
