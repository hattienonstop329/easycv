import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { renderSection, SkillList, LanguageList, CertList } from './_blocks';

const SIDEBAR_TYPES = new Set(['skills', 'languages', 'certifications']);

export function Cascade({ data }: TemplateProps) {
  const c = data.customization;
  const sections = visibleSections(data);
  const sidebar = sections.filter((s) => SIDEBAR_TYPES.has(s.type));
  const main = sections.filter((s) => !SIDEBAR_TYPES.has(s.type));

  return (
    <div
      style={{
        ...styleVarsFor(c),
        minHeight: '100%',
        display: 'grid',
        gridTemplateColumns: '34% 1fr',
      }}
    >
      <aside style={{ background: 'var(--sidebar)', color: 'var(--sidebar-text)', padding: '40px 28px' }}>
        {c.showPhoto && c.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.photo}
            alt=""
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 16,
              border: '3px solid color-mix(in srgb, var(--sidebar-text) 30%, transparent)',
            }}
          />
        )}
        <h1
          style={{
            margin: 0,
            color: 'var(--sidebar-text)',
            fontFamily: 'var(--font-head)',
            fontSize: '1.8em',
            lineHeight: 1.05,
            fontWeight: 700,
          }}
        >
          {data.profile.fullName || 'Your Name'}
        </h1>
        {data.profile.title && (
          <div style={{ opacity: 0.8, marginTop: 4, fontSize: '0.92em' }}>{data.profile.title}</div>
        )}

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85em', opacity: 0.95 }}>
          {data.profile.email && <div>{data.profile.email}</div>}
          {data.profile.phone && <div>{data.profile.phone}</div>}
          {data.profile.location && <div>{data.profile.location}</div>}
          {data.profile.website && <div>{data.profile.website}</div>}
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {sidebar.map((s) => (
            <div key={s.id}>
              <h3
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '0.7em',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  margin: 0,
                  marginBottom: 6,
                  color: 'var(--sidebar-text)',
                  opacity: 0.95,
                  borderBottom: '1px solid color-mix(in srgb, var(--sidebar-text) 25%, transparent)',
                  paddingBottom: 4,
                }}
              >
                {s.title}
              </h3>
              <div style={{ color: 'var(--sidebar-text)', opacity: 0.92, fontSize: '0.88em' }}>
                {s.type === 'skills' && <SidebarSkills data={data} />}
                {s.type === 'languages' && <LanguageList data={data} />}
                {s.type === 'certifications' && <SidebarCerts data={data} />}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main style={{ padding: '40px 36px', background: 'var(--bg)' }}>
        {main.map((s) => renderSection(s, data))}
      </main>

      <style>{`
        h2 { font-size: 0.82em; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; border-bottom: 1px solid color-mix(in srgb, var(--accent) 35%, transparent); padding-bottom: 4px; margin-bottom: 8px; }
      `}</style>
    </div>
  );
}

function SidebarSkills({ data }: TemplateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.skills.map((g) => (
        <div key={g.id}>
          <div style={{ fontWeight: 600 }}>{g.category}</div>
          <div style={{ opacity: 0.8 }}>{g.items.map((i) => i.name).join(' · ')}</div>
        </div>
      ))}
    </div>
  );
}

function SidebarCerts({ data }: TemplateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.certifications.map((c) => (
        <div key={c.id}>
          <div style={{ fontWeight: 600 }}>{c.name}</div>
          <div style={{ opacity: 0.75 }}>
            {c.issuer}
            {c.date ? ` · ${c.date}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

// Re-export to silence unused import warnings
void CertList;
void SkillList;
