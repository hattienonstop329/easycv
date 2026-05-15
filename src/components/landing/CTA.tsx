import Link from 'next/link';
import { Heart, Star } from './Doodles';

export function CTA() {
  return (
    <section className="px-6 md:px-12 py-32 relative">
      <Heart className="absolute top-12 left-[20%] w-8 h-8 wobble" />
      <Star className="absolute bottom-20 right-[25%] w-12 h-12 float-slow" color="#C77D7D" />
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-olive-ink leading-tight font-light">
          your story is
          <br />
          <span className="font-[family-name:var(--font-hand)] italic font-bold text-matcha-deep">already lovely.</span>
        </h2>
        <p className="mt-6 text-cocoa-soft text-lg max-w-md mx-auto">
          let&apos;s give it a page worth printing.
        </p>
        <Link
          href="/builder"
          className="mt-10 inline-flex items-center gap-2 bg-olive-ink text-paper px-10 py-5 rounded-full text-xl font-medium hover:bg-olive transition scribble-shadow"
        >
          start writing
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
