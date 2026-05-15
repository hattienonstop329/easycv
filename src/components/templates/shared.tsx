import { ResumeData, Section } from '@/lib/types';

export function visibleSections(data: ResumeData): Section[] {
  return data.sections.filter((s) => s.visible);
}

export function sectionHasContent(data: ResumeData, s: Section): boolean {
  switch (s.type) {
    case 'summary':
      return Boolean(data.profile.summary?.trim());
    case 'experience':
      return data.experience.length > 0;
    case 'education':
      return data.education.length > 0;
    case 'skills':
      return data.skills.length > 0;
    case 'projects':
      return data.projects.length > 0;
    case 'certifications':
      return data.certifications.length > 0;
    case 'languages':
      return data.languages.length > 0;
    case 'awards':
      return data.awards.length > 0;
    case 'custom':
      return Boolean(data.customSections[s.id]?.body?.trim());
    default:
      return false;
  }
}

export function dateRange(start: string, end: string, current: boolean): string {
  if (current) return `${start || '—'} — Present`;
  if (!start && !end) return '';
  return `${start || '—'} — ${end || '—'}`;
}

export interface TemplateProps {
  data: ResumeData;
}

export function joinContact(data: ResumeData): string[] {
  const p = data.profile;
  return [p.email, p.phone, p.location, p.website].filter(Boolean);
}
