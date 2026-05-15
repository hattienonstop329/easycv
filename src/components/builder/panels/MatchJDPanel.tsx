'use client';

import { useMemo, useState } from 'react';
import { useResume } from '@/lib/store';
import { findMatchedTerms, flattenResumeText, KbEntry } from '@/lib/skills-kb';

const STORAGE_KEY = 'easycv-jd-draft';

export function MatchJDPanel() {
  const data = useResume((s) => s.data);
  const skills = useResume((s) => s.data.skills);
  const addSkillGroup = useResume((s) => s.addSkillGroup);
  const addSkillToGroup = useResume((s) => s.addSkillToGroup);
  const updateSkillGroup = useResume((s) => s.updateSkillGroup);

  const [jd, setJd] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(STORAGE_KEY) ?? '';
  });

  const handleJdChange = (v: string) => {
    setJd(v);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, v);
    }
  };

  const { jdTerms, matched, missing } = useMemo(() => {
    const jdTerms = findMatchedTerms(jd);
    if (jdTerms.length === 0) {
      return { jdTerms, matched: [] as KbEntry[], missing: [] as KbEntry[] };
    }
    const resumeText = flattenResumeText(data);
    const resumeTerms = new Set(findMatchedTerms(resumeText).map((e) => e.term));
    const matched: KbEntry[] = [];
    const missing: KbEntry[] = [];
    for (const t of jdTerms) {
      if (resumeTerms.has(t.term)) matched.push(t);
      else missing.push(t);
    }
    return { jdTerms, matched, missing };
  }, [jd, data]);

  const matchPct = jdTerms.length === 0 ? 0 : Math.round((matched.length / jdTerms.length) * 100);

  const addToSkills = (entry: KbEntry) => {
    // Find or create a skill group whose category roughly matches the entry's category.
    const labelByCategory: Record<KbEntry['category'], string> = {
      language: 'Languages',
      framework: 'Frameworks',
      platform: 'Cloud',
      tool: 'Tools',
      data: 'Data',
      devops: 'DevOps',
      design: 'Design',
      soft: 'Leadership',
      method: 'Methods',
    };
    const label = labelByCategory[entry.category];
    const existing = skills.find((g) => g.category.toLowerCase() === label.toLowerCase());
    if (existing) {
      addSkillToGroup(existing.id, entry.term);
      return;
    }
    // Create the group then add the term to it.
    addSkillGroup();
    // The new group is appended at end; rename + populate.
    setTimeout(() => {
      const fresh = useResume.getState().data.skills;
      const newest = fresh[fresh.length - 1];
      if (!newest) return;
      updateSkillGroup(newest.id, { category: label, items: [{ name: entry.term }] });
    }, 0);
  };

  return (
    <div>
      <div className="text-xs text-cocoa-soft mb-3 leading-relaxed">
        paste a job description below — we&apos;ll show which keywords from it appear in your
        resume and which ones are missing. nothing leaves your browser.
      </div>

      <textarea
        value={jd}
        onChange={(e) => handleJdChange(e.target.value)}
        placeholder="Paste the job description here…"
        className="w-full bg-paper border border-cocoa/15 rounded-xl px-3 py-2 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 transition placeholder:text-cocoa-soft/60 resize-y min-h-[160px] thin-scroll"
      />

      {jd.trim() && jdTerms.length === 0 && (
        <div className="mt-4 text-sm text-cocoa-soft italic">
          No known keywords detected in this JD yet. Try pasting a longer or more
          technical description.
        </div>
      )}

      {jdTerms.length > 0 && (
        <>
          <div className="mt-5 flex items-center justify-between">
            <div className="font-[family-name:var(--font-hand)] text-2xl text-olive-ink leading-none">
              {matched.length} of {jdTerms.length} matched
            </div>
            <div className="text-xs text-cocoa-soft">{matchPct}% coverage</div>
          </div>
          <div className="mt-2 h-2 bg-cream2 rounded-full overflow-hidden">
            <div
              className="h-full bg-matcha-deep transition-[width] duration-500"
              style={{ width: `${matchPct}%` }}
            />
          </div>

          {missing.length > 0 && (
            <div className="mt-6">
              <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep mb-2">
                missing — consider adding
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((m) => (
                  <button
                    key={m.term}
                    type="button"
                    onClick={() => addToSkills(m)}
                    className="group bg-strawberry/15 hover:bg-strawberry/30 text-cocoa border border-strawberry/30 px-2.5 py-1 rounded-full text-xs flex items-center gap-1 transition"
                    title={`add "${m.term}" to your Skills`}
                  >
                    {m.term}
                    <span className="text-strawberry-deep opacity-50 group-hover:opacity-100 transition">+</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matched.length > 0 && (
            <div className="mt-6">
              <div className="font-[family-name:var(--font-hand)] text-xl text-matcha-deep mb-2">
                matched ✓
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matched.map((m) => (
                  <span
                    key={m.term}
                    className="bg-matcha/20 text-olive-ink border border-matcha/30 px-2.5 py-1 rounded-full text-xs"
                  >
                    {m.term}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-[11px] text-cocoa-soft italic">
            keywords are matched against a curated dictionary of ~{`120`}+ common
            tech, design, and methodology terms. it won&apos;t catch every phrase — use it
            as a sanity check, not a verdict.
          </div>
        </>
      )}
    </div>
  );
}
