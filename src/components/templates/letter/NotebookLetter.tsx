import { ResumeData } from '@/lib/types';
import { effectiveSender } from './_shared';

export function NotebookLetter({ data }: { data: ResumeData }) {
  const l = data.letter;
  const sender = effectiveSender(data);

  return (
    <div
      className="text-cocoa font-[family-name:var(--font-sans)]"
      style={{
        backgroundColor: '#F6F1E8',
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(122, 139, 92, 0.18) 28px)',
        padding: '56px 64px',
        minHeight: '100%',
      }}
    >
      <header className="mb-8 pb-4 border-b-2 border-dashed border-matcha/40">
        <div className="font-[family-name:var(--font-serif)] text-4xl font-light text-olive-ink leading-none">
          {sender.name || 'Your Name'}
        </div>
        {sender.title && (
          <div className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep mt-1">
            {sender.title}
          </div>
        )}
        <div className="mt-3 text-xs text-cocoa-soft tracking-wide flex flex-wrap gap-x-3 gap-y-1">
          {sender.email && <span>{sender.email}</span>}
          {sender.phone && <span>· {sender.phone}</span>}
          {sender.location && <span>· {sender.location}</span>}
          {sender.website && <span>· {sender.website}</span>}
        </div>
      </header>

      {l.date && (
        <div className="font-[family-name:var(--font-hand)] text-xl text-cocoa-soft mb-5 -rotate-1 inline-block">
          {l.date}
        </div>
      )}

      {(l.recipientName || l.recipientCompany || l.recipientAddress) && (
        <div className="mb-6 leading-relaxed">
          {l.recipientName && <div className="text-olive-ink font-medium">{l.recipientName}</div>}
          {l.recipientCompany && <div className="text-cocoa">{l.recipientCompany}</div>}
          {l.recipientAddress && (
            <div className="text-cocoa-soft text-sm whitespace-pre-wrap">{l.recipientAddress}</div>
          )}
        </div>
      )}

      {l.subject && (
        <div className="font-[family-name:var(--font-hand)] text-2xl text-matcha-deep mb-4">
          <span
            className="squiggle"
          >
            {l.subject}
          </span>
        </div>
      )}

      {l.salutation && (
        <div className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink mb-4">
          {l.salutation}
        </div>
      )}

      <div className="text-cocoa text-sm leading-relaxed whitespace-pre-wrap mb-8">
        {l.body}
      </div>

      {l.closing && (
        <div className="font-[family-name:var(--font-hand)] text-2xl text-cocoa mb-4">
          {l.closing}
        </div>
      )}

      {l.signatureName && (
        <div className="font-[family-name:var(--font-hand)] text-4xl text-olive-ink italic">
          {l.signatureName}
        </div>
      )}
    </div>
  );
}
