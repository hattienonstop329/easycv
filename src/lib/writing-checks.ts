import { ResumeData } from './types';

export interface WritingIssue {
  kind: 'weak-verb' | 'cliche' | 'long-bullet' | 'starts-with-i' | 'no-quantification' | 'first-person';
  severity: 'warn' | 'info';
  message: string;
  suggestion?: string[];
  // Where the issue lives, for deep-linking
  location: {
    panel: 'profile' | 'experience' | 'projects' | 'awards' | 'education';
    itemId?: string;
    bulletIndex?: number;
    field?: string;
    excerpt: string;
  };
}

// Weak phrases → suggested replacements
const WEAK_PHRASES: Record<string, string[]> = {
  'responsible for': ['led', 'owned', 'shipped', 'ran'],
  'helped with': ['contributed to', 'collaborated on', 'paired with'],
  'worked on': ['shipped', 'built', 'led', 'designed'],
  'worked with': ['partnered with', 'collaborated with'],
  'duties included': ['shipped', 'led', 'owned'],
  'tasked with': ['owned', 'led'],
  'in charge of': ['led', 'owned'],
  'participated in': ['contributed to', 'shipped'],
  'assisted': ['supported', 'collaborated with'],
  'utilized': ['used'],
  'leveraged': ['used'],
  'made use of': ['used'],
};

// Overused / soft / cliché words
const CLICHES: { phrase: string; reason: string }[] = [
  { phrase: 'team player', reason: "everyone says this — show it with examples instead" },
  { phrase: 'hardworking', reason: "tell, don't show — quantify the work" },
  { phrase: 'hard worker', reason: "tell, don't show — quantify the work" },
  { phrase: 'go-getter', reason: "filler — drop it" },
  { phrase: 'go getter', reason: "filler — drop it" },
  { phrase: 'detail-oriented', reason: "claimed by everyone, proven by no one" },
  { phrase: 'results-driven', reason: "résumé jargon — show a specific result" },
  { phrase: 'self-starter', reason: "soft — give an example" },
  { phrase: 'think outside the box', reason: "the cliché-est cliché" },
  { phrase: 'synergy', reason: "corporate filler" },
  { phrase: 'synergize', reason: "corporate filler" },
  { phrase: 'rockstar', reason: "soft — show impact instead" },
  { phrase: 'ninja', reason: "soft — show impact instead" },
  { phrase: 'guru', reason: "soft — show impact instead" },
  { phrase: 'passionate', reason: "claimed by everyone — show it" },
  { phrase: 'dynamic', reason: "vague — be specific" },
  { phrase: 'world-class', reason: "vague — describe what you did" },
  { phrase: 'cutting-edge', reason: "vague — name the tech" },
  { phrase: 'best-in-class', reason: "vague — show metrics" },
  { phrase: 'proven track record', reason: "filler — let your bullets do this" },
  { phrase: 'value add', reason: "corporate-speak — be concrete" },
  { phrase: 'value-add', reason: "corporate-speak — be concrete" },
];

const NUMBER_RE = /\d/;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const WEAK_PATTERNS = Object.entries(WEAK_PHRASES).map(([phrase, suggestion]) => ({
  phrase,
  suggestion,
  re: new RegExp(`\\b${escapeRe(phrase)}\\b`, 'i'),
}));

const CLICHE_PATTERNS = CLICHES.map((c) => ({
  ...c,
  re: new RegExp(`\\b${escapeRe(c.phrase)}\\b`, 'i'),
}));

export function wordCount(text: string): number {
  if (!text?.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function shortExcerpt(text: string, max = 80): string {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function checkText(text: string, location: WritingIssue['location']): WritingIssue[] {
  const issues: WritingIssue[] = [];
  if (!text?.trim()) return issues;

  for (const { phrase, suggestion, re } of WEAK_PATTERNS) {
    if (re.test(text)) {
      issues.push({
        kind: 'weak-verb',
        severity: 'warn',
        message: `weak phrase: "${phrase}"`,
        suggestion,
        location,
      });
    }
  }
  for (const { phrase, reason, re } of CLICHE_PATTERNS) {
    if (re.test(text)) {
      issues.push({
        kind: 'cliche',
        severity: 'warn',
        message: `cliché: "${phrase}"`,
        suggestion: [reason],
        location,
      });
    }
  }
  return issues;
}

export function lintResume(data: ResumeData): WritingIssue[] {
  const issues: WritingIssue[] = [];

  // Summary
  if (data.profile.summary) {
    issues.push(
      ...checkText(data.profile.summary, {
        panel: 'profile',
        field: 'summary',
        excerpt: shortExcerpt(data.profile.summary),
      }),
    );
    if (/^\s*(I |I'm|I am)\b/i.test(data.profile.summary)) {
      issues.push({
        kind: 'first-person',
        severity: 'info',
        message: "summary starts with \"I\" — many resumes drop the pronoun",
        location: {
          panel: 'profile',
          field: 'summary',
          excerpt: shortExcerpt(data.profile.summary),
        },
      });
    }
  }

  // Experience bullets
  for (const exp of data.experience) {
    exp.bullets.forEach((b, i) => {
      if (!b?.trim()) return;
      const loc: WritingIssue['location'] = {
        panel: 'experience',
        itemId: exp.id,
        bulletIndex: i,
        excerpt: shortExcerpt(b),
      };
      issues.push(...checkText(b, loc));

      const wc = wordCount(b);
      if (wc > 32) {
        issues.push({
          kind: 'long-bullet',
          severity: 'warn',
          message: `bullet is ${wc} words — try splitting in two`,
          location: loc,
        });
      }

      if (/^\s*(I |I'm|I am)\b/i.test(b)) {
        issues.push({
          kind: 'first-person',
          severity: 'info',
          message: "bullet starts with \"I\" — try a strong verb instead",
          suggestion: ['led', 'owned', 'shipped', 'built', 'launched'],
          location: loc,
        });
      }

      if (!NUMBER_RE.test(b) && wc >= 8) {
        issues.push({
          kind: 'no-quantification',
          severity: 'info',
          message: 'no numbers in this bullet — can you quantify the impact?',
          location: loc,
        });
      }
    });
  }

  // Project descriptions
  for (const p of data.projects) {
    if (!p.description) continue;
    issues.push(
      ...checkText(p.description, {
        panel: 'projects',
        itemId: p.id,
        excerpt: shortExcerpt(p.description),
      }),
    );
  }

  // Award descriptions
  for (const a of data.awards) {
    if (!a.description) continue;
    issues.push(
      ...checkText(a.description, {
        panel: 'awards',
        itemId: a.id,
        excerpt: shortExcerpt(a.description),
      }),
    );
  }

  return issues;
}

export function lintScore(issues: WritingIssue[]): number {
  // Cap at 100, deduct for each issue, weight by severity
  let score = 100;
  for (const i of issues) {
    score -= i.severity === 'warn' ? 6 : 2;
  }
  return Math.max(0, score);
}
