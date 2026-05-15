'use client';

import { useEffect, useRef } from 'react';
import { useResume } from '@/lib/store';
import { useToasts } from '@/lib/toast-store';

const PRAISE_FIRST_BULLET = 'first bullet — nice. lead with a strong verb.';
const PRAISE_THREE_JOBS = 'three jobs in. your story is shaping up ✦';
const PRAISE_FIVE_SKILLS = 'five skills — recruiters can scan you now.';
const PRAISE_SUMMARY = 'summary written. you sound like yourself.';
const PRAISE_NUMBERS = 'a bullet with numbers — recruiters live for these.';

export function MilestoneWatcher() {
  const data = useResume((s) => s.data);
  const push = useToasts((s) => s.push);
  // Suppress firing for the very first hydration tick.
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      return;
    }

    // First non-empty bullet across all experience.
    const totalBullets = data.experience.reduce(
      (n, e) => n + e.bullets.filter((b) => b.trim()).length,
      0,
    );
    if (totalBullets === 1) {
      push(PRAISE_FIRST_BULLET, { tone: 'praise', dedupKey: 'first-bullet' });
    }

    // Three completed experience entries.
    const filledJobs = data.experience.filter((e) => e.role.trim() && e.company.trim()).length;
    if (filledJobs === 3) {
      push(PRAISE_THREE_JOBS, { tone: 'praise', dedupKey: 'three-jobs' });
    }

    // Five total skill items across all groups.
    const totalSkills = data.skills.reduce((n, g) => n + g.items.filter((s) => s.name.trim()).length, 0);
    if (totalSkills === 5) {
      push(PRAISE_FIVE_SKILLS, { tone: 'praise', dedupKey: 'five-skills' });
    }

    // Summary written (at least 40 chars).
    if (data.profile.summary.trim().length >= 40) {
      push(PRAISE_SUMMARY, { tone: 'praise', dedupKey: 'summary-written' });
    }

    // Any bullet that contains a number — celebrate quantification.
    const hasQuantifiedBullet = data.experience.some((e) =>
      e.bullets.some((b) => /\d/.test(b) && b.trim().length > 15),
    );
    if (hasQuantifiedBullet) {
      push(PRAISE_NUMBERS, { tone: 'praise', dedupKey: 'quantified-bullet' });
    }
  }, [data, push]);

  return null;
}
