import {
  DEFAULT_CUSTOMIZATION,
  EMPTY_LETTER,
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillGroup,
  CertificationItem,
  LanguageItem,
  AwardItem,
} from '../types';

// JSON Resume schema (https://jsonresume.org/schema/) — partial, the fields we use.
export interface JsonResume {
  basics?: {
    name?: string;
    label?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: { address?: string; city?: string; region?: string; countryCode?: string };
    profiles?: { network: string; url: string; username?: string }[];
  };
  work?: {
    name?: string;
    position?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  education?: {
    institution?: string;
    studyType?: string;
    area?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }[];
  skills?: { name?: string; keywords?: string[]; level?: string }[];
  projects?: {
    name?: string;
    description?: string;
    url?: string;
    keywords?: string[];
    highlights?: string[];
  }[];
  certificates?: { name?: string; issuer?: string; date?: string; url?: string }[];
  languages?: { language?: string; fluency?: string }[];
  awards?: { title?: string; awarder?: string; date?: string; summary?: string }[];
}

const id = () => Math.random().toString(36).slice(2, 10);

export function toJsonResume(data: ResumeData): JsonResume {
  return {
    basics: {
      name: data.profile.fullName,
      label: data.profile.title,
      email: data.profile.email,
      phone: data.profile.phone,
      url: data.profile.website,
      summary: data.profile.summary,
      location: data.profile.location ? { address: data.profile.location } : undefined,
    },
    work: data.experience.map((e) => ({
      name: e.company,
      position: e.role,
      location: e.location,
      startDate: e.start,
      endDate: e.current ? '' : e.end,
      highlights: e.bullets.filter(Boolean),
    })),
    education: data.education.map((e) => ({
      institution: e.school,
      studyType: e.degree,
      area: e.field,
      startDate: e.start,
      endDate: e.end,
      score: e.notes,
    })),
    skills: data.skills.map((g) => ({
      name: g.category,
      keywords: g.items.map((i) => i.name),
    })),
    projects: data.projects.map((p) => ({
      name: p.name,
      description: p.description,
      url: p.link,
      keywords: p.tech,
    })),
    certificates: data.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
    })),
    languages: data.languages.map((l) => ({
      language: l.name,
      fluency: l.level,
    })),
    awards: data.awards.map((a) => ({
      title: a.name,
      awarder: a.issuer,
      date: a.date,
      summary: a.description,
    })),
  };
}

export function fromJsonResume(j: JsonResume, base?: ResumeData): ResumeData {
  const seed: ResumeData = base ?? {
    profile: { fullName: '', title: '', email: '', phone: '', location: '', website: '', summary: '' },
    sections: [
      { id: 's-summary', type: 'summary', title: 'Summary', visible: true },
      { id: 's-exp', type: 'experience', title: 'Experience', visible: true },
      { id: 's-proj', type: 'projects', title: 'Projects', visible: true },
      { id: 's-edu', type: 'education', title: 'Education', visible: true },
      { id: 's-skills', type: 'skills', title: 'Skills', visible: true },
      { id: 's-lang', type: 'languages', title: 'Languages', visible: true },
      { id: 's-cert', type: 'certifications', title: 'Certifications', visible: true },
      { id: 's-awards', type: 'awards', title: 'Awards', visible: true },
    ],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    customSections: {},
    template: 'onyx',
    customization: DEFAULT_CUSTOMIZATION,
    letter: EMPTY_LETTER,
  };

  const b = j.basics ?? {};
  const loc = b.location;
  const locStr = loc
    ? [loc.address, loc.city, loc.region, loc.countryCode].filter(Boolean).join(', ')
    : '';

  return {
    ...seed,
    profile: {
      fullName: b.name ?? '',
      title: b.label ?? '',
      email: b.email ?? '',
      phone: b.phone ?? '',
      website: b.url ?? '',
      location: locStr,
      summary: b.summary ?? '',
    },
    experience: (j.work ?? []).map<ExperienceItem>((w) => ({
      id: id(),
      company: w.name ?? '',
      role: w.position ?? '',
      location: w.location ?? '',
      start: w.startDate ?? '',
      end: w.endDate ?? '',
      current: !w.endDate,
      bullets: w.highlights ?? [],
    })),
    education: (j.education ?? []).map<EducationItem>((e) => ({
      id: id(),
      school: e.institution ?? '',
      degree: e.studyType ?? '',
      field: e.area ?? '',
      start: e.startDate ?? '',
      end: e.endDate ?? '',
      notes: e.score ?? '',
    })),
    skills: (j.skills ?? []).map<SkillGroup>((s) => ({
      id: id(),
      category: s.name ?? 'Skills',
      items: (s.keywords ?? []).map((name) => ({ name })),
    })),
    projects: (j.projects ?? []).map<ProjectItem>((p) => ({
      id: id(),
      name: p.name ?? '',
      link: p.url ?? '',
      description: p.description ?? '',
      tech: p.keywords ?? [],
    })),
    certifications: (j.certificates ?? []).map<CertificationItem>((c) => ({
      id: id(),
      name: c.name ?? '',
      issuer: c.issuer ?? '',
      date: c.date ?? '',
    })),
    languages: (j.languages ?? []).map<LanguageItem>((l) => ({
      id: id(),
      name: l.language ?? '',
      level: l.fluency ?? '',
    })),
    awards: (j.awards ?? []).map<AwardItem>((a) => ({
      id: id(),
      name: a.title ?? '',
      issuer: a.awarder ?? '',
      date: a.date ?? '',
      description: a.summary ?? '',
    })),
  };
}
