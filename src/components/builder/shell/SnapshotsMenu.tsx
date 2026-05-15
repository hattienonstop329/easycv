'use client';

import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import {
  Snapshot,
  clearSnapshots,
  listSnapshots,
  relativeTime,
  removeSnapshot,
} from '@/lib/snapshots';

export function SnapshotsMenu() {
  const restoreSnapshot = useResume((s) => s.restoreSnapshot);
  const [open, setOpen] = useState(false);
  const [snaps, setSnaps] = useState<Snapshot[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Refresh the list whenever the menu opens (snapshots live in localStorage).
  useEffect(() => {
    if (!open) return;
    setSnaps(listSnapshots());
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-cocoa-soft hover:text-olive-ink px-2 py-1.5 rounded-full hover:bg-cream2 flex items-center gap-1"
        title="restore an automatic snapshot"
      >
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8a5 5 0 1 0 1.4-3.5" />
          <path d="M3 2v3h3" />
        </svg>
        history
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg z-50 min-w-[280px] py-1">
          <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-cocoa-soft">
            automatic snapshots
          </div>
          {snaps.length === 0 ? (
            <div className="px-3 py-4 text-xs text-cocoa-soft italic text-center">
              no snapshots yet — taken before any &ldquo;clear&rdquo;, &ldquo;sample&rdquo;,
              or import.
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto thin-scroll">
              {snaps.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-2 px-3 py-2 hover:bg-cream2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      restoreSnapshot(s.data);
                      setOpen(false);
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm text-olive-ink truncate">
                      {s.data.profile.fullName || 'Untitled resume'}
                    </div>
                    <div className="text-[10px] text-cocoa-soft mt-0.5 truncate">
                      {s.reason} · {relativeTime(s.takenAt)}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSnapshot(s.id);
                      setSnaps(listSnapshots());
                    }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-cocoa-soft hover:text-strawberry-deep px-1"
                    title="delete snapshot"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {snaps.length > 0 && (
            <div className="border-t border-cocoa/10 mt-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete all snapshots? This cannot be undone.')) {
                    clearSnapshots();
                    setSnaps([]);
                  }
                }}
                className="block w-full text-left px-3 py-2 text-xs text-cocoa-soft hover:text-strawberry-deep hover:bg-cream2"
              >
                clear all snapshots
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
