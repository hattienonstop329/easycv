import { ResumeData } from './types';

export interface WritingIssue {
  kind: 'weak-verb' | 'cliche' | 'long-bullet' | 'starts-with-i' | 'no-quantification' | 'first-person' | 'tense-mix';
  severity: 'warn' | 'info';
  message: string;
  suggestion?: string[];
  // Where the issue lives, for deep-linking
  location: {
    panel: 'profile' | 'experience' | 'projects' | 'awards' | 'education' | 'letter';
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
    // Per-job tense check: count -ed and -ing leading verbs across bullets
    const tenseTags = exp.bullets
      .map((b) => leadVerbTense(b))
      .filter((t): t is 'past' | 'present' => t !== null);
    if (tenseTags.length >= 2) {
      const pasts = tenseTags.filter((t) => t === 'past').length;
      const presents = tenseTags.filter((t) => t === 'present').length;
      if (pasts > 0 && presents > 0) {
        // Pick a representative bullet — the one whose tense is the minority
        const minority = pasts <= presents ? 'past' : 'present';
        const idx = exp.bullets.findIndex((b) => leadVerbTense(b) === minority);
        const which = idx >= 0 ? idx : 0;
        issues.push({
          kind: 'tense-mix',
          severity: 'warn',
          message: `mixed tense in this job: ${pasts} past · ${presents} present — pick one`,
          location: {
            panel: 'experience',
            itemId: exp.id,
            bulletIndex: which,
            excerpt: shortExcerpt(exp.bullets[which] ?? ''),
          },
        });
      }
    }

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

  // Cover letter body — same weak-phrase/cliche checks, plus too-long-paragraph
  // and missing-call-to-action heuristics.
  if (data.letter?.body) {
    const body = data.letter.body;
    issues.push(
      ...checkText(body, {
        panel: 'letter',
        field: 'body',
        excerpt: shortExcerpt(body),
      }),
    );
    const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    paragraphs.forEach((p, i) => {
      const wc = wordCount(p);
      if (wc > 90) {
        issues.push({
          kind: 'long-bullet',
          severity: 'warn',
          message: `paragraph #${i + 1} is ${wc} words — split it into two`,
          location: {
            panel: 'letter',
            field: 'body',
            excerpt: shortExcerpt(p),
          },
        });
      }
    });
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

// --- Tense detection -------------------------------------------------------

const PRESENT_PARTICIPLE_FALSE_FRIENDS = new Set([
  // Words that look like -ing verbs but aren't really tense markers
  'something',
  'everything',
  'nothing',
  'morning',
  'evening',
  'meeting',
  'engineering',
  'marketing',
  'training',
  'consulting',
  'planning',
  'using',
  'including',
  'during',
]);

const PAST_TENSE_FALSE_FRIENDS = new Set([
  // -ed words that aren't past-tense verbs in resume context
  'led',
  'fed',
  'red',
  'mixed',
  'used',
  'based',
  'advanced',
]);

/**
 * Look at the first content word of a bullet and try to label it as past or
 * present tense. Returns null when we can't tell (no leading verb or the word
 * is in the false-friends list).
 */
export function leadVerbTense(bullet: string): 'past' | 'present' | null {
  const cleaned = bullet.trim().replace(/^[•\-*\s]+/, '');
  if (!cleaned) return null;
  const firstWord = cleaned.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]+$/, '');
  if (!firstWord || firstWord.length < 4) return null;

  if (firstWord.endsWith('ing') && !PRESENT_PARTICIPLE_FALSE_FRIENDS.has(firstWord)) {
    return 'present';
  }
  if (firstWord.endsWith('ed') && !PAST_TENSE_FALSE_FRIENDS.has(firstWord)) {
    return 'past';
  }
  // Common irregular past-tense action verbs
  if (/^(led|built|shipped|wrote|grew|drove|ran|sold|saved|cut|made|set|won|brought|spoke|taught|gave|took)$/.test(firstWord)) {
    return 'past';
  }
  return null;
}

// --- Reading level (Flesch-Kincaid Grade) ----------------------------------

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  // Strip silent endings
  const cleaned = w.replace(/(?:[^laeiouy]|ed|es)$/, '').replace(/^y/, '');
  const groups = cleaned.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

export interface ReadingLevel {
  grade: number;        // Flesch-Kincaid grade (rounded to one decimal)
  words: number;
  sentences: number;
  syllables: number;
  // Friendly summary for the UI
  label: string;
  tone: 'easy' | 'mid' | 'hard';
}

export function readingLevel(text: string): ReadingLevel | null {
  const clean = text.replace(/[\r\n]+/g, ' ').trim();
  if (!clean) return null;
  const words = clean.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (words.length < 10) return null;
  const sentences = Math.max(
    1,
    (clean.match(/[.!?]+(?:\s|$)/g) ?? []).length || Math.ceil(words.length / 18),
  );
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const grade =
    0.39 * (words.length / sentences) +
    11.8 * (syllables / words.length) -
    15.59;
  const rounded = Math.round(grade * 10) / 10;
  const tone: ReadingLevel['tone'] = rounded <= 9 ? 'easy' : rounded <= 13 ? 'mid' : 'hard';
  const label =
    tone === 'easy'
      ? 'easy to skim'
      : tone === 'mid'
        ? 'reads like a college essay'
        : 'dense — try shorter sentences';
  return { grade: rounded, words: words.length, sentences, syllables, label, tone };
}

// --- Per-bullet polish heuristic ------------------------------------------

const ACTION_VERB_FOR_FIRST_PERSON = 'Led';

/**
 * Apply a series of cheap, deterministic rewrites to a bullet:
 *  - capitalize the first letter
 *  - strip a trailing period (resumes commonly omit)
 *  - replace weak phrases with their first suggested replacement
 *  - rewrite leading "I [verb]" → "[verb-d]" or fall back to "Led ..."
 *  - if no number anywhere, append a "[add a number]" placeholder
 *
 * Returns the new bullet plus a short list of changes for UI feedback.
 */
export function polishBullet(input: string): { result: string; changes: string[] } {
  const changes: string[] = [];
  let out = input.replace(/\s+/g, ' ').trim();
  if (!out) return { result: '', changes: [] };

  // Strip leading bullet glyphs that sometimes get pasted in.
  if (/^[•\-*]\s+/.test(out)) {
    out = out.replace(/^[•\-*]\s+/, '');
    changes.push('removed bullet glyph');
  }

  // Replace weak phrases with their first replacement
  for (const { phrase, suggestion, re } of WEAK_PATTERNS) {
    if (re.test(out)) {
      out = out.replace(re, suggestion[0]);
      changes.push(`"${phrase}" → "${suggestion[0]}"`);
    }
  }

  // Rewrite leading "I X" → strong verb. Try to past-tense common verbs.
  const firstPersonMatch = out.match(/^(I |I'm |I am )(.+)$/i);
  if (firstPersonMatch) {
    const rest = firstPersonMatch[2].trim();
    const restFirst = rest.split(/\s+/)[0]?.toLowerCase() ?? '';
    if (/^(was|am|m)$/.test(restFirst)) {
      out = capitalize(rest.replace(/^(was|am|m)\s+/i, ''));
      changes.push('removed "I was/am"');
    } else {
      // Use the next word as the verb if it's plausibly a verb.
      const verb = restFirst;
      const past = pastTenseize(verb);
      if (past) {
        out = capitalize(past + ' ' + rest.split(/\s+/).slice(1).join(' '));
        changes.push(`"I ${verb}" → "${past}"`);
      } else {
        out = `${ACTION_VERB_FOR_FIRST_PERSON} ${rest}`;
        changes.push(`replaced "I" with "${ACTION_VERB_FOR_FIRST_PERSON}"`);
      }
    }
  }

  // Capitalize first letter
  if (out[0] && out[0] !== out[0].toUpperCase()) {
    out = capitalize(out);
    changes.push('capitalized first letter');
  }

  // Strip a trailing period
  if (out.endsWith('.') && !out.endsWith('..')) {
    out = out.slice(0, -1);
    changes.push('removed trailing period');
  }

  // Add a quantification placeholder if no number anywhere
  if (!NUMBER_RE.test(out) && wordCount(out) >= 6 && !/\[add a number\]/i.test(out)) {
    out = `${out} ([add a number] impact)`;
    changes.push('added quantification placeholder');
  }

  return { result: out, changes };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pastTenseize(verb: string): string | null {
  const v = verb.toLowerCase();
  if (!/^[a-z]{3,}$/.test(v)) return null;
  // Skip auxiliary or non-verb starters
  if (/^(have|has|had|do|did|does|will|would|can|could|should|might|may|must)$/.test(v)) return null;
  if (v.endsWith('ed')) return capitalize(v);
  // Common irregulars
  const irregulars: Record<string, string> = {
    build: 'Built', ship: 'Shipped', lead: 'Led', write: 'Wrote', grow: 'Grew',
    drive: 'Drove', run: 'Ran', sell: 'Sold', save: 'Saved', cut: 'Cut',
    make: 'Made', set: 'Set', win: 'Won', bring: 'Brought', speak: 'Spoke',
    teach: 'Taught', give: 'Gave', take: 'Took', design: 'Designed',
    own: 'Owned', launch: 'Launched', build_: 'Built',
  };
  if (irregulars[v]) return irregulars[v];
  // Regular -ed; double consonant for short CVC verbs
  if (v.endsWith('e')) return capitalize(v + 'd');
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(v) && v.length === 3) return capitalize(v + v.slice(-1) + 'ed');
  return capitalize(v + 'ed');
}
