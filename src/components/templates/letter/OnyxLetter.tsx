import { ResumeData } from '@/lib/types';
import { styleVarsFor } from '@/lib/design-tokens';
import { MD } from '@/lib/markdown';
import { effectiveSender } from './_shared';

export function OnyxLetter({ data }: { data: ResumeData }) {
  const c = data.customization;
  const l = data.letter;
  const sender = effectiveSender(data);

  return (
    <div style={{ ...styleVarsFor(c), padding: '64px 64px', minHeight: '100%' }}>
      <header style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '2em',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          {sender.name || 'Your Name'}
        </h1>
        {sender.title && (
          <div style={{ color: 'var(--accent)', marginTop: 4, fontWeight: 500 }}>{sender.title}</div>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            color: 'var(--muted)',
            marginTop: 8,
            fontSize: '0.85em',
          }}
        >
          {sender.email && <span>{sender.email}</span>}
          {sender.phone && <span>{sender.phone}</span>}
          {sender.location && <span>{sender.location}</span>}
          {sender.website && <span>{sender.website}</span>}
        </div>
        <hr
          style={{
            border: 0,
            borderTop: '1.5px solid var(--accent)',
            marginTop: 14,
            opacity: 0.85,
          }}
        />
      </header>

      {l.date && (
        <div style={{ color: 'var(--muted)', marginBottom: 18, fontSize: '0.92em' }}>{l.date}</div>
      )}

      {(l.recipientName || l.recipientCompany || l.recipientAddress) && (
        <div style={{ marginBottom: 22, lineHeight: 1.5 }}>
          {l.recipientName && <div style={{ color: 'var(--heading)', fontWeight: 500 }}>{l.recipientName}</div>}
          {l.recipientCompany && <div style={{ color: 'var(--text)' }}>{l.recipientCompany}</div>}
          {l.recipientAddress && <div style={{ color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{l.recipientAddress}</div>}
        </div>
      )}

      {l.subject && (
        <div style={{ marginBottom: 18, fontWeight: 600, color: 'var(--heading)' }}>{l.subject}</div>
      )}

      {l.salutation && (
        <div style={{ color: 'var(--heading)', marginBottom: 14 }}>{l.salutation}</div>
      )}

      <div
        style={{
          color: 'var(--text)',
          whiteSpace: 'pre-wrap',
          lineHeight: 'var(--line-height)',
          marginBottom: 22,
        }}
      >
        <MD>{l.body}</MD>
      </div>

      {l.closing && <div style={{ color: 'var(--text)', marginBottom: 28 }}>{l.closing}</div>}
      {l.signatureName && (
        <div style={{ color: 'var(--heading)', fontWeight: 500 }}>{l.signatureName}</div>
      )}
    </div>
  );
}
