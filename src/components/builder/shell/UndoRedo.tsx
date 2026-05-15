'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useResume } from '@/lib/store';

function useTemporalSnapshot() {
  const subscribe = (cb: () => void) => useResume.temporal.subscribe(cb);
  const get = () => useResume.temporal.getState();
  const ssr = () => useResume.temporal.getState();
  return useSyncExternalStore(subscribe, get, ssr);
}

export function UndoRedo() {
  const t = useTemporalSnapshot();
  const canUndo = t.pastStates.length > 0;
  const canRedo = t.futureStates.length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      const editing = tag === 'input' || tag === 'textarea';
      if (e.key === 'z' && !e.shiftKey) {
        // Allow native undo inside text fields
        if (editing) return;
        e.preventDefault();
        useResume.temporal.getState().undo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        if (editing) return;
        e.preventDefault();
        useResume.temporal.getState().redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex items-center gap-0.5">
      <IconBtn
        title="undo (⌘Z)"
        disabled={!canUndo}
        onClick={() => useResume.temporal.getState().undo()}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h6a3 3 0 010 6H7" />
          <path d="M5 4L2 7l3 3" />
        </svg>
      </IconBtn>
      <IconBtn
        title="redo (⌘⇧Z)"
        disabled={!canRedo}
        onClick={() => useResume.temporal.getState().redo()}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 7H6a3 3 0 000 6h3" />
          <path d="M11 4l3 3-3 3" />
        </svg>
      </IconBtn>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-full text-cocoa-soft hover:text-olive-ink hover:bg-cream2 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cocoa-soft transition"
    >
      {children}
    </button>
  );
}
