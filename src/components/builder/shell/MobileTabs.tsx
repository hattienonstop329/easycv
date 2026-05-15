'use client';

export type MobileView = 'edit' | 'preview';

export function MobileTabs({
  view,
  setView,
}: {
  view: MobileView;
  setView: (v: MobileView) => void;
}) {
  return (
    <div className="lg:hidden no-print fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-paper border-2 border-cocoa/15 rounded-full p-1 shadow-lg flex gap-1">
      <Tab active={view === 'edit'} onClick={() => setView('edit')}>
        ✎ edit
      </Tab>
      <Tab active={view === 'preview'} onClick={() => setView('preview')}>
        ◉ preview
      </Tab>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        active ? 'bg-olive-ink text-paper' : 'text-cocoa-soft hover:text-olive-ink'
      }`}
    >
      {children}
    </button>
  );
}
