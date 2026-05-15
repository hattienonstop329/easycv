import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { renderSection } from './_blocks';

const RIGHT_TYPES = new Set(['skills', 'languages', 'certifications', 'awards']);

export function Enfold({ data }: TemplateProps) {
  const c = data.customization;
  const sections = visibleSections(data);
  const aside = sections.filter((s) => RIGHT_TYPES.has(s.type));
  const main = sections.filter((s) => !RIGHT_TYPES.has(s.type));

  return (
    <div style={{ ...styleVarsFor(c), padding: '40px 44px', minHeight: '100%' }}>
      <header style={{ marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '2.4em',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
          }}
        >
          {data.profile.fullName || 'Your Name'}
        </h1>
        {data.profile.title && (
          <div style={{ color: 'var(--accent)', marginTop: 4, fontWeight: 500 }}>{data.profile.title}</div>
        )}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            color: 'var(--muted)',
            marginTop: 8,
            fontSize: '0.9em',
          }}
        >
          {data.profile.email && <span>{data.profile.email}</span>}
          {data.profile.phone && <span>{data.profile.phone}</span>}
          {data.profile.location && <span>{data.profile.location}</span>}
          {data.profile.website && <span>{data.profile.website}</span>}
        </div>
        <div
          style={{
            background: 'var(--accent)',
            height: 3,
            width: 60,
            marginTop: 14,
            borderRadius: 2,
          }}
        />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 32%', gap: 28 }}>
        <main>{main.map((s) => renderSection(s, data))}</main>
        <aside style={{ borderLeft: '1px solid color-mix(in srgb, var(--text) 12%, transparent)', paddingLeft: 18 }}>
          {aside.map((s) => renderSection(s, data, { skillTags: true }))}
        </aside>
      </div>

      <style>{`
        h2 { font-size: 0.78em; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; color: var(--accent); margin-bottom: 6px; }
      `}</style>
    </div>
  );
}
