import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { renderSection } from './_blocks';

export function Marquee({ data }: TemplateProps) {
  const c = data.customization;
  return (
    <div style={{ ...styleVarsFor(c), padding: '60px 64px', minHeight: '100%' }}>
      <header style={{ marginBottom: 28, borderBottom: '1px solid color-mix(in srgb, var(--heading) 25%, transparent)', paddingBottom: 22 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '4em',
            lineHeight: 1,
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          {data.profile.fullName || 'Your Name'}
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 12,
            marginTop: 14,
            flexWrap: 'wrap',
          }}
        >
          {data.profile.title && (
            <div
              style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-head)',
                fontStyle: 'italic',
                fontSize: '1.2em',
              }}
            >
              {data.profile.title}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              gap: 14,
              color: 'var(--muted)',
              fontSize: '0.85em',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {data.profile.email && <span>{data.profile.email}</span>}
            {data.profile.phone && <span>{data.profile.phone}</span>}
            {data.profile.location && <span>{data.profile.location}</span>}
            {data.profile.website && <span>{data.profile.website}</span>}
          </div>
        </div>
      </header>
      {visibleSections(data).map((s) => renderSection(s, data))}

      <style>{`
        h2 {
          font-family: var(--font-head);
          font-size: 0.78em;
          text-transform: uppercase;
          letter-spacing: 0.32em;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 10px;
          position: relative;
          padding-left: 18px;
        }
        h2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 12px;
          height: 1px;
          background: var(--accent);
        }
      `}</style>
    </div>
  );
}
