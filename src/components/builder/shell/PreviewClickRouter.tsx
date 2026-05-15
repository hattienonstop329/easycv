'use client';

import { MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useUI } from '@/lib/ui-store';
import type { PanelId } from './PanelSwitcher';

const PANEL_NAMES: Record<string, string> = {
  profile: 'profile',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  languages: 'languages',
  certifications: 'certifications',
  awards: 'awards',
  sections: 'sections',
};

const SEEN_KEY = 'easycv-seen-click-edit-hint';

export function PreviewClickRouter({
  children,
  onJump,
  disabled = false,
}: {
  children: ReactNode;
  onJump: (panel: PanelId) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Show a one-time on-canvas hint so users discover the click-to-edit affordance.
  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(SEEN_KEY);
    if (!seen) {
      setShowHint(true);
      const t = setTimeout(() => {
        setShowHint(false);
        window.localStorage.setItem(SEEN_KEY, '1');
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [disabled]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const target = e.target as HTMLElement;
      // Look for the most-specific edit target first (item-level), then fall back to panel.
      const itemEl = target.closest<HTMLElement>('[data-edit-id]');
      const sec = target.closest<HTMLElement>('[data-edit-panel]');
      const panel = sec?.dataset.editPanel;
      if (panel && panel in PANEL_NAMES) {
        if (itemEl?.dataset.editId) {
          useUI.getState().setFocusTarget(itemEl.dataset.editId);
        } else {
          useUI.getState().clearFocusTarget();
        }
        onJump(panel as PanelId);
        setShowHint(false);
        if (typeof window !== 'undefined') window.localStorage.setItem(SEEN_KEY, '1');
      }
    },
    [disabled, onJump],
  );

  const handleHover = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        if (hover) setHover(null);
        return;
      }
      const target = e.target as HTMLElement;
      const sec = target.closest<HTMLElement>('[data-edit-panel]');
      const next = sec?.dataset.editPanel ?? null;
      if (next !== hover) setHover(next);
    },
    [disabled, hover],
  );

  return (
    <div
      className={`relative h-full ${disabled ? '' : 'edit-router-active'}`}
      onClick={handleClick}
      onMouseMove={handleHover}
      onMouseLeave={() => setHover(null)}
    >
      {children}

      {!disabled && hover && (
        <div className="no-print pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-olive-ink text-paper text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 1.5l3.5 3.5L4.5 15H1v-3.5z" />
              <path d="M9.5 3l3.5 3.5" />
            </svg>
            <span>click to edit</span>
            <span className="opacity-60">·</span>
            <span className="opacity-95">{PANEL_NAMES[hover]}</span>
          </div>
        </div>
      )}

      {!disabled && showHint && !hover && (
        <div className="no-print pointer-events-none absolute top-4 right-4 z-30">
          <div className="bg-strawberry text-cocoa text-xs px-3 py-2 rounded-2xl shadow-lg max-w-[180px] -rotate-2 font-[family-name:var(--font-hand)]">
            <div className="text-base leading-tight">tip ✦</div>
            <div className="text-[11px] leading-snug mt-0.5">
              hover any section here, then click to jump to its editor.
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .edit-router-active :global([data-edit-panel]) {
          cursor: pointer;
          position: relative;
          transition: background-color 120ms ease, outline-color 120ms ease;
        }
        .edit-router-active :global([data-edit-panel]:hover) {
          background-color: color-mix(in srgb, var(--accent, #3D4A2A) 14%, transparent);
          outline: 2px dashed color-mix(in srgb, var(--accent, #3D4A2A) 70%, transparent);
          outline-offset: 6px;
          border-radius: 3px;
        }
        .edit-router-active :global([data-edit-panel]:hover::after) {
          content: '';
          position: absolute;
          top: -22px;
          right: -8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent, #3D4A2A);
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23FBF8F1' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M11 1.5l3.5 3.5L4.5 15H1v-3.5z'/><path d='M9.5 3l3.5 3.5'/></svg>");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 11px 11px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
