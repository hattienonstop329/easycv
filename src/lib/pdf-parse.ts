import {
  ResumeData,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  AwardItem,
  Section,
  SectionType,
  CustomSectionContent,
} from './types';

const id = () => Math.random().toString(36).slice(2, 10);

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;
const URL_RE = /\b((?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?)\b/i;
const LOCATION_RE = /([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?,\s+[A-Z]{2,}|Remote)/;
const DATE_RE =
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:[-–—]|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current|present|now)/i;
const SINGLE_DATE_RE =
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})/;

// Section heading detection — case-insensitive, allow "EXPERIENCE", "Experience", etc.
const HEADINGS: { type: SectionKind; patterns: RegExp[] }[] = [
  {
    type: 'summary',
    patterns: [/^(summary|profile|objective|about|about me)$/i],
  },
  {
    type: 'experience',
    patterns: [/^(experience|work experience|employment|professional experience|work history|career)$/i],
  },
  {
    type: 'education',
    patterns: [/^(education|academic|qualifications)$/i],
  },
  {
    type: 'skills',
    patterns: [/^(skills|technical skills|expertise|competencies|technologies)$/i],
  },
  {
    type: 'projects',
    patterns: [/^(projects|selected projects|side projects|open source)$/i],
  },
  {
    type: 'certifications',
    patterns: [/^(certifications|certificates|licenses)$/i],
  },
  {
    type: 'awards',
    patterns: [/^(awards|honors|achievements|recognition)$/i],
  },
  {
    type: 'languages',
    patterns: [/^(languages|spoken languages)$/i],
  },
];

type SectionKind =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'languages';

function detectHeading(line: string): SectionKind | null {
  const trimmed = line.trim();
  if (trimmed.length > 40) return null;
  for (const h of HEADINGS) {
    if (h.patterns.some((re) => re.test(trimmed))) return h.type;
  }
  return null;
}

// Loose heading detection for unknown sections: short ALL-CAPS or Title-Case
// lines that look like section titles. Used to capture custom blocks.
function looksLikeCustomHeading(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > 40) return false;
  if (/[.!?,;:()]/.test(t)) return false;
  if (EMAIL_RE.test(t) || PHONE_RE.test(t) || URL_RE.test(t)) return false;
  // All-caps or title-case, max 4 words
  const words = t.split(/\s+/);
  if (words.length > 5) return false;
  const allCaps = words.every((w) => /^[A-Z][A-Z&/-]*$/.test(w));
  const titleCase = words.every((w) => /^[A-Z][a-zA-Z&/-]*$/.test(w));
  return allCaps || titleCase;
}

function isBulletLine(line: string): boolean {
  return /^[•·▪◦‣⁃●○◆■□\-\*]\s+/.test(line.trim());
}

function stripBulletGlyph(line: string): string {
  return line.trim().replace(/^[•·▪◦‣⁃●○◆■□\-\*]\s+/, '').trim();
}

interface ParsedReport {
  data: Partial<ResumeData> & {
    /** Section list with imported items toggled visible, in discovery order. */
    sections?: Section[];
    /** Map of custom section id -> { id, body }. Use with sections[type='custom']. */
    customSections?: Record<string, CustomSectionContent>;
  };
  warnings: string[];
  /** What we detected, for the UI to surface */
  found: {
    profile: string[];
    sections: Array<SectionKind | 'custom'>;
    experience: number;
    education: number;
    skills: number;
    projects: number;
    certifications: number;
    awards: number;
    languages: number;
    custom: number;
  };
}

/**
 * Heuristic resume-from-PDF parser. The PDF text comes in as flat lines —
 * we look for section headings, then walk forward grouping content into items.
 * This isn't perfect; we surface what we found so the user can verify.
 */
