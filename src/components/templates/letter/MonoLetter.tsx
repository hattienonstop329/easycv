import { ResumeData } from '@/lib/types';
import { styleVarsFor } from '@/lib/design-tokens';
import { MD } from '@/lib/markdown';
import { effectiveSender } from './_shared';

export function MonoLetter({ data }: { data: ResumeData }) {
  const c = data.customization;
  const l = data.letter;
  const sender = effectiveSender(data);

  return (
    <div style={{ ...styleVarsFor(c), padding: '56px 64px', minHeight: '100%' }}>
      <header style={{ marginBottom: 22 }}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            margin: 0,
            color: 'var(--heading)',
            fontSize: '1.7em',
            fontWeight: 700,
          }}
        >
          {sender.name || 'your_name'}
        </h1>
        {sender.title && (
          <div
            style={{
              fontFamily: 'var(--font-head)',
              color: 'var(--muted)',
              marginTop: 2,
            }}
          >
            // {sender.title}
          </div>
        )}
        <div
          style={{
            marginTop: 10,
            color: 'var(--text)',
            fontFamily: 'var(--font-head)',
            fontSize: '0.85em',
          }}
        >
          {sender.email && <span>{sender.email}  </span>}
          {sender.phone && <span>{sender.phone}  </span>}
          {sender.location && <span>{sender.location}  </span>}
          {sender.website && <span>{sender.website}</span>}
        </div>
        <div
          style={{
            borderTop: '1px dashed color-mix(in srgb, var(--accent) 50%, transparent)',
            marginTop: 14,
          }}
        />
      </header>

      {l.date && (
        <div
          style={{
            color: 'var(--muted)',
            fontFamily: 'var(--font-head)',
            fontSize: '0.85em',
            marginBottom: 16,
          }}
        >
          # {l.date}
        </div>
      )}

      {(l.recipientName || l.recipientCompany || l.recipientAddress) && (
        <div
          style={{
            background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
            border: '1px dashed color-mix(in srgb, var(--accent) 30%, transparent)',
            padding: '10px 12px',
            borderRadius: 4,
            marginBottom: 18,
            fontFamily: 'var(--font-head)',
            fontSize: '0.88em',
          }}
        >
          <div style={{ color: 'var(--muted)' }}>to:</div>
          {l.recipientName && <div style={{ color: 'var(--heading)' }}>{l.recipientName}</div>}
          {l.recipientCompany && <div style={{ color: 'var(--text)' }}>{l.recipientCompany}</div>}
          {l.recipientAddress && (
            <div style={{ color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{l.recipientAddress}</div>
          )}
        </div>
      )}

      {l.subject && (
        <div
          style={{
            color: 'var(--accent)',
            fontFamily: 'var(--font-head)',
            marginBottom: 14,
            fontWeight: 600,
          }}
        >
          ## {l.subject}
        </div>
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

      {l.closing && (
        <div style={{ color: 'var(--text)', marginBottom: 22, fontFamily: 'var(--font-head)' }}>
          {l.closing}
        </div>
      )}
      {l.signatureName && (
        <div
          style={{
            color: 'var(--heading)',
            fontWeight: 600,
            fontFamily: 'var(--font-head)',
          }}
        >
          — {l.signatureName}
        </div>
      )}
    </div>
  );
}
