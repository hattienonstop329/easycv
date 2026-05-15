import { CSSProperties, ReactNode } from 'react';
import {
  ResumeData,
  Section,
  SectionType,
  SectionTypography,
  ItemOverrides,
} from '@/lib/types';
import { dateRange, joinContact, sectionHasContent } from '../shared';
import { MD } from '@/lib/markdown';
import { Dots, SkillTokens } from '../SkillTokens';
import { fontVar } from '@/lib/design-tokens';

// Translates a section's typography overrides into scoped CSS variables that
// child elements consume. Font/color overrides rebind the global vars
// (--font-head, --accent, etc.) within the section's subtree only.
export function sectionStyle(
  typography: ResumeData['customization']['typography'] | undefined,
  type: SectionType,
): { style: CSSProperties; bulletSymbol: string | null } {
  const t: SectionTypography | undefined = typography?.[type];
  const style: Record<string, string | number> = {
    marginBottom: 'var(--gap-section)',
  };
  if (!t) {
    return { style, bulletSymbol: null };
  }
  if (t.titleSize !== undefined) style['--sec-title-size'] = `${t.titleSize}em`;
  if (t.bodySize !== undefined) style['--sec-body-size'] = `${t.bodySize}em`;
  if (t.lineHeight !== undefined) style['--sec-line-height'] = String(t.lineHeight);
  if (t.itemGap !== undefined) style['--sec-item-gap'] = `${t.itemGap}px`;
  if (t.sectionGapTop !== undefined) style.marginTop = `${t.sectionGapTop}px`;
  if (t.fontHead) style['--font-head'] = fontVar(t.fontHead);
  if (t.fontBody) style['--font-body'] = fontVar(t.fontBody);
  if (t.accent) style['--accent'] = t.accent;
  if (t.heading) style['--heading'] = t.heading;
  if (t.text) style['--text'] = t.text;
  let bulletSymbol: string | null = null;
  if (t.bulletSymbol === 'none') bulletSymbol = '';
  else if (t.bulletSymbol) bulletSymbol = t.bulletSymbol;
  return { style: style as CSSProperties, bulletSymbol };
}

// Translate per-item overrides to inline styles + print CSS hints.
export function itemStyle(overrides?: ItemOverrides): CSSProperties {
  if (!overrides) return {};
  const style: Record<string, string | number> = {};
  if (overrides.fontSize !== undefined) style.fontSize = `${overrides.fontSize}em`;
  if (overrides.spaceBefore !== undefined) style.marginTop = `${overrides.spaceBefore}px`;
  if (overrides.pageBreakBefore) {
    style.breakBefore = 'page';
    style.pageBreakBefore = 'always';
  }
  if (overrides.keepTogether) {
    style.breakInside = 'avoid';
    style.pageBreakInside = 'avoid';
  }
  return style as CSSProperties;
}

// Tiny shared building blocks used across professional templates.
// Each block reads from CSS custom properties set by `styleVarsFor(customization)`
// on the template root, so colors and fonts swap in live.

export function ContactLine({ data, sep = '·' }: { data: ResumeData; sep?: string }) {
  const items = joinContact(data);
  if (items.length === 0) return null;
  return (
    <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
      {items.map((x, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 6px' }}>{sep}</span>}
          {x}
        </span>
      ))}
    </div>
  );
}

export function SectionGroup({
  title,
  children,
  titleStyle,
  containerStyle,
  panel,
  sectionType,
  data,
}: {
  title: string;
  children: ReactNode;
  titleStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  /** Which builder panel this section maps to, for click-to-edit. */
  panel?: string;
  /** When provided, per-section typography from customization.typography is applied. */
  sectionType?: SectionType;
  data?: ResumeData;
}) {
  const resolved =
    sectionType && data
      ? sectionStyle(data.customization.typography, sectionType)
      : { style: { marginBottom: 'var(--gap-section)' } as CSSProperties, bulletSymbol: null };
  return (
    <section
      data-edit-panel={panel}
      data-section-type={sectionType}
      style={{
        ...resolved.style,
        ...containerStyle,
        fontSize: 'var(--sec-body-size, 1em)',
        lineHeight: 'var(--sec-line-height, inherit)',
        fontFamily: 'var(--font-body)',
        color: 'var(--text)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-head)',
          color: 'var(--accent)',
          margin: 0,
          fontSize: 'var(--sec-title-size, 1em)',
          ...titleStyle,
        }}
      >
        {title}
      </h2>
      <div style={{ marginTop: 6 }}>{children}</div>
    </section>
  );
}

