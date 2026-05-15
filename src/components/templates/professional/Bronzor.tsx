import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { ContactLine, renderSection } from './_blocks';

export function Bronzor({ data }: TemplateProps) {
  const c = data.customization;
  return (
    <div style={{ ...styleVarsFor(c), padding: '56px 64px', minHeight: '100%' }}>
      <header style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '2.6em',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          {data.profile.fullName || 'Your Name'}
        </h1>
        {data.profile.title && (
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontStyle: 'italic',
              color: 'var(--accent)',
              marginTop: 4,
              fontSize: '1.1em',
            }}
          >
            {data.profile.title}
          </div>
        )}
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
          <ContactLine data={data} sep="·" />
        </div>
        <div style={{ borderTop: '2px solid var(--heading)', marginTop: 14, opacity: 0.9 }} />
      </header>
      {visibleSections(data).map((s) => renderSection(s, data))}

      <style>{`
        h2 {
          font-family: var(--font-head);
          font-size: 0.95em;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-weight: 600;
          text-align: center;
          margin-bottom: 8px;
          color: var(--heading);
        }
      `}</style>
    </div>
  );
}
