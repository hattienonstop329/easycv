'use client';

import { useMemo } from 'react';
import { useResume } from '@/lib/store';
import { LetterTemplateId } from '@/lib/types';
import { LETTER_TEMPLATES } from '@/components/templates/letter';
import { FieldRow, Input, Textarea } from '../controls/Field';
import { lintResume, readingLevel, wordCount } from '@/lib/writing-checks';

export function LetterPanel() {
  const data = useResume((s) => s.data);
  const letter = data.letter;
  const update = useResume((s) => s.updateLetter);
  const setTpl = useResume((s) => s.setLetterTemplate);
  const letterIssues = useMemo(
    () => lintResume(data).filter((i) => i.location.panel === 'letter'),
    [data],
  );
  const reading = useMemo(() => readingLevel(letter.body), [letter.body]);
  const bodyWords = wordCount(letter.body);

  return (
    <div className="space-y-6">
      <div className="text-xs text-cocoa-soft leading-relaxed">
        a cover letter that ships with your resume — same colors, fonts, and exports. when
        the &ldquo;use sender from profile&rdquo; box is checked, the letter pulls your name and
        contact from the resume so you don&apos;t double-type.
      </div>

      <Block title="template">
        <div className="grid grid-cols-3 gap-2">
          {LETTER_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTpl(t.id as LetterTemplateId)}
              className={`text-left px-2.5 py-2 rounded-xl border transition ${
                letter.template === t.id
                  ? 'border-olive-ink bg-cream2 text-olive-ink'
                  : 'border-cocoa/15 hover:bg-cream2 text-cocoa-soft'
              }`}
            >
              <div className="text-sm font-medium">{t.name.replace(' Letter', '')}</div>
              <div className="text-[10px] text-cocoa-soft mt-0.5 leading-tight">{t.tag}</div>
            </button>
          ))}
        </div>
      </Block>

      <Block title="recipient">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="recipient name">
              <Input
                value={letter.recipientName}
                onChange={(e) => update({ recipientName: e.target.value })}
                placeholder="Hiring Team"
              />
            </FieldRow>
            <FieldRow label="company">
              <Input
                value={letter.recipientCompany}
                onChange={(e) => update({ recipientCompany: e.target.value })}
                placeholder="Marigold Studio"
              />
            </FieldRow>
          </div>
          <FieldRow label="address (optional)">
            <Textarea
              value={letter.recipientAddress}
              onChange={(e) => update({ recipientAddress: e.target.value })}
              placeholder="120 Oak Lane, Brooklyn, NY"
              className="min-h-[44px]"
            />
          </FieldRow>
          <FieldRow label="date">
            <Input
              value={letter.date}
              onChange={(e) => update({ date: e.target.value })}
              placeholder="May 14, 2026"
            />
          </FieldRow>
        </div>
      </Block>

      <Block title="message">
        <div className="space-y-3">
          <FieldRow label="subject (optional)">
            <Input
              value={letter.subject}
              onChange={(e) => update({ subject: e.target.value })}
              placeholder="Re: Senior Product Designer"
            />
          </FieldRow>
          <FieldRow label="salutation">
            <Input
              value={letter.salutation}
              onChange={(e) => update({ salutation: e.target.value })}
              placeholder="Dear Marigold team,"
            />
          </FieldRow>
          <FieldRow label="body">
            <Textarea
              value={letter.body}
              onChange={(e) => update({ body: e.target.value })}
              placeholder="Three or four short paragraphs. Lead with the role and the why. Tell one specific story about your impact. Close with what you'd love to do next."
              className="min-h-[220px]"
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-cocoa-soft mt-1">
              <span>supports **bold**, *italic*, and [links](https://example.com).</span>
              {bodyWords > 0 && <span>{bodyWords} words</span>}
              {reading && (
                <span>
                  · grade {reading.grade.toFixed(1)} ·{' '}
                  <span
                    className={
                      reading.tone === 'easy'
                        ? 'text-matcha-deep'
                        : reading.tone === 'hard'
                          ? 'text-strawberry-deep'
                          : 'text-cocoa-soft'
                    }
                  >
                    {reading.label}
                  </span>
                </span>
              )}
            </div>
            {letterIssues.length > 0 && (
              <div className="mt-2 bg-strawberry/10 border border-strawberry/25 rounded-xl p-2.5 text-xs">
                <div className="text-[10px] uppercase tracking-widest text-strawberry-deep mb-1">
                  polish — {letterIssues.length} suggestion{letterIssues.length === 1 ? '' : 's'}
                </div>
                <ul className="space-y-0.5">
                  {letterIssues.slice(0, 4).map((i, idx) => (
                    <li key={idx} className="text-cocoa">
                      <span className="text-strawberry-deep">·</span> {i.message}
                    </li>
                  ))}
                  {letterIssues.length > 4 && (
                    <li className="text-cocoa-soft italic">
                      + {letterIssues.length - 4} more in the polish panel
                    </li>
                  )}
                </ul>
              </div>
            )}
          </FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="closing">
              <Input
                value={letter.closing}
                onChange={(e) => update({ closing: e.target.value })}
                placeholder="Warmly,"
              />
            </FieldRow>
            <FieldRow label="signature name">
              <Input
                value={letter.signatureName}
                onChange={(e) => update({ signatureName: e.target.value })}
                placeholder="Aria Hollis"
              />
            </FieldRow>
          </div>
        </div>
      </Block>

      <Block title="sender">
        <label className="flex items-center gap-2 text-sm text-cocoa-soft cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={!letter.overrideSender}
            onChange={(e) => update({ overrideSender: !e.target.checked })}
            className="accent-matcha-deep"
          />
          use sender from profile
        </label>
        {letter.overrideSender && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="name">
                <Input
                  value={letter.senderName}
                  onChange={(e) => update({ senderName: e.target.value })}
                  placeholder="Aria Hollis"
                />
              </FieldRow>
              <FieldRow label="title">
                <Input
                  value={letter.senderTitle}
                  onChange={(e) => update({ senderTitle: e.target.value })}
                  placeholder="Senior Product Designer"
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="email">
                <Input
                  value={letter.senderEmail}
                  onChange={(e) => update({ senderEmail: e.target.value })}
                  placeholder="aria@easycv.app"
                />
              </FieldRow>
              <FieldRow label="phone">
                <Input
                  value={letter.senderPhone}
                  onChange={(e) => update({ senderPhone: e.target.value })}
                  placeholder="+1 …"
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="location">
                <Input
                  value={letter.senderLocation}
                  onChange={(e) => update({ senderLocation: e.target.value })}
                  placeholder="Brooklyn, NY"
                />
              </FieldRow>
              <FieldRow label="website">
                <Input
                  value={letter.senderWebsite}
                  onChange={(e) => update({ senderWebsite: e.target.value })}
                  placeholder="you.studio"
                />
              </FieldRow>
            </div>
          </div>
        )}
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-hand)] text-xl text-olive-ink mb-3 leading-none">{title}</div>
      {children}
    </div>
  );
}