export function ExperienceList({
  data,
  accent,
  bulletSymbol,
}: {
  data: ResumeData;
  accent?: string;
  /** Optional override of the bullet glyph; falls back to native list-style. */
  bulletSymbol?: string | null;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sec-item-gap, var(--gap-item))' }}>
      {data.experience.map((e) => (
        <div key={e.id} data-edit-id={`exp:${e.id}`} style={itemStyle(e.overrides)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{e.role || 'Role'}</span>
              <span style={{ color: 'var(--muted)' }}> · {e.company || 'Company'}</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
              {dateRange(e.start, e.end, e.current)}
              {e.location ? ` · ${e.location}` : ''}
            </div>
          </div>
          {e.bullets.filter(Boolean).length > 0 && (
            <BulletList
              accent={accent}
              symbol={bulletSymbol ?? null}
              items={e.bullets.filter(Boolean)}
              keyPrefix={`exp:${e.id}.bullets`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Bullet list that honors a custom symbol. When symbol is null we use the
 * native list-style; when '' we render no marker; otherwise we prefix each
 * item with the symbol manually so it works across PDF/HTML cleanly.
 */
function BulletList({
  items,
  symbol,
  accent,
  keyPrefix,
}: {
  items: string[];
  symbol: string | null;
  accent?: string;
  keyPrefix: string;
}) {
  if (symbol === null) {
    return (
      <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
        {items.map((b, i) => (
          <li
            key={i}
            data-edit-id={`${keyPrefix}.${i}`}
            style={{ color: 'var(--text)', marginBottom: 2, ...(accent ? ({ '--marker': accent } as CSSProperties) : {}) }}
          >
            <MD>{b}</MD>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((b, i) => (
        <div
          key={i}
          data-edit-id={`${keyPrefix}.${i}`}
          style={{ color: 'var(--text)', display: 'flex', gap: 6, paddingLeft: symbol === '' ? 0 : 4 }}
        >
          {symbol !== '' && (
            <span style={{ color: accent ?? 'var(--accent)', flexShrink: 0 }} aria-hidden>
              {symbol}
            </span>
          )}
          <span style={{ flex: 1 }}>
            <MD>{b}</MD>
          </span>
        </div>
      ))}
    </div>
  );
}

export function EducationList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sec-item-gap, var(--gap-item))' }}>
      {data.education.map((e) => (
        <div
          key={e.id}
          data-edit-id={`edu:${e.id}`}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, ...itemStyle(e.overrides) }}
        >
          <div>
            <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{e.school || 'School'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.92em' }}>
              {e.degree}
              {e.field ? `, ${e.field}` : ''}
            </div>
            {e.notes && <div style={{ color: 'var(--muted)', fontSize: '0.85em', fontStyle: 'italic' }}>{e.notes}</div>}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
            {dateRange(e.start, e.end, false)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sec-item-gap, var(--gap-item))' }}>
      {data.projects.map((p) => (
        <div key={p.id} data-edit-id={`proj:${p.id}`} style={itemStyle(p.overrides)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{p.name}</span>
            {p.link && <span style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{p.link}</span>}
          </div>
          <div style={{ color: 'var(--text)' }}><MD>{p.description}</MD></div>
          {p.tech.length > 0 && (
            <div style={{ color: 'var(--muted)', fontSize: '0.82em', fontStyle: 'italic' }}>{p.tech.join(' · ')}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SkillList({ data, asTags = false }: { data: ResumeData; asTags?: boolean }) {
  if (asTags) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-item)' }}>
        {data.skills.map((g) => (
          <div key={g.id} data-edit-id={`skill:${g.id}`}>
            <div style={{ fontWeight: 600, color: 'var(--heading)', fontSize: '0.92em', marginBottom: 4 }}>
              {g.category}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {g.items.map((s, i) => (
                <span
                  key={i}
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                    color: 'var(--heading)',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: '0.82em',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {s.name}
                  {s.level && <Dots level={s.level} size={5} color="var(--accent)" />}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {data.skills.map((g) => (
        <div key={g.id} data-edit-id={`skill:${g.id}`}>
          <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{g.category}: </span>
          <span style={{ color: 'var(--text)' }}>
            <SkillTokens items={g.items} dotColor="var(--accent)" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function LanguageList({ data, oneLine = false }: { data: ResumeData; oneLine?: boolean }) {
  if (oneLine) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {data.languages.map((l) => (
          <div key={l.id}>
            <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{l.name}</span>
            {l.level && <span style={{ color: 'var(--muted)' }}> · {l.level}</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.languages.map((l) => (
        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--heading)' }}>{l.name}</span>
          {l.level && <span style={{ color: 'var(--muted)' }}>{l.level}</span>}
        </div>
      ))}
    </div>
  );
}

export function CertList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {data.certifications.map((c) => (
        <div key={c.id}>
          <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{c.name}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85em' }}>
            {c.issuer}
            {c.date ? ` · ${c.date}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AwardList({ data }: { data: ResumeData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sec-item-gap, var(--gap-item))' }}>
      {data.awards.map((a) => (
        <div key={a.id} style={itemStyle(a.overrides)}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{a.name}</span>
            {a.date && <span style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{a.date}</span>}
          </div>
          {a.issuer && <div style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{a.issuer}</div>}
          {a.description && <div style={{ color: 'var(--text)' }}><MD>{a.description}</MD></div>}
        </div>
      ))}
    </div>
  );
}

export function renderSection(s: Section, data: ResumeData, opts?: { skillTags?: boolean }) {
  if (!sectionHasContent(data, s)) return null;
  // Pre-resolve the bullet symbol for experience so ExperienceList renders it.
  const expSym = sectionStyle(data.customization.typography, 'experience').bulletSymbol ?? null;
  switch (s.type) {
    case 'summary':
      return (
        <SectionGroup key={s.id} title={s.title} panel="profile" sectionType="summary" data={data}>
          <p style={{ margin: 0, color: 'var(--text)' }}><MD>{data.profile.summary}</MD></p>
        </SectionGroup>
      );
    case 'experience':
      return (
        <SectionGroup key={s.id} title={s.title} panel="experience" sectionType="experience" data={data}>
          <ExperienceList data={data} bulletSymbol={expSym} />
        </SectionGroup>
      );
    case 'education':
      return (
        <SectionGroup key={s.id} title={s.title} panel="education" sectionType="education" data={data}>
          <EducationList data={data} />
        </SectionGroup>
      );
    case 'skills':
      return (
        <SectionGroup key={s.id} title={s.title} panel="skills" sectionType="skills" data={data}>
          <SkillList data={data} asTags={opts?.skillTags} />
        </SectionGroup>
      );
    case 'projects':
      return (
        <SectionGroup key={s.id} title={s.title} panel="projects" sectionType="projects" data={data}>
          <ProjectList data={data} />
        </SectionGroup>
      );
    case 'languages':
      return (
        <SectionGroup key={s.id} title={s.title} panel="languages" sectionType="languages" data={data}>
          <LanguageList data={data} oneLine />
        </SectionGroup>
      );
    case 'certifications':
      return (
        <SectionGroup key={s.id} title={s.title} panel="certifications" sectionType="certifications" data={data}>
          <CertList data={data} />
        </SectionGroup>
      );
    case 'awards':
      return (
        <SectionGroup key={s.id} title={s.title} panel="awards" sectionType="awards" data={data}>
          <AwardList data={data} />
        </SectionGroup>
      );
    case 'custom':
      return (
        <SectionGroup key={s.id} title={s.title} panel="sections" sectionType="custom" data={data}>
          <p style={{ margin: 0, color: 'var(--text)' }}>
            <MD>{data.customSections[s.id]?.body}</MD>
          </p>
        </SectionGroup>
      );
    default:
      return null;
  }
}
