import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { renderSection } from './_blocks';

export function Cubic({ data }: TemplateProps) {
  const c = data.customization;
  return (
    <div style={{ ...styleVarsFor(c), minHeight: '100%' }}>
      <header
        style={{
          background: 'var(--accent)',
          color: 'color-mix(in srgb, var(--bg) 95%, white)',
          padding: '34px 44px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            fontSize: '2.6em',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'inherit',
            lineHeight: 1.05,
          }}
        >
          {data.profile.fullName || 'Your Name'}
        </h1>
        {data.profile.title && (
          <div style={{ marginTop: 6, opacity: 0.92, fontSize: '1.05em' }}>{data.profile.title}</div>
        )}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            fontSize: '0.86em',
            opacity: 0.92,
          }}
        >
          {data.profile.email && <span>{data.profile.email}</span>}
          {data.profile.phone && <span>{data.profile.phone}</span>}
          {data.profile.location && <span>{data.profile.location}</span>}
          {data.profile.website && <span>{data.profile.website}</span>}
        </div>
      </header>

      <div style={{ padding: '32px 44px' }}>
        {visibleSections(data).map((s) => renderSection(s, data))}
      </div>

      <style>{`
        h2 {
          font-size: 0.85em;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 2px solid var(--accent);
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
