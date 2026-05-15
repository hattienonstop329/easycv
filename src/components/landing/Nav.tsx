import Link from 'next/link';
import { Heart } from './Doodles';

export function Nav() {
  return (
    <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 pt-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-3xl font-[family-name:var(--font-hand)] text-olive font-bold tracking-tight">
          easy<span className="text-strawberry-deep">cv</span>
        </span>
        <Heart className="w-4 h-4 wobble" />
      </Link>
      <div className="hidden md:flex items-center gap-8 font-[family-name:var(--font-hand)] text-xl text-cocoa">
        <Link href="/features" className="hover:text-matcha-deep transition">features</Link>
        <Link href="/templates" className="hover:text-matcha-deep transition">templates</Link>
        <Link href="/#how" className="hover:text-matcha-deep transition">how it works</Link>
      </div>
      <Link
        href="/builder"
        className="relative inline-flex items-center gap-2 bg-olive-ink text-paper px-5 py-2.5 rounded-full font-medium hover:bg-olive transition scribble-shadow"
      >
        start writing →
      </Link>
    </nav>
  );
}
