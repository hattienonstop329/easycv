'use client';

import type { DocumentMode } from './PanelSwitcher';

export function ModeToggle({
  mode,
  setMode,
}: {
  mode: DocumentMode;
  setMode: (m: DocumentMode) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex items-stretch bg-cream2 border border-cocoa/15 rounded-full p-0.5 shadow-inner shrink-0"
    >
      <Tab active={mode === 'resume'} onClick={() => setMode('resume')} icon="▤">
        resume
      </Tab>
      <Tab active={mode === 'letter'} onClick={() => setMode('letter')} icon="✉">
        letter
      </Tab>
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-2.5 md:px-4 py-1 rounded-full text-[11px] md:text-sm font-medium transition flex items-center gap-1 md:gap-1.5 whitespace-nowrap ${
        active
          ? 'bg-olive-ink text-paper shadow-sm'
          : 'text-cocoa-soft hover:text-olive-ink'
      }`}
    >
      <span className={active ? 'opacity-90' : 'opacity-60'}>{icon}</span>
      {children}
    </button>
  );
}