export function parseResumeText(rawLines: string[]): ParsedReport {
  // Drop empty trailing/leading and normalize.
  const lines = rawLines.map((l) => l.trim());
  const warnings: string[] = [];

  // --- profile fields (search the top ~12 lines) ---------------------------
  const head = lines.slice(0, 14);
  const headBlob = head.join(' ');

  const profile: ResumeData['profile'] = {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  };

  // Name: first non-empty line that isn't an email/phone/URL/all-uppercase-section
  for (const l of head) {
    if (!l) continue;
    if (EMAIL_RE.test(l) || /^https?:|@/.test(l)) continue;
    if (l.length > 60) continue;
    if (detectHeading(l)) continue;
    // Looks like a name — title-case'd, 2-5 words
    const words = l.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && words.every((w) => /^[A-Z][a-zA-Z'.-]*$/.test(w))) {
      profile.fullName = l;
      break;
    }
  }

  const emailMatch = headBlob.match(EMAIL_RE);
  if (emailMatch) profile.email = emailMatch[0];

  const phoneMatch = headBlob.match(PHONE_RE);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7) {
    profile.phone = phoneMatch[0];
  }

  const locationMatch = headBlob.match(LOCATION_RE);
  if (locationMatch) profile.location = locationMatch[0];

  const urlMatch = headBlob.match(URL_RE);
  if (urlMatch && !urlMatch[0].includes('@')) profile.website = urlMatch[0];

  // Title: line right after the name, if it doesn't look like contact info
  const nameIdx = profile.fullName ? lines.indexOf(profile.fullName) : -1;
  if (nameIdx >= 0) {
    for (let i = nameIdx + 1; i < Math.min(nameIdx + 4, lines.length); i++) {
      const l = lines[i];
      if (!l) continue;
      if (EMAIL_RE.test(l) || PHONE_RE.test(l) || URL_RE.test(l)) continue;
      if (l.length < 60 && !detectHeading(l)) {
        profile.title = l;
        break;
      }
    }
  }

  // --- find section boundaries --------------------------------------------
  // Known sections get their `type`; unknown headings become custom blocks with a title.
  type Boundary = {
    kind: SectionKind | 'custom';
    title: string;
    start: number;
    end: number;
  };
  const sections: Boundary[] = [];
  // We never start scanning headings until we've passed the profile block,
  // so the name itself doesn't accidentally register as a section.
  const profileEnd = profile.fullName
    ? Math.max(lines.indexOf(profile.fullName) + 1, 0)
    : 0;
  for (let i = profileEnd; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    const known = detectHeading(l);
    if (known) {
      sections.push({ kind: known, title: l, start: i + 1, end: lines.length });
      continue;
    }
    if (looksLikeCustomHeading(l)) {
      sections.push({ kind: 'custom', title: l, start: i + 1, end: lines.length });
    }
  }
  for (let i = 0; i < sections.length - 1; i++) {
    sections[i].end = sections[i + 1].start - 1;
  }

  const sectionLines = (kind: SectionKind): string[] => {
    const sec = sections.find((s) => s.kind === kind);
    if (!sec) return [];
    return lines.slice(sec.start, sec.end);
  };

  // --- summary -------------------------------------------------------------
  const summaryBlock = sectionLines('summary').filter(Boolean).join(' ');
  if (summaryBlock) profile.summary = summaryBlock;

  // --- experience ----------------------------------------------------------
  const experience: ExperienceItem[] = [];
  const expLines = sectionLines('experience');
  if (expLines.length > 0) {
    let current: ExperienceItem | null = null;
    for (const raw of expLines) {
      if (!raw) continue;
      const dateMatch = raw.match(DATE_RE);
      if (dateMatch) {
        // New job header. The line typically has role + company + dates.
        if (current) experience.push(current);
        const headerNoDates = raw.replace(DATE_RE, '').replace(/\s+/g, ' ').trim();
        const split = headerNoDates.split(/\s+(?:at|@|·|\||,)\s+/);
        const [role, company] = split;
        current = {
          id: id(),
          role: (role ?? headerNoDates).trim(),
          company: (company ?? '').trim(),
          location: '',
          start: dateMatch[1],
          end: dateMatch[2] || '',
          current: /present|current|now/i.test(dateMatch[2] ?? ''),
          bullets: [],
        };
        continue;
      }
      if (!current) {
        // Try treating the very first line as a header without dates.
        current = { id: id(), role: raw, company: '', location: '', start: '', end: '', current: false, bullets: [] };
        continue;
      }
      if (isBulletLine(raw)) {
        current.bullets.push(stripBulletGlyph(raw));
      } else if (raw.length < 80 && (!current.company || !current.location) && /[A-Z]/.test(raw)) {
        // Likely a continuation header line (company, location).
        if (!current.company) {
          current.company = raw;
        } else if (!current.location && LOCATION_RE.test(raw)) {
          current.location = raw;
        } else {
          // append to last bullet as continuation, or push as plain line
          if (current.bullets.length > 0) {
            current.bullets[current.bullets.length - 1] += ' ' + raw;
          } else {
            current.bullets.push(raw);
          }
        }
      } else {
        // Continuation of previous bullet, or a paragraph bullet
        if (current.bullets.length > 0) {
          current.bullets[current.bullets.length - 1] += ' ' + raw;
        } else {
          current.bullets.push(raw);
        }
      }
    }
    if (current) experience.push(current);
  }

  // --- education -----------------------------------------------------------
  const education: EducationItem[] = [];
  const eduLines = sectionLines('education');
  if (eduLines.length > 0) {
    let current: EducationItem | null = null;
    for (const raw of eduLines) {
      if (!raw) continue;
      const dateMatch = raw.match(DATE_RE) || raw.match(SINGLE_DATE_RE);
      if (dateMatch) {
        if (current) education.push(current);
        const headerNoDates = raw.replace(DATE_RE, '').replace(SINGLE_DATE_RE, '').trim();
        current = {
          id: id(),
          school: headerNoDates,
          degree: '',
          field: '',
          start: dateMatch[1] || '',
          end: dateMatch[2] || '',
          notes: '',
        };
      } else if (current) {
        // Try to split degree / field on " in " or " of "
        const m = raw.match(/^(BFA|BA|BS|BSc|MA|MS|MSc|MBA|PhD|Bachelor[^,]*|Master[^,]*|Doctor[^,]*)(?:\s+(?:in|of)\s+(.+))?$/i);
        if (m && !current.degree) {
          current.degree = m[1];
          if (m[2]) current.field = m[2];
        } else if (!current.school && raw.length < 80) {
          current.school = raw;
        } else {
          current.notes = current.notes ? `${current.notes} ${raw}` : raw;
        }
      } else {
        // Treat first line as school
        current = { id: id(), school: raw, degree: '', field: '', start: '', end: '', notes: '' };
      }
    }
    if (current) education.push(current);
  }

  // --- skills --------------------------------------------------------------
  const skills: SkillGroup[] = [];
  const skillLines = sectionLines('skills');
  if (skillLines.length > 0) {
    // Lines often look like "Languages: JavaScript, TypeScript, Python"
    for (const raw of skillLines) {
      if (!raw) continue;
      const colonMatch = raw.match(/^([A-Z][A-Za-z &/-]{2,40}):\s*(.+)$/);
      if (colonMatch) {
        const items = colonMatch[2].split(/[,;|·]/).map((s) => s.trim()).filter(Boolean);
        skills.push({
          id: id(),
          category: colonMatch[1].trim(),
          items: items.map((name) => ({ name })),
        });
      } else {
        // Loose line — treat each comma-separated chunk as a skill in a default group.
        const items = raw.split(/[,;|·]/).map((s) => s.trim()).filter(Boolean);
        if (items.length > 0) {
          const group = skills.find((g) => g.category === 'Skills');
          if (group) {
            for (const i of items) group.items.push({ name: i });
          } else {
            skills.push({ id: id(), category: 'Skills', items: items.map((name) => ({ name })) });
          }
        }
      }
    }
  }

  // --- projects ------------------------------------------------------------
  const projects: ProjectItem[] = [];
  const projLines = sectionLines('projects');
  if (projLines.length > 0) {
    let current: ProjectItem | null = null;
    for (const raw of projLines) {
      if (!raw) continue;
      // Heuristic: a "header" line is short and starts with a capital + maybe contains a URL
      const looksHeader = raw.length < 60 && /^[A-Z]/.test(raw) && !isBulletLine(raw);
      if (looksHeader && (!current || current.description)) {
        if (current) projects.push(current);
        const urlInside = raw.match(URL_RE);
        current = {
          id: id(),
          name: urlInside ? raw.replace(URL_RE, '').trim() : raw,
          link: urlInside ? urlInside[0] : '',
          description: '',
          tech: [],
        };
      } else if (current) {
        const stripped = isBulletLine(raw) ? stripBulletGlyph(raw) : raw;
        current.description = current.description ? `${current.description} ${stripped}` : stripped;
      }
    }
    if (current) projects.push(current);
  }

  // --- certifications ------------------------------------------------------
  const certifications: CertificationItem[] = [];
  for (const raw of sectionLines('certifications')) {
    if (!raw) continue;
    const stripped = isBulletLine(raw) ? stripBulletGlyph(raw) : raw;
    const dateMatch = stripped.match(SINGLE_DATE_RE);
    const date = dateMatch ? dateMatch[0] : '';
    const noDate = date ? stripped.replace(date, '').replace(/[,·|]\s*$/, '').trim() : stripped;
    // Common patterns: "Name — Issuer", "Name · Issuer", "Name, Issuer", "Name (Issuer)"
    const split = noDate.split(/\s*[—–|·]\s*|\s+\((?=[A-Z])|\)\s*$|,\s+(?=[A-Z][a-z])/);
    const name = (split[0] ?? noDate).trim();
    const issuer = (split[1] ?? '').trim();
    if (name) certifications.push({ id: id(), name, issuer, date });
  }

  // --- awards --------------------------------------------------------------
  const awards: AwardItem[] = [];
  {
    const awardLines = sectionLines('awards');
    let cur: AwardItem | null = null;
    for (const raw of awardLines) {
      if (!raw) continue;
      const stripped = isBulletLine(raw) ? stripBulletGlyph(raw) : raw;
      const dateMatch = stripped.match(SINGLE_DATE_RE);
      const looksLikeHeader =
        stripped.length < 80 && /^[A-Z]/.test(stripped) && !isBulletLine(raw);
      if (looksLikeHeader && (!cur || cur.description)) {
        if (cur) awards.push(cur);
        const date = dateMatch ? dateMatch[0] : '';
        const noDate = date
          ? stripped.replace(date, '').replace(/[,·|]\s*$/, '').trim()
          : stripped;
        const split = noDate.split(/\s*[—–|·]\s*|,\s+(?=[A-Z][a-z])/);
        cur = {
          id: id(),
          name: (split[0] ?? noDate).trim(),
          issuer: (split[1] ?? '').trim(),
          date,
          description: '',
        };
      } else if (cur) {
        cur.description = cur.description ? `${cur.description} ${stripped}` : stripped;
      } else {
        cur = { id: id(), name: stripped, issuer: '', date: '', description: '' };
      }
    }
    if (cur) awards.push(cur);
  }

  // --- languages -----------------------------------------------------------
  const languages: LanguageItem[] = [];
  for (const raw of sectionLines('languages')) {
    if (!raw) continue;
    const stripped = isBulletLine(raw) ? stripBulletGlyph(raw) : raw;
    // Multiple per line ("English (Native), French (Conversational)") — split first.
    const chunks = stripped.split(/[,;|·]/).map((s) => s.trim()).filter(Boolean);
    for (const ch of chunks) {
      // Patterns: "English — Native", "English: Native", "English (Native)", "English Native"
      const m = ch.match(
        /^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)\s*(?:[—–\-:·]|\()\s*([A-Za-z][a-zA-Z\s]+)\)?$/,
      );
      if (m) {
        languages.push({ id: id(), name: m[1].trim(), level: m[2].trim() });
      } else {
        // Two-word fallback: "English Native"
        const m2 = ch.match(/^([A-Z][a-zA-Z]+)\s+([A-Za-z][a-zA-Z\s]+)$/);
        if (m2) {
          languages.push({ id: id(), name: m2[1].trim(), level: m2[2].trim() });
        } else if (/^[A-Z][a-zA-Z]+$/.test(ch)) {
          languages.push({ id: id(), name: ch, level: '' });
        }
      }
    }
  }

  // --- custom sections -----------------------------------------------------
  const customSections: Record<string, CustomSectionContent> = {};
  const customSectionEntries: { id: string; title: string }[] = [];
  for (const sec of sections) {
    if (sec.kind !== 'custom') continue;
    const body = lines.slice(sec.start, sec.end).filter(Boolean).join('\n').trim();
    if (!body) continue;
    const sid = `s-custom-${id()}`;
    customSections[sid] = { id: sid, body };
    customSectionEntries.push({ id: sid, title: sec.title });
  }

  // --- build a Section[] in the discovered order so imported data is visible
  // even if the default sections list had it off (or in a different order).
  const orderedKinds: Array<SectionType | { type: 'custom'; sid: string; title: string }> = [];
  const seen = new Set<string>();
  for (const sec of sections) {
    if (sec.kind === 'custom') {
      const match = customSectionEntries.find((c) => c.title === sec.title);
      if (match) {
        orderedKinds.push({ type: 'custom', sid: match.id, title: sec.title });
      }
      continue;
    }
    // Only include if we actually parsed at least one item for it (or it's summary text).
    const hasData =
      (sec.kind === 'summary' && profile.summary) ||
      (sec.kind === 'experience' && experience.length) ||
      (sec.kind === 'education' && education.length) ||
      (sec.kind === 'skills' && skills.length) ||
      (sec.kind === 'projects' && projects.length) ||
      (sec.kind === 'certifications' && certifications.length) ||
      (sec.kind === 'awards' && awards.length) ||
      (sec.kind === 'languages' && languages.length);
    if (hasData && !seen.has(sec.kind)) {
      seen.add(sec.kind);
      orderedKinds.push(sec.kind as SectionType);
    }
  }

  const TITLE_BY_TYPE: Record<SectionType, string> = {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    awards: 'Awards',
    custom: 'Custom',
  };
  const sectionsList: Section[] = orderedKinds.map((k, i) => {
    if (typeof k === 'object') {
      return { id: k.sid, type: 'custom', title: k.title, visible: true };
    }
    return { id: `s-${k}-${i}`, type: k, title: TITLE_BY_TYPE[k], visible: true };
  });

  if (sections.length === 0) {
    warnings.push("Couldn't detect any section headings — only profile fields were imported.");
  }
  if (!profile.fullName) warnings.push("Couldn't find a name in the top of the document.");
  if (!profile.email && !profile.phone) warnings.push("Couldn't find an email or phone in the top of the document.");

  const partial: ParsedReport['data'] = {
    profile,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    customSections,
    sections: sectionsList,
  };

  return {
    data: partial,
    warnings,
    found: {
      profile: [
        profile.fullName && 'name',
        profile.title && 'title',
        profile.email && 'email',
        profile.phone && 'phone',
        profile.location && 'location',
        profile.website && 'website',
        profile.summary && 'summary',
      ].filter((x): x is string => !!x),
      sections: sections.map((s) => s.kind),
      experience: experience.length,
      education: education.length,
      skills: skills.length,
      projects: projects.length,
      certifications: certifications.length,
      awards: awards.length,
      languages: languages.length,
      custom: customSectionEntries.length,
    },
  };
}

/**
 * Merge a parsed partial resume into a base resume — preserving customization,
 * template, letter, etc., while replacing every data field we managed to
 * extract. If the parser produced a fresh `sections` ordering, use it so the
 * imported data is actually visible.
 */
export function mergeParsedResume(
  base: ResumeData,
  partial: ParsedReport['data'],
): ResumeData {
  return {
    ...base,
    profile: { ...base.profile, ...partial.profile },
    experience: partial.experience?.length ? partial.experience : base.experience,
    education: partial.education?.length ? partial.education : base.education,
    skills: partial.skills?.length ? partial.skills : base.skills,
    projects: partial.projects?.length ? partial.projects : base.projects,
    certifications: partial.certifications?.length ? partial.certifications : base.certifications,
    languages: partial.languages?.length ? partial.languages : base.languages,
    awards: partial.awards?.length ? partial.awards : base.awards,
    customSections: partial.customSections && Object.keys(partial.customSections).length
      ? { ...base.customSections, ...partial.customSections }
      : base.customSections,
    sections: partial.sections?.length ? partial.sections : base.sections,
  };
}
