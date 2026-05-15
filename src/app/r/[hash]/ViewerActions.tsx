'use client';

import { useRouter } from 'next/navigation';
import { useResume } from '@/lib/store';
import { ResumeData } from '@/lib/types';
import { exportPreviewToPdf } from '@/lib/exporters';
import { useState } from 'react';

function safeFilename(name: string | undefined, fallback: string): string {
  return (name?.trim() || fallback).replace(/\s+/g, '_').replace(/[^A-Za-z0-9_.-]/g, '');
}

export function ViewerActions({ data }: { data: ResumeData }) {
  const router = useRouter();
  const loadResume = useResume((s) => s.loadResume);
  const [busy, setBusy] = useState<'pdf' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const editACopy = () => {
    if (!window.confirm('open this resume in the builder? your current draft will be saved as a snapshot first.')) {
      return;
    }
    loadResume(data);
    router.push('/builder');
  };

  const downloadPdf = async () => {
    if (busy) return;
    setBusy('pdf');
    setToast('rendering pdf…');
    try {
      const filename = `${safeFilename(data.profile.fullName, 'resume')}.pdf`;
      await exportPreviewToPdf(filename, data.customization.format);
      setToast('pdf saved ✦');
    } catch {
      setToast('pdf export failed');
    } finally {
      setBusy(null);
      setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={downloadPdf}
        disabled={busy !== null}
        className="text-xs text-cocoa-soft hover:text-olive-ink px-3 py-1.5 rounded-full border border-cocoa/15 hover:bg-cream2 disabled:opacity-60"
      >
        {busy === 'pdf' ? 'rendering…' : '↓ pdf'}
      </button>
      <button
        onClick={editACopy}
        className="bg-olive-ink text-paper px-4 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-olive transition"
        title="opens this resume in your builder — your existing draft is snapshotted first"
      >
        ✎ edit a copy
      </button>
      {toast && (
        <div className="absolute top-full right-0 mt-2 bg-olive-ink text-paper text-xs px-3 py-1.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
