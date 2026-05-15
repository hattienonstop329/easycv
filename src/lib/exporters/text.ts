import { ResumeData } from '../types';

const HR = '─'.repeat(60);

function joinIfTruthy(sep: string, ...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(sep);
}

function dateRange(start: string, end: string, current: boolean): string {
  if (current) return `${start || '—'} – Present`;
  if (!start && !end) return '';
  return `${start || '—'} – ${end || '—'}`;
}

export function toPlainText(data: ResumeData): string {
  const lines: string[] = [];
  const p = data.profile;

  lines.push((p.fullName || 'Your Name').toUpperCase());
  if (p.title) lines.push(p.title);
  const contact = joinIfTruthy(' · ', p.email, p.phone, p.location, p.website);
  if (contact) lines.push(contact);
  lines.push('');

  for (const s of data.sections.filter((x) => x.visible)) {
    const title = s.title.toUpperCase();
    switch (s.type) {
      case 'summary':
        if (!p.summary?.trim()) break;
        lines.push(title, HR, p.summary, '');
        break;
      case 'experience':
        if (data.experience.length === 0) break;
        lines.push(title, HR);
        for (const e of data.experience) {
          lines.push(joinIfTruthy(' · ', e.role, e.company, e.location, dateRange(e.start, e.end, e.current)));
          for (const b of e.bullets.filter(Boolean)) {
            lines.push(`  • ${b}`);
          }
          lines.push('');
        }
        break;
      case 'education':
        if (data.education.length === 0) break;
        lines.push(title, HR);
        for (const e of data.education) {
          lines.push(
            joinIfTruthy(
              ' · ',
              e.school,
              joinIfTruthy(', ', e.degree, e.field) || undefined,
              dateRange(e.start, e.end, false),
            ),
          );
          if (e.notes) lines.push(`  ${e.notes}`);
          lines.push('');
        }
        break;
      case 'skills':
        if (data.skills.length === 0) break;
        lines.push(title, HR);
        for (const g of data.skills) {
          lines.push(`${g.category}: ${g.items.map((i) => i.name).join(', ')}`);
        }
        lines.push('');
        break;
      case 'projects':
        if (data.projects.length === 0) break;
        lines.push(title, HR);
        for (const pr of data.projects) {
          lines.push(joinIfTruthy(' · ', pr.name, pr.link));
          if (pr.description) lines.push(`  ${pr.description}`);
          if (pr.tech.length > 0) lines.push(`  [${pr.tech.join(', ')}]`);
          lines.push('');
        }
        break;
      case 'languages':
        if (data.languages.length === 0) break;
        lines.push(title, HR);
        lines.push(data.languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(' · '));
        lines.push('');
        break;
      case 'certifications':
        if (data.certifications.length === 0) break;
        lines.push(title, HR);
        for (const c of data.certifications) {
          lines.push(joinIfTruthy(' · ', c.name, c.issuer, c.date));
        }
        lines.push('');
        break;
      case 'awards':
        if (data.awards.length === 0) break;
        lines.push(title, HR);
        for (const a of data.awards) {
          lines.push(joinIfTruthy(' · ', a.name, a.issuer, a.date));
          if (a.description) lines.push(`  ${a.description}`);
          lines.push('');
        }
        break;
      case 'custom': {
        const body = data.customSections[s.id]?.body?.trim();
        if (!body) break;
        lines.push(title, HR, body, '');
        break;
      }
    }
  }

  // Strip trailing empties
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n') + '\n';
}
