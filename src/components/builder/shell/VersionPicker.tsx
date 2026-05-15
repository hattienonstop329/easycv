'use client';

import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/lib/store';

export function VersionPicker() {
  const versions = useResume((s) => s.versions);
  const activeId = useResume((s) => s.activeId);
  const switchVersion = useResume((s) => s.switchVersion);
  const newVersion = useResume((s) => s.newVersion);
  const renameVersion = useResume((s) => s.renameVersion);
  const deleteVersion = useResume((s) => s.deleteVersion);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const active = versions.find((v) => v.id === activeId) ?? versions[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setDraftName(currentName);
  };

  const commitRename = () => {
    if (editingId && draftName.trim()) renameVersion(editingId, draftName.trim());
    setEditingId(null);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cocoa/15 hover:bg-cream2 text-xs text-olive-ink max-w-[200px]"
        title="switch resume version"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 4h10M3 8h10M3 12h10" strokeLinecap="round" />
        </svg>
        <span className="truncate">{active?.name ?? 'Resume'}</span>
        <span className="text-cocoa-soft">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-paper border border-cocoa/15 rounded-xl shadow-lg z-50 min-w-[260px] py-2">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-widest text-cocoa-soft">
            your resumes
          </div>
          <div className="max-h-64 overflow-y-auto thin-scroll">
            {versions.map((v) => (
              <div
                key={v.id}
                className={`group flex items-center gap-2 px-3 py-1.5 hover:bg-cream2 ${
                  v.id === activeId ? 'bg-cream2/60' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    switchVersion(v.id);
                    setOpen(false);
                  }}
                  className="flex-1 text-left text-sm text-olive-ink truncate"
                >
                  {editingId === v.id ? (
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-paper border border-cocoa/20 rounded px-2 py-0.5 text-sm w-full"
                    />
                  ) : (
                    <>
                      {v.id === activeId && <span className="text-matcha-deep mr-1">●</span>}
                      {v.name}
                    </>
                  )}
                </button>
                {editingId !== v.id && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(v.id, v.name);
                      }}
                      className="text-xs text-cocoa-soft hover:text-olive-ink px-1.5"
                      title="rename"
                    >
                      ✎
                    </button>
                    {versions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${v.name}"? This can't be undone.`)) {
                            deleteVersion(v.id);
                          }
                        }}
                        className="text-xs text-cocoa-soft hover:text-strawberry-deep px-1.5"
                        title="delete"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-cocoa/10 mt-1 pt-1">
            <button
              type="button"
              onClick={() => {
                const name = prompt('Name this resume version:', `Version ${versions.length + 1}`);
                if (name?.trim()) {
                  newVersion(name.trim(), true);
                  setOpen(false);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm text-cocoa hover:bg-cream2"
            >
              + duplicate current
            </button>
            <button
              type="button"
              onClick={() => {
                const name = prompt('Name this resume version:', `Version ${versions.length + 1}`);
                if (name?.trim()) {
                  newVersion(name.trim(), false);
                  setOpen(false);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm text-cocoa hover:bg-cream2"
            >
              + start blank
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
