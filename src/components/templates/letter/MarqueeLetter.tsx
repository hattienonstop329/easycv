import { ResumeData } from '@/lib/types';
import { styleVarsFor } from '@/lib/design-tokens';
import { MD } from '@/lib/markdown';
import { effectiveSender } from './_shared';

export function MarqueeLetter({ data }: { data: ResumeData }) {
  const c = data.customization;
  const l = data.letter;
  const sender = effectiveSender(data);

  return (
    <div style={{ ...styleVarsFor(c), padding: '64px 72px', minHeight: '100%' }}>
      <header
        style={{
          borderBottom: '1px solid color-mix(in srgb, var(--heading) 25%, transparent)',
          paddingBottom: 24,
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '3.4em',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {sender.name || 'Your Name'}
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 12,
            marginTop: 12,
            flexWrap: 'wrap',
          }}
        >
          {sender.title && (
            <div
              style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-head)',
                fontStyle: 'italic',
                fontSize: '1.1em',
              }}
            >
              {sender.title}
            </div>
          )}
          <div
            style={{
              color: 'var(--muted)',
              fontSize: '0.85em',
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {sender.email && <span>{sender.email}</span>}
            {sender.phone && <span>{sender.phone}</span>}
            {sender.location && <span>{sender.location}</span>}
          </div>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 28,
        }}
      >
        <div>
          {l.date && <div style={{ color: 'var(--muted)', marginBottom: 12, fontSize: '0.9em' }}>{l.date}</div>}
          {l.subject && (
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontStyle: 'italic',
                color: 'var(--accent)',
                marginTop: 4,
              }}
            >
              {l.subject}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {l.recipientName && <div style={{ color: 'var(--heading)', fontWeight: 500 }}>{l.recipientName}</div>}
          {l.recipientCompany && <div style={{ color: 'var(--text)' }}>{l.recipientCompany}</div>}
          {l.recipientAddress && (
            <div style={{ color: 'var(--muted)', fontSize: '0.9em', whiteSpace: 'pre-wrap' }}>
              {l.recipientAddress}
            </div>
          )}
        </div>
      </div>

      {l.salutation && (
        <div style={{ color: 'var(--heading)', marginBottom: 14, fontFamily: 'var(--font-head)', fontStyle: 'italic', fontSize: '1.05em' }}>
          {l.salutation}
        </div>
      )}

      <div
        style={{
          color: 'var(--text)',
          whiteSpace: 'pre-wrap',
          lineHeight: 'var(--line-height)',
          marginBottom: 28,
        }}
      >
        <MD>{l.body}</MD>
      </div>

      {l.closing && (
        <div style={{ color: 'var(--text)', marginBottom: 36, fontStyle: 'italic' }}>
          {l.closing}
        </div>
      )}
      {l.signatureName && (
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: '1.6em',
            color: 'var(--heading)',
            letterSpacing: '-0.01em',
          }}
        >
          {l.signatureName}
        </div>
      )}
    </div>
  );
}
