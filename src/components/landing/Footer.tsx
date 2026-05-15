import { Heart } from './Doodles';

export function Footer() {
  return (
    <footer className="px-6 md:px-12 py-10 border-t-2 border-cocoa/15 bg-cream/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-olive font-bold">
            easy<span className="text-strawberry-deep">cv</span>
          </span>
          <Heart className="w-3 h-3" />
        </div>
        <div className="text-sm text-cocoa-soft">
          made with paper, ink, and a lot of tea.
        </div>
        <div className="text-sm text-cocoa-soft font-[family-name:var(--font-hand)] text-lg">
          © 2026 · all yours, all local
        </div>
      </div>
    </footer>
  );
}
