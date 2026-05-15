import { TemplateProps, visibleSections } from '../shared';
import { styleVarsFor } from '@/lib/design-tokens';
import { ContactLine, renderSection } from './_blocks';

export function Onyx({ data }: TemplateProps) {
  const c = data.customization;
  return (
    <div style={{ ...styleVarsFor(c), padding: '52px 56px', minHeight: '100%' }}>
      <header style={{ marginBottom: 22 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '2.6em',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {data.profile.fullName || 'Your Name'}
        </h1>
        {data.profile.title && (
          <div style={{ color: 'var(--accent)', marginTop: 4, fontSize: '1.05em', fontWeight: 500 }}>
            {data.profile.title}
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <ContactLine data={data} />
        </div>
      </header>
      <hr
        style={{
          border: 0,
          borderTop: `1.5px solid var(--accent)`,
          marginBottom: 18,
          opacity: 0.85,
        }}
      />
      {visibleSections(data).map((s) => renderSection(s, data))}

      <style>{`
        h2 { font-size: 0.78em; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; }
      `}</style>
    </div>
  );
}
