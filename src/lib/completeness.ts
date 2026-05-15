import { ResumeData } from './types';
import { lintResume, wordCount } from './writing-checks';
import type { PanelId } from '@/components/builder/shell/PanelSwitcher';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  weight: number;
  panel?: PanelId;
  // Optional helper text — what's missing or how to improve
  hint?: string;
}

export interface CompletenessScore {
  percent: number;       // 0..100
  earned: number;        // raw points earned
  total: number;         // raw points possible
  checklist: ChecklistItem[];
  // What grade label feels right ("just starting", "strong", etc.)
  label: string;
  // Color hint for the badge ring
  tone: 'low' | 'mid' | 'good' | 'great';
}

function gradeLabel(pct: number): { label: string; tone: CompletenessScore['tone'] } {
  if (pct >= 90) return { label: 'looking great', tone: 'great' };
  if (pct >= 70) return { label: 'almost there', tone: 'good' };
  if (pct >= 40) return { label: 'getting closer', tone: 'mid' };
  return { label: 'just starting', tone: 'low' };
}

export function scoreResume(data: ResumeData): CompletenessScore {
  const p = data.profile;
  const expWithBullets = data.experience.filter((e) => e.bullets.some((b) => b.trim().length > 0));
  const skillsWithItems = data.skills.filter((s) => s.items.length > 0);
  const eduWithSchool = data.education.filter((e) => e.school.trim().length > 0);
  const issues = lintResume(data);
  const warnIssues = issues.filter((i) => i.severity === 'warn').length;
  const summaryWords = wordCount(p.summary);

  const checklist: ChecklistItem[] = [
    {
      id: 'name',
      label: 'add your name',
      done: p.fullName.trim().length > 1,
      weight: 8,
      panel: 'profile',
    },
    {
      id: 'title',
      label: 'add a job title',
      done: p.title.trim().length > 1,
      weight: 6,
      panel: 'profile',
      hint: 'a title under your name (e.g. "Senior Designer") helps recruiters skim',
    },
    {
      id: 'email',
      label: 'add an email',
      done: /\S+@\S+\.\S+/.test(p.email),
      weight: 8,
      panel: 'profile',
    },
    {
      id: 'contact',
      label: 'add phone or location',
      done: p.phone.trim().length > 3 || p.location.trim().length > 1,
      weight: 4,
      panel: 'profile',
      hint: 'most resumes have at least one of: phone, city, or website',
    },
    {
      id: 'summary',
      label: 'write a 2–4 line summary',
      done: summaryWords >= 20,
      weight: 8,
      panel: 'profile',
      hint:
        summaryWords === 0
          ? 'no summary yet'
          : summaryWords < 20
            ? `only ${summaryWords} words — aim for 20+`
            : undefined,
    },
    {
      id: 'experience',
      label: 'add a job with bullets',
      done: expWithBullets.length >= 1,
      weight: 14,
      panel: 'experience',
      hint:
        data.experience.length === 0
          ? 'no jobs yet'
          : 'add at least one bullet to a job',
    },
    {
      id: 'experience-2',
      label: 'add a second job',
      done: expWithBullets.length >= 2,
      weight: 6,
      panel: 'experience',
      hint: 'most resumes show 2–4 roles',
    },
    {
      id: 'dates',
      label: 'fill in dates for every job',
      done:
        data.experience.length > 0 &&
        data.experience.every((e) => e.start.trim().length > 0 && (e.current || e.end.trim().length > 0)),
      weight: 6,
      panel: 'experience',
      hint:
        data.experience.length === 0
          ? 'add a job first'
          : (() => {
              const missing = data.experience.filter(
                (e) => !e.start.trim() || (!e.current && !e.end.trim()),
              );
              return missing.length
                ? `${missing.length} job${missing.length === 1 ? '' : 's'} missing dates`
                : undefined;
            })(),
    },
    {
      id: 'education',
      label: 'add education',
      done: eduWithSchool.length >= 1,
      weight: 8,
      panel: 'education',
    },
    {
      id: 'skills',
      label: 'add at least one skill group',
      done: skillsWithItems.length >= 1,
      weight: 8,
      panel: 'skills',
      hint:
        data.skills.length === 0
          ? 'no skills yet'
          : skillsWithItems.length === 0
            ? 'a group exists but it has no items'
            : undefined,
    },
    {
      id: 'projects-or-awards',
      label: 'add a project, award, or certification',
      done:
        data.projects.length > 0 ||
        data.awards.length > 0 ||
        data.certifications.length > 0,
      weight: 6,
      panel: 'projects',
      hint: 'one extra section helps you stand out',
    },
    {
      id: 'numbers',
      label: 'quantify at least one bullet',
      done: data.experience.some((e) => e.bullets.some((b) => /\d/.test(b))),
      weight: 8,
      panel: 'experience',
      hint: 'a single number ("18% lift", "40k users") is the fastest credibility win',
    },
    {
      id: 'polish',
      label: 'fix major writing flags',
      done: warnIssues === 0,
      weight: 6,
      panel: 'polish',
      hint:
        warnIssues > 0
          ? `${warnIssues} flag${warnIssues === 1 ? '' : 's'} (weak verbs / clichés / long bullets)`
          : undefined,
    },
    {
      id: 'website',
      label: 'add a portfolio or link',
      done: p.website.trim().length > 1,
      weight: 4,
      panel: 'profile',
      hint: 'a link gives reviewers somewhere to dig deeper',
    },
  ];

  const total = checklist.reduce((acc, c) => acc + c.weight, 0);
  const earned = checklist.reduce((acc, c) => acc + (c.done ? c.weight : 0), 0);
  const percent = Math.round((earned / total) * 100);
  const { label, tone } = gradeLabel(percent);

  return { percent, earned, total, checklist, label, tone };
}
