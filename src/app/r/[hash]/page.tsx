import Link from 'next/link';
import type { Metadata } from 'next';
import { decodeResumeFromHash } from '@/lib/share';
import { ViewerActions } from './ViewerActions';
import { ViewerPaper } from './ViewerPaper';

interface PageProps {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hash } = await params;
  const data = decodeResumeFromHash(hash);
  if (!data) {
    return { title: 'easycv · shared resume', description: 'A resume shared with you via easycv.' };
  }
  const name = data.profile.fullName || 'A resume';
  const title = data.profile.title ? `${name} — ${data.profile.title}` : name;
  return {
    title: `${title} · easycv`,
    description:
      data.profile.summary?.slice(0, 160) ||
      `${name}'s resume, shared via easycv. View, download, or make your own.`,
    openGraph: {
      title,
      description: data.profile.summary?.slice(0, 160),
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: data.profile.summary?.slice(0, 160),
    },
  };
}

export default async function PublicResumePage({ params }: PageProps) {
  const { hash } = await params;
  const data = decodeResumeFromHash(hash);

  if (!data) {
    return (
      <main className="paper-bg min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-[family-name:var(--font-hand)] text-5xl text-strawberry-deep mb-4">
            oh no ✦
          </div>
          <p className="text-cocoa-soft mb-6">
            couldn&apos;t decode this share link — it may be corrupted or truncated.
          </p>
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

  const isA4 = data.customization.format === 'A4';
  const pageWidth = isA4 ? '210mm' : '215.9mm';
  const pageHeight = isA4 ? '297mm' : '279.4mm';

  return (
    <main className="paper-bg min-h-screen flex flex-col">
      <header className="no-print sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-cocoa/15 px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-[family-name:var(--font-hand)] text-xl md:text-2xl text-olive font-bold">
            easy<span className="text-strawberry-deep">cv</span>
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-cocoa-soft border-l border-cocoa/15 pl-2">
            shared · view-only
          </span>
        </Link>

        <div className="hidden md:block text-sm text-cocoa-soft truncate text-center flex-1">
          {data.profile.fullName ? (
            <>
              <span className="text-olive-ink font-medium">{data.profile.fullName}</span>
              {data.profile.title && (
                <span className="text-cocoa-soft"> · {data.profile.title}</span>
              )}
            </>
          ) : (
            'untitled resume'
          )}
        </div>

        <ViewerActions data={data} />
      </header>

      <ViewerPaper data={data} pageWidth={pageWidth} pageHeight={pageHeight} />

      <footer className="no-print border-t border-cocoa/10 bg-paper/60 backdrop-blur px-4 md:px-8 py-4 text-center text-xs text-cocoa-soft">
        made with{' '}
        <Link href="/" className="text-olive-ink hover:text-olive font-medium underline-offset-2 hover:underline">
          easycv
        </Link>
        {' '}— a local-first resume builder.{' '}
        <Link href="/builder" className="text-strawberry-deep hover:text-strawberry font-medium">
          start your own →
        </Link>
      </footer>
    </main>
  );
}
