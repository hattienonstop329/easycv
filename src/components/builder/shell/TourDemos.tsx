'use client';

// Inline mock-UI demos shown above each onboarding tour step.
// They use real brand colors and recreate the actual interface fragments
// (toolbar toggle, panel pills, preview hover, export menu) so users see
// exactly what the step is about.

export type DemoKind = 'mode' | 'panels' | 'click' | 'export';

export function TourDemo({ kind }: { kind: DemoKind }) {
  return (
    <div className="bg-cream border border-cocoa/10 rounded-xl overflow-hidden mb-5 select-none">
      <div className="bg-paper border-b border-cocoa/10 px-3 py-1.5 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-strawberry/60" />
        <span className="w-2 h-2 rounded-full bg-stone2" />
        <span className="w-2 h-2 rounded-full bg-matcha/70" />
        <span className="ml-2 text-[9px] text-cocoa-soft">easycv</span>
      </div>
      <div className="p-4 paper-bg min-h-[150px] flex items-center justify-center">
        {kind === 'mode' && <ModeDemo />}
        {kind === 'panels' && <PanelsDemo />}
        {kind === 'click' && <ClickDemo />}
        {kind === 'export' && <ExportDemo />}
      </div>
    </div>
  );
}

function ModeDemo() {
  return (
    <div className="flex flex-col items-center gap-3 relative">
      <div className="flex items-stretch bg-cream2 border border-cocoa/15 rounded-full p-0.5 shadow-inner">
        <button
          type="button"
          className="px-4 py-1 rounded-full text-xs font-medium bg-olive-ink text-paper shadow-sm flex items-center gap-1.5"
        >
          <span className="opacity-90">▤</span>
          resume
        </button>
        <button
          type="button"
          className="px-4 py-1 rounded-full text-xs font-medium text-cocoa-soft flex items-center gap-1.5"
        >
          <span className="opacity-60">✉</span>
          letter
        </button>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-hand)] text-strawberry-deep -rotate-2">
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="#C77D7D" strokeWidth="1.4" strokeLinecap="round">
          <path d="M2 10 Q 11 1 19 8" />
          <path d="M16 5 L 19 8 L 16 11" />
        </svg>
        flip between the two
      </div>
    </div>
  );
}

function PanelsDemo() {
  const pills = [
    { label: 'profile', icon: '◐', active: false },
    { label: 'experience', icon: '⌗', active: true },
    { label: 'projects', icon: '✦', active: false },
    { label: 'skills', icon: '◇', active: false },
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1 max-w-full">
        {pills.map((p) => (
          <span
            key={p.label}
            className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap font-[family-name:var(--font-hand)] text-sm ${
              p.active
                ? 'bg-olive-ink text-paper'
                : 'text-cocoa-soft bg-cream2/80'
            }`}
          >
            <span className="opacity-70 mr-0.5">{p.icon}</span>
            {p.label}
          </span>
        ))}
      </div>
      <div className="text-[10px] text-cocoa-soft font-[family-name:var(--font-hand)] text-sm -rotate-1">
        ↑ tap any pill to switch panels
      </div>
    </div>
  );
}

function ClickDemo() {
  return (
    <div className="relative w-full max-w-[260px]">
      {/* Mini A4 page mock */}
      <div className="bg-white border border-cocoa/15 shadow-sm p-3 rounded-sm">
        <div className="text-[9px] font-bold text-olive-ink leading-none">Aria Hollis</div>
        <div className="text-[7px] text-cocoa-soft">Senior Designer</div>
        <div className="border-t border-cocoa/15 my-2" />
        <div
          className="rounded-sm px-1.5 py-1 relative"
          style={{
            backgroundColor: 'color-mix(in srgb, #3D4A2A 14%, transparent)',
            outline: '2px dashed color-mix(in srgb, #3D4A2A 70%, transparent)',
            outlineOffset: 4,
          }}
        >
          <div className="text-[7px] uppercase tracking-widest text-olive-ink font-bold">
            Experience
          </div>
          <div className="text-[7px] text-cocoa mt-0.5">Marigold Studio · 2022—Now</div>
          <div className="text-[6px] text-cocoa-soft">— Led the editor redesign…</div>

          {/* Floating edit badge */}
          <div
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-paper shadow-md"
            style={{ background: '#3D4A2A' }}
          >
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#FBF8F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 1.5l3.5 3.5L4.5 15H1v-3.5z" />
              <path d="M9.5 3l3.5 3.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating "click to edit" pill */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
        <div className="bg-olive-ink text-paper text-[8px] uppercase tracking-widest px-2 py-1 rounded-full shadow-md flex items-center gap-1">
          <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 1.5l3.5 3.5L4.5 15H1v-3.5z" />
            <path d="M9.5 3l3.5 3.5" />
          </svg>
          click to edit
        </div>
      </div>
    </div>
  );
}

function ExportDemo() {
  return (
    <div className="relative">
      {/* Split button */}
      <div className="flex items-stretch bg-olive-ink rounded-full overflow-hidden shadow-sm">
        <span className="text-paper pl-3.5 pr-2 py-1.5 text-xs font-medium">export pdf</span>
        <span className="self-stretch flex items-center">
          <span className="w-px h-3 bg-paper/25" />
        </span>
        <span className="text-paper pl-1.5 pr-2.5 py-1.5 flex items-center">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor" className="rotate-180">
            <path d="M2 4l3 3 3-3z" />
          </svg>
        </span>
      </div>

      {/* Open dropdown below */}
      <div className="absolute right-0 top-full mt-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg min-w-[170px] py-1 text-[10px]">
        <div className="px-2.5 py-0.5 text-[8px] uppercase tracking-widest text-cocoa-soft">
          export as
        </div>
        <div className="px-2.5 py-1 text-cocoa hover:bg-cream2">▢ png image</div>
        <div className="px-2.5 py-1 text-cocoa hover:bg-cream2">≡ plain text</div>
        <div className="px-2.5 py-1 text-cocoa hover:bg-cream2">{`{ }`} json resume</div>
        <div className="px-2.5 py-1 text-cocoa hover:bg-cream2">✦ easycv json</div>
      </div>
    </div>
  );
}
