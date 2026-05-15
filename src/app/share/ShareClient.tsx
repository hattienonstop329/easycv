'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { decodeResumeFromHash } from '@/lib/share';
import { ResumeData } from '@/lib/types';
import { ResumePreview } from '@/components/templates';
import { useResume } from '@/lib/store';
import { useRouter } from 'next/navigation';

export function ShareClient() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const loadResume = useResume((s) => s.loadResume);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      setError('This share link is empty.');
      return;
    }
    const parsed = decodeResumeFromHash(hash);
    if (!parsed) {
      setError("Couldn't decode this share link — it may be corrupted.");
      return;
    }
    setData(parsed);
  }, []);

  const editACopy = () => {
    if (!data) return;
    loadResume(data);
    router.push('/builder');
  };

  const printPdf = () => {
    if (!data) return;
    const size = data.customization.format === 'A4' ? 'A4' : 'letter';
    const styleEl = document.createElement('style');
    styleEl.id = 'easycv-print-size';
    styleEl.textContent = `@page { size: ${size}; margin: 0; }`;
    document.head.appendChild(styleEl);
    const originalTitle = document.title;
    document.title = `${data.profile.fullName || 'Resume'} — Resume`;
    const cleanup = () => {
      styleEl.remove();
      document.title = originalTitle;
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
  };

  if (error) {
    return (
      <main className="paper-bg min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-[family-name:var(--font-hand)] text-5xl text-strawberry-deep mb-4">
            oh no ✦
          </div>
          <p className="text-cocoa-soft mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-olive-ink text-paper px-6 py-3 rounded-full font-medium hover:bg-olive transition"
          >
            go home →
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="paper-bg min-h-screen flex items-center justify-center text-cocoa-soft font-[family-name:var(--font-hand)] text-2xl">
        unfolding…
      </main>
    );
  }

  return (
    <main className="paper-bg min-h-screen">
      <header className="no-print sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-cocoa/15 px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-hand)] text-xl md:text-2xl text-olive font-bold">
            easy<span className="text-strawberry-deep">cv</span>
          </span>
        </Link>

        <div className="text-xs text-cocoa-soft hidden md:block">
          shared resume · view-only
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={printPdf}
            className="text-xs text-cocoa-soft hover:text-olive-ink px-3 py-1.5 rounded-full border border-cocoa/15 hover:bg-cream2"
          >
            ↓ pdf
          </button>
          <button
            onClick={editACopy}
            className="bg-olive-ink text-paper px-4 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-olive transition"
            title="Loads this resume into your builder. Your existing resume is replaced — duplicate it first if you want to keep both."
          >
            edit a copy →
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 flex justify-center">
        <div
          id="resume-preview"
          className="bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
          style={{
            width: data.customization.format === 'A4' ? '210mm' : '215.9mm',
            minHeight: data.customization.format === 'A4' ? '297mm' : '279.4mm',
          }}
        >
          <ResumePreview data={data} />
        </div>
      </div>
    </main>
  );
}
