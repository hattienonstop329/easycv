import { ResumeData } from '@/lib/types';
import { styleVarsFor } from '@/lib/design-tokens';
import { MD } from '@/lib/markdown';
import { effectiveSender } from './_shared';

export function CascadeLetter({ data }: { data: ResumeData }) {
  const c = data.customization;
  const l = data.letter;
  const sender = effectiveSender(data);

  return (
    <div
      style={{
        ...styleVarsFor(c),
        minHeight: '100%',
        display: 'grid',
        gridTemplateColumns: '34% 1fr',
      }}
    >
      <aside style={{ background: 'var(--sidebar)', color: 'var(--sidebar-text)', padding: '48px 28px' }}>
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
          {sender.name || 'Your Name'}
        </h1>
        {sender.title && (
          <div style={{ opacity: 0.8, marginTop: 4, fontSize: '0.92em' }}>{sender.title}</div>
        )}

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: '0.85em',
            opacity: 0.95,
          }}
        >
          {sender.email && <div>{sender.email}</div>}
          {sender.phone && <div>{sender.phone}</div>}
          {sender.location && <div>{sender.location}</div>}
          {sender.website && <div>{sender.website}</div>}
        </div>

        {l.date && (
          <div style={{ marginTop: 32, opacity: 0.85, fontSize: '0.85em' }}>{l.date}</div>
        )}

        {(l.recipientName || l.recipientCompany || l.recipientAddress) && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontSize: '0.65em',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                opacity: 0.7,
                marginBottom: 2,
              }}
            >
              to
            </div>
            {l.recipientName && <div style={{ fontSize: '0.92em', fontWeight: 500 }}>{l.recipientName}</div>}
            {l.recipientCompany && <div style={{ fontSize: '0.85em', opacity: 0.92 }}>{l.recipientCompany}</div>}
            {l.recipientAddress && (
              <div style={{ fontSize: '0.8em', opacity: 0.78, whiteSpace: 'pre-wrap' }}>{l.recipientAddress}</div>
            )}
          </div>
        )}
      </aside>

      <main style={{ padding: '48px 36px', background: 'var(--bg)' }}>
        {l.subject && (
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              color: 'var(--accent)',
              margin: 0,
              marginBottom: 18,
              fontSize: '1.05em',
              fontWeight: 700,
              borderBottom: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
              paddingBottom: 6,
            }}
          >
            {l.subject}
          </h2>
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
          <div style={{ color: 'var(--heading)', fontWeight: 600 }}>{l.signatureName}</div>
        )}
      </main>
    </div>
  );
}
