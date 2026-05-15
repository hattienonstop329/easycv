'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { Heart } from '@/components/landing/Doodles';
import { ResumeData } from '@/lib/types';
import { encodeResumeToHash, makeShareUrl } from '@/lib/share';
import {
  exportPreviewToPng,
  fromJsonResume,
  toJsonResume,
  toPlainText,
  letterToPlainText,
  JsonResume,
} from '@/lib/exporters';
import { UndoRedo } from './UndoRedo';
import { VersionPicker } from './VersionPicker';
import { ModeToggle } from './ModeToggle';
import { SavedTimestamp } from './SavedTimestamp';
import { SnapshotsMenu } from './SnapshotsMenu';
import { DailyPromptChip } from './DailyPromptChip';
import type { DocumentMode } from './PanelSwitcher';

function downloadBlob(content: BlobPart, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeFilename(name: string | undefined, fallback: string): string {
  return (name?.trim() || fallback).replace(/\s+/g, '_').replace(/[^A-Za-z0-9_.-]/g, '');
}

export function Toolbar({
  mode = 'resume',
  setMode,
}: {
  mode?: DocumentMode;
  setMode?: (m: DocumentMode) => void;
}) {
  const data = useResume((s) => s.data);
  const reset = useResume((s) => s.reset);
  const clear = useResume((s) => s.clear);
  const loadResume = useResume((s) => s.loadResume);
  const isLetter = mode === 'letter';
  const [moreOpen, setMoreOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const baseName = safeFilename(
    data.profile.fullName,
    isLetter ? 'cover_letter' : 'resume',
  ) + (isLetter ? '_letter' : '');

  const printPdf = () => {
    if (typeof window === 'undefined') return;
    const size = data.customization.format === 'A4' ? 'A4' : 'letter';
    const styleEl = document.createElement('style');
    styleEl.id = 'easycv-print-size';
    styleEl.textContent = `@page { size: ${size}; margin: 0; }`;
    document.head.appendChild(styleEl);
    const originalTitle = document.title;
    const docKind = isLetter ? 'Cover Letter' : 'Resume';
    document.title = `${data.profile.fullName?.trim() || docKind} — ${docKind}`;
    const cleanup = () => {
      styleEl.remove();
      document.title = originalTitle;
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
  };

  const exportEasycvJson = () => {
    downloadBlob(JSON.stringify(data, null, 2), 'application/json', `${baseName}.easycv.json`);
  };

  const exportJsonResume = () => {
    downloadBlob(JSON.stringify(toJsonResume(data), null, 2), 'application/json', `${baseName}.jsonresume.json`);
  };

  const exportPlainText = () => {
    const content = isLetter ? letterToPlainText(data) : toPlainText(data);
    downloadBlob(content, 'text/plain', `${baseName}.txt`);
  };

  const exportPng = async () => {
    try {
      flashToast('rendering png…');
      await exportPreviewToPng(`${baseName}.png`);
      flashToast('png saved ✦');
    } catch {
      flashToast("png export failed — try again");
    }
  };

  const importFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = JSON.parse(String(reader.result));
          // Detect: easycv format has `template` + `customization`, JSON Resume has `basics`.
          if (raw && typeof raw === 'object' && 'template' in raw && 'customization' in raw) {
            loadResume(raw as ResumeData);
            flashToast('easycv resume imported ✦');
          } else if (raw && typeof raw === 'object' && 'basics' in raw) {
            loadResume(fromJsonResume(raw as JsonResume, data));
            flashToast('json resume imported ✦');
          } else {
            alert('Could not recognize this file as easycv or JSON Resume format.');
          }
        } catch {
          alert('Could not read that file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const copyShareLink = async () => {
    const hash = encodeResumeToHash(data);
    const url = makeShareUrl(hash);
    try {
      await navigator.clipboard.writeText(url);
      flashToast('share link copied ✦');
    } catch {
      window.prompt('copy this link:', url);
    }
  };

  return (
    <div className="no-print h-14 md:h-16 border-b border-cocoa/15 bg-paper/90 backdrop-blur sticky top-0 z-30 px-2.5 md:px-6 flex items-center justify-between gap-1.5 md:gap-2 relative">
      <div className="flex items-center gap-1.5 md:gap-3 shrink-0 min-w-0">
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <span className="font-[family-name:var(--font-hand)] text-xl md:text-2xl text-olive font-bold">
            easy<span className="text-strawberry-deep">cv</span>
          </span>
          <Heart className="w-3 h-3 wobble hidden sm:block" />
        </Link>
        <div className="hidden sm:block">
          <UndoRedo />
        </div>
      </div>

      {setMode && (
        <>
          {/* Desktop: centered absolute */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <ModeToggle mode={mode} setMode={setMode} />
            <DailyPromptChip />
          </div>
          {/* Mobile: inline so it doesn't collide with the right-side actions */}
          <div className="md:hidden">
            <ModeToggle mode={mode} setMode={setMode} />
          </div>
        </>
      )}

      <div className="hidden 2xl:flex items-center gap-3 text-xs text-cocoa-soft truncate">
        <SavedTimestamp />
        <span>·</span>
        <span>{isLetter ? data.letter.template : data.template}</span>
        <span>·</span>
        <span>{data.customization.format}</span>
      </div>

      <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
        <div className="hidden md:block">
          <VersionPicker />
        </div>

        <button
          onClick={copyShareLink}
          className="hidden md:inline-flex text-xs text-cocoa-soft hover:text-olive-ink px-3 py-1.5 rounded-full border border-cocoa/15 hover:bg-cream2 items-center gap-1"
          title="copy a private link to this resume"
        >
          ↗ share
        </button>

        <button
          onClick={importFile}
          className="hidden md:inline-flex text-xs text-cocoa-soft hover:text-olive-ink px-2 py-1.5 rounded-full hover:bg-cream2"
          title="import easycv or JSON Resume file"
        >
          ↑ import
        </button>

        <div className="hidden md:block">
          <SnapshotsMenu />
        </div>

        <div ref={moreRef} className="relative md:hidden">
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className="text-[11px] text-cocoa-soft hover:text-olive-ink px-2 py-1 rounded-full border border-cocoa/15 hover:bg-cream2"
            aria-label="more actions"
          >
            ⋯
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-full mt-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg z-40 min-w-[200px] py-1">
              <MenuItem onClick={() => { copyShareLink(); setMoreOpen(false); }}>↗ copy share link</MenuItem>
              <MenuItem onClick={() => { importFile(); setMoreOpen(false); }}>↑ import file</MenuItem>
              <MenuDivider />
              <MenuLabel>export as</MenuLabel>
              <MenuItem onClick={() => { printPdf(); setMoreOpen(false); }}>· pdf</MenuItem>
              <MenuItem onClick={() => { exportPng(); setMoreOpen(false); }}>· png image</MenuItem>
              <MenuItem onClick={() => { exportPlainText(); setMoreOpen(false); }}>· plain text (ATS)</MenuItem>
              <MenuItem onClick={() => { exportJsonResume(); setMoreOpen(false); }}>· json resume</MenuItem>
              <MenuItem onClick={() => { exportEasycvJson(); setMoreOpen(false); }}>· easycv json</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => { reset(); setMoreOpen(false); }}>load sample</MenuItem>
              <MenuItem onClick={() => { clear(); setMoreOpen(false); }} danger>clear all</MenuItem>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button onClick={clear} className="text-xs text-cocoa-soft hover:text-strawberry-deep px-2 py-1.5">
            clear
          </button>
          <button onClick={reset} className="text-xs text-cocoa-soft hover:text-olive-ink px-2 py-1.5">
            sample
          </button>
        </div>

        <div ref={exportRef} className="relative hidden md:block">
          <div className="group flex items-stretch bg-olive-ink rounded-full overflow-hidden hover:bg-olive transition shadow-sm">
            <button
              onClick={printPdf}
              className="text-paper pl-5 pr-3 py-2 text-sm font-medium hover:bg-white/10 transition flex items-center"
            >
              export pdf
            </button>
            <span aria-hidden className="self-stretch flex items-center">
              <span className="w-px h-4 bg-paper/25" />
            </span>
            <button
              onClick={() => setExportOpen((o) => !o)}
              className="text-paper pl-2 pr-3 py-2 hover:bg-white/10 transition flex items-center"
              title="other export formats"
              aria-label="more export options"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
                className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l3 3 3-3z" />
              </svg>
            </button>
          </div>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg z-40 min-w-[210px] py-1">
              <MenuLabel>export as</MenuLabel>
              <MenuItem onClick={() => { exportPng(); setExportOpen(false); }}>
                <span className="text-cocoa-soft mr-1.5">▢</span>png image
              </MenuItem>
              <MenuItem onClick={() => { exportPlainText(); setExportOpen(false); }}>
                <span className="text-cocoa-soft mr-1.5">≡</span>plain text (ATS-safe)
              </MenuItem>
              <MenuItem onClick={() => { exportJsonResume(); setExportOpen(false); }}>
                <span className="text-cocoa-soft mr-1.5">{ }</span>json resume schema
              </MenuItem>
              <MenuItem onClick={() => { exportEasycvJson(); setExportOpen(false); }}>
                <span className="text-cocoa-soft mr-1.5">✦</span>easycv json
              </MenuItem>
            </div>
          )}
        </div>

        <button
          onClick={printPdf}
          className="md:hidden bg-olive-ink text-paper px-2.5 py-1 rounded-full text-[11px] font-medium hover:bg-olive transition whitespace-nowrap"
        >
          ↓ pdf
        </button>
      </div>

      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-olive-ink text-paper text-xs px-4 py-2 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 text-sm hover:bg-cream2 ${
        danger ? 'text-strawberry-deep' : 'text-cocoa'
      }`}
    >
      {children}
    </button>
  );
}

function MenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-cocoa-soft">{children}</div>;
}

function MenuDivider() {
  return <div className="h-px bg-cocoa/10 my-1" />;
}
