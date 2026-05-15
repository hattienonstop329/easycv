'use client';

import { useEffect, useState } from 'react';
import { useResume } from '@/lib/store';
import { relativeTime } from '@/lib/snapshots';

export function SavedTimestamp() {
  const lastSavedAt = useResume((s) => s.lastSavedAt);
  const [, force] = useState(0);

  // Re-render every 5s so the relative time stays fresh.
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-cocoa-soft whitespace-nowrap">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-matcha animate-pulse" />
      saved {relativeTime(lastSavedAt)}
    </span>
  );
}
