import { ResumeData, CoverLetter } from './types';
import { findMatchedTerms, KbEntry } from './skills-kb';

interface ExtractedJD {
  role?: string;
  company?: string;
  matched: KbEntry[];
  missing: KbEntry[];
}

// A "title word" in a role or company name. Strict: capital-led, no
// punctuation. We intentionally exclude periods and slashes to avoid
// running across sentence boundaries.
const TITLE_WORD = '[A-Z][A-Za-z0-9&-]+';

// Common role-name patterns recruiters use. Each capture is bounded to a
// single line and at most 4 title-cased words.
const ROLE_PATTERNS: ReadonlyArray<RegExp> = [
  new RegExp(`(?:we['’]re hiring|hiring|seeking|looking for|join us as)[ \\t]+(?:an?[ \\t]+)?(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,3})`),
  new RegExp(`\\bposition[: \\t]+(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,3})`),
  new RegExp(`\\brole[: \\t]+(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,3})`),
  new RegExp(`\\bjob title[: \\t]+(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,3})`, 'i'),
  // A line that's just a title-cased phrase on its own
  new RegExp(`^(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){1,3})[ \\t]*$`, 'm'),
];

const COMPANY_PATTERNS: ReadonlyArray<RegExp> = [
  new RegExp(`\\bat[ \\t]+(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,2})\\b`),
  new RegExp(`\\b(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,2})[ \\t]+is[ \\t]+(?:hiring|seeking|looking)`),
  new RegExp(`\\bjoin[ \\t]+(${TITLE_WORD}(?:[ \\t]+${TITLE_WORD}){0,2})\\b`),
];

// Things that *look* like company names but aren't.
const STOP_NAMES = new Set([
  'You',
  'We',
  'Our',
  'Your',
  'I',
  'The',
  'This',
  'That',
  'It',
  'They',
  'These',
  'Those',
  'Required',
  'About',
  'Responsibilities',
  'Requirements',
  'Qualifications',
  'Description',
  'Benefits',
  'Position',
  'Role',
  'Job',
  'Title',
  'Senior',
  'Junior',
  'Staff',
  'Lead',
  'Principal',
  'Engineer',
  'Designer',
  'Manager',
  'Developer',
]);

function pickFirstMatch(text: string, patterns: ReadonlyArray<RegExp>): string | undefined {
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) {
      const candidate = m[1].trim();
      const firstWord = candidate.split(/\s+/)[0];
      if (STOP_NAMES.has(firstWord)) continue;
      return candidate;
    }
  }
  return undefined;
}

export function extractJD(jd: string, resume: ResumeData): ExtractedJD {
  const role = pickFirstMatch(jd, ROLE_PATTERNS);
  const company = pickFirstMatch(jd, COMPANY_PATTERNS);
  const jdTerms = findMatchedTerms(jd);
  // Build the resume term set so we can split matched / missing
  const resumeTerms = new Set(
    findMatchedTerms(
      [
        resume.profile.summary,
        ...resume.experience.flatMap((e) => [e.role, ...e.bullets]),
        ...resume.skills.flatMap((g) => g.items.map((i) => i.name)),
        ...resume.projects.flatMap((p) => [p.description, ...p.tech]),
      ].join(' '),
    ).map((e) => e.term),
  );
  const matched: KbEntry[] = [];
  const missing: KbEntry[] = [];
  for (const t of jdTerms) {
    if (resumeTerms.has(t.term)) matched.push(t);
    else missing.push(t);
  }
  return { role, company, matched, missing };
}

function todayLong(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function pickStrongestBullet(resume: ResumeData): string | null {
  // Prefer a bullet from the most recent role that contains a number.
  for (const job of resume.experience) {
    const quantified = job.bullets.find((b) => /\d/.test(b) && b.trim().length > 0);
    if (quantified) return quantified;
  }
  for (const job of resume.experience) {
    const any = job.bullets.find((b) => b.trim().length > 0);
    if (any) return any;
  }
  return null;
}

export interface DraftedLetter {
  letter: Partial<CoverLetter>;
  detected: { role?: string; company?: string; topSkills: string[] };
}

/**
 * Compose a starter cover-letter from the JD plus the resume. Deterministic —
 * no AI calls. The user is expected to edit it after.
 */
export function draftLetterFromJD(jd: string, resume: ResumeData): DraftedLetter {
  const ext = extractJD(jd, resume);
  const top = ext.matched.slice(0, 3).map((m) => m.term);
  const role = ext.role ?? '[the role]';
  const company = ext.company ?? '[your company]';
  const greeting = ext.company ? `Dear ${ext.company} team,` : 'Dear Hiring Team,';
  const bullet = pickStrongestBullet(resume);
  const skillsClause =
    top.length === 0
      ? 'I bring a track record of shipping carefully and working closely with cross-functional teams.'
      : top.length === 1
        ? `My experience leans heavily on ${top[0]}, and I love getting deep into the details that ship to real users.`
        : `My experience leans heavily on ${top.slice(0, -1).join(', ')} and ${top[top.length - 1]} — and I love getting deep into the details that ship to real users.`;

  const bulletClause = bullet
    ? `Most recently at ${resume.experience[0]?.company ?? 'my last role'}, I ${bullet
        .replace(/^[A-Z]/, (c) => c.toLowerCase())
        .replace(/\.$/, '')}.`
    : '';

  const opening = `I'm writing to apply for the ${role} role at ${company}. ${
    resume.profile.summary
      ? resume.profile.summary.split(/[.!?]/)[0].trim() + '.'
      : `I'm a ${resume.profile.title || 'designer'} who cares about quiet, careful craft.`
  }`;

  const middle = [skillsClause, bulletClause].filter(Boolean).join('\n\n');

  const closingPara = `I'd love to talk about how I could help. I've attached my resume — happy to share more about any of these in detail.`;

  const body = [opening, middle, closingPara].filter(Boolean).join('\n\n');

  return {
    letter: {
      recipientCompany: ext.company ?? '',
      recipientName: ext.company ? `${ext.company} Hiring Team` : 'Hiring Team',
      subject: `Re: ${role}`,
      salutation: greeting,
      body,
      closing: 'Warmly,',
      signatureName: resume.profile.fullName || '',
      date: todayLong(),
    },
    detected: { role: ext.role, company: ext.company, topSkills: top },
  };
}
