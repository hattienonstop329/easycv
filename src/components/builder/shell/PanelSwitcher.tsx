'use client';

export type PanelId =
  | 'templates'
  | 'design'
  | 'sections'
  | 'profile'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'languages'
  | 'awards'
  | 'certifications'
  | 'matchjd'
  | 'polish'
  | 'stickers'
  | 'letter';

export type DocumentMode = 'resume' | 'letter';

interface PanelDef {
  id: PanelId;
  label: string;
  icon: string;
}

export const RESUME_PANELS: ReadonlyArray<PanelDef> = [
  { id: 'templates', label: 'templates', icon: '▤' },
  { id: 'design', label: 'design', icon: '◎' },
  { id: 'stickers', label: 'stickers', icon: '✦' },
  { id: 'sections', label: 'sections', icon: '☰' },
  { id: 'profile', label: 'profile', icon: '◐' },
  { id: 'experience', label: 'experience', icon: '⌗' },
  { id: 'projects', label: 'projects', icon: '✦' },
  { id: 'education', label: 'education', icon: '✎' },
  { id: 'skills', label: 'skills', icon: '◇' },
  { id: 'polish', label: 'polish', icon: '✧' },
  { id: 'matchjd', label: 'match jd', icon: '◎' },
  { id: 'languages', label: 'languages', icon: 'A' },
  { id: 'certifications', label: 'certifications', icon: '✓' },
  { id: 'awards', label: 'awards', icon: '★' },
];

export const LETTER_PANELS: ReadonlyArray<PanelDef> = [
  { id: 'templates', label: 'templates', icon: '▤' },
  { id: 'design', label: 'design', icon: '◎' },
  { id: 'letter', label: 'edit letter', icon: '✉' },
];

export const DEFAULT_PANEL_FOR: Record<DocumentMode, PanelId> = {
  resume: 'profile',
  letter: 'letter',
};

export function panelsFor(mode: DocumentMode): ReadonlyArray<PanelDef> {
  return mode === 'letter' ? LETTER_PANELS : RESUME_PANELS;
}

export function PanelSwitcher({
  panel,
  setPanel,
  mode,
}: {
  panel: PanelId;
  setPanel: (p: PanelId) => void;
  mode: DocumentMode;
}) {
  const panels = panelsFor(mode);
  return (
    <div className="border-b border-cocoa/10 bg-cream/60 px-3 py-2 flex gap-1 overflow-x-auto thin-scroll">
      {panels.map((p) => (
        <button
          key={p.id}
          onClick={() => setPanel(p.id)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap font-[family-name:var(--font-hand)] text-base transition ${
            panel === p.id
              ? 'bg-olive-ink text-paper'
              : 'text-cocoa-soft hover:text-olive-ink hover:bg-cream2'
          }`}
        >
          <span className="opacity-70 mr-1">{p.icon}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}
