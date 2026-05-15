'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useResume } from '@/lib/store';
import { COLOR_THEMES, TEMPLATE_REGISTRY } from '@/lib/design-tokens';
import { useToasts } from '@/lib/toast-store';
import { useUI, useOpenAIDialog } from '@/lib/ui-store';
import {
  exportPreviewToPdf,
  exportPreviewToPng,
  toJsonResume,
  toPlainText,
  letterToPlainText,
} from '@/lib/exporters';
import { encodeResumeToHash, makeShareUrl } from '@/lib/share';
import {
  panelsFor,
  type DocumentMode,
  type PanelId,
} from './PanelSwitcher';

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: 'go' | 'template' | 'theme' | 'do' | 'mode' | 'version' | 'export';
  keywords?: string;
  run: () => void | Promise<void>;
};

interface Props {
  mode: DocumentMode;
  setMode: (m: DocumentMode) => void;
  setPanel: (p: PanelId) => void;
}

function safeFilename(name: string | undefined, fallback: string): string {
  return (name?.trim() || fallback).replace(/\s+/g, '_').replace(/[^A-Za-z0-9_.-]/g, '');
}

function downloadBlob(content: BlobPart, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const GROUP_LABEL: Record<Action['group'], string> = {
  go: 'jump to',
  template: 'switch template',
  theme: 'switch palette',
  do: 'actions',
  mode: 'mode',
  version: 'versions',
  export: 'export',
};

export function CommandPalette({ mode, setMode, setPanel }: Props) {
  const data = useResume((s) => s.data);
  const reset = useResume((s) => s.reset);
  const clearAll = useResume((s) => s.clear);
  const setTemplate = useResume((s) => s.setTemplate);
  const applyThemePreset = useResume((s) => s.applyThemePreset);
  const versions = useResume((s) => s.versions);
  const switchVersion = useResume((s) => s.switchVersion);
  const newVersion = useResume((s) => s.newVersion);
  const openTour = useUI((s) => s.openTour);
  const openAIDialog = useOpenAIDialog();
  const push = useToasts((s) => s.push);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K toggles the palette. Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      // focus the input after the modal mounts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filename = useMemo(
    () =>
      safeFilename(
        data.profile.fullName,
        mode === 'letter' ? 'cover_letter' : 'resume',
      ) + (mode === 'letter' ? '_letter' : ''),
    [data.profile.fullName, mode],
  );

  const actions = useMemo<Action[]>(() => {
    const out: Action[] = [];

    // Mode toggle
    out.push({
      id: 'mode-resume',
      label: 'switch to resume',
      group: 'mode',
      keywords: 'resume cv',
      run: () => setMode('resume'),
    });
    out.push({
      id: 'mode-letter',
      label: 'switch to cover letter',
      group: 'mode',
      keywords: 'letter cover',
      run: () => setMode('letter'),
    });

    // Jump-to-panel
    for (const p of panelsFor(mode)) {
      out.push({
        id: `go-${p.id}`,
        label: `go to ${p.label}`,
        group: 'go',
        keywords: p.label,
        run: () => setPanel(p.id),
      });
    }

    // Templates
    for (const t of TEMPLATE_REGISTRY) {
      if (mode === 'letter') break;
      out.push({
        id: `tpl-${t.id}`,
        label: `template: ${t.name}`,
        hint: t.tag,
        group: 'template',
        keywords: `template ${t.name} ${t.category} ${t.tag}`,
        run: () => {
          setTemplate(t.id);
          setPanel('templates');
          push(`switched to ${t.name}`);
        },
      });
    }

    // Themes
    for (const theme of COLOR_THEMES) {
      out.push({
        id: `theme-${theme.id}`,
        label: `palette: ${theme.name}`,
        group: 'theme',
        keywords: `theme palette color ${theme.name}`,
        run: () => {
          applyThemePreset(theme.id);
          push(`palette → ${theme.name}`);
        },
      });
    }

    // Versions
    for (const v of versions) {
      out.push({
        id: `ver-${v.id}`,
        label: `open version: ${v.name}`,
        group: 'version',
        keywords: `version ${v.name}`,
        run: () => {
          switchVersion(v.id);
          push(`opened "${v.name}"`);
        },
      });
    }
    out.push({
      id: 'ver-new',
      label: 'save as new version…',
      group: 'version',
      keywords: 'version save snapshot',
      run: () => {
        const name = window.prompt('name this version:');
        if (name?.trim()) {
          newVersion(name.trim(), true);
          push(`saved "${name.trim()}"`);
        }
      },
    });

    // Exports
    out.push({
      id: 'exp-pdf',
      label: 'export as PDF',
      group: 'export',
      keywords: 'export download pdf print',
      run: async () => {
        push('rendering pdf…');
        try {
          await exportPreviewToPdf(`${filename}.pdf`, data.customization.format);
          push('pdf saved ✦');
        } catch {
          push('pdf export failed');
        }
      },
    });
    out.push({
      id: 'exp-png',
      label: 'export as PNG',
      group: 'export',
      keywords: 'export download image png',
      run: async () => {
        push('rendering png…');
        try {
          await exportPreviewToPng(`${filename}.png`);
          push('png saved ✦');
        } catch {
          push('png export failed');
        }
      },
    });
    out.push({
      id: 'exp-txt',
      label: 'export as plain text (ATS)',
      group: 'export',
      keywords: 'export ats plain text txt',
      run: () => {
        const content = mode === 'letter' ? letterToPlainText(data) : toPlainText(data);
        downloadBlob(content, 'text/plain', `${filename}.txt`);
        push('text file saved');
      },
    });
    out.push({
      id: 'exp-jr',
      label: 'export as JSON Resume',
      group: 'export',
      keywords: 'export json resume schema',
      run: () => {
        downloadBlob(
          JSON.stringify(toJsonResume(data), null, 2),
          'application/json',
          `${filename}.jsonresume.json`,
        );
        push('json resume saved');
      },
    });
    out.push({
      id: 'exp-easycv',
      label: 'export as easycv JSON',
      group: 'export',
      keywords: 'export json easycv backup',
      run: () => {
        downloadBlob(
          JSON.stringify(data, null, 2),
          'application/json',
          `${filename}.easycv.json`,
        );
        push('backup saved');
      },
    });
    out.push({
      id: 'exp-share',
      label: 'copy share link',
      group: 'export',
      keywords: 'share link url copy',
      run: async () => {
        const url = makeShareUrl(encodeResumeToHash(data));
        try {
          await navigator.clipboard.writeText(url);
          push('share link copied ✦');
        } catch {
          window.prompt('copy this link:', url);
        }
      },
    });

    // Generic actions
    out.push({
      id: 'do-undo',
      label: 'undo',
      group: 'do',
      keywords: 'undo back',
      run: () => useResume.temporal.getState().undo(),
    });
    out.push({
      id: 'do-redo',
      label: 'redo',
      group: 'do',
      keywords: 'redo forward',
      run: () => useResume.temporal.getState().redo(),
    });
    out.push({
      id: 'do-tour',
      label: 'replay onboarding tour',
      group: 'do',
      keywords: 'tour help onboarding intro',
      run: () => openTour(),
    });
    out.push({
      id: 'do-ai',
      label: 'ai settings · add anthropic api key',
      group: 'do',
      keywords: 'ai anthropic claude key api rewrite',
      run: () => openAIDialog(),
    });
    out.push({
      id: 'do-sample',
      label: 'load sample resume',
      group: 'do',
      keywords: 'sample demo example',
      run: () => {
        if (window.confirm('load the sample resume? your current draft will be saved as a snapshot.')) {
          reset();
          push('sample loaded — your previous draft is in snapshots');
        }
      },
    });
    out.push({
      id: 'do-clear',
      label: 'clear everything (start blank)',
      group: 'do',
      keywords: 'clear empty blank reset',
      run: () => {
        if (window.confirm('clear all resume data? your current draft will be saved as a snapshot.')) {
          clearAll();
          push('cleared — your previous draft is in snapshots');
        }
      },
    });

    return out;
  }, [
    mode,
    setMode,
    setPanel,
    setTemplate,
    applyThemePreset,
    versions,
    switchVersion,
    newVersion,
    openTour,
    openAIDialog,
    push,
    reset,
    clearAll,
    data,
    filename,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    const tokens = q.split(/\s+/).filter(Boolean);
    return actions.filter((a) => {
      const hay = `${a.label} ${a.hint ?? ''} ${a.keywords ?? ''} ${a.group}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [actions, query]);

  // Group filtered while preserving order
  const grouped = useMemo(() => {
    const map = new Map<Action['group'], Action[]>();
    for (const a of filtered) {
      const arr = map.get(a.group) ?? [];
      arr.push(a);
      map.set(a.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Reset highlight when filtered list changes shape
  useEffect(() => {
    setHighlight(0);
  }, [query]);

  // Keep highlighted item visible
  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-idx="${highlight}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const a = filtered[highlight];
      if (a) {
        setOpen(false);
        // Defer so the modal can unmount before any heavy work runs
        setTimeout(() => {
          void a.run();
        }, 0);
      }
    }
  };

  let runningIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 bg-cocoa/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xl bg-paper border border-cocoa/15 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-cocoa/10">
          <span className="text-cocoa-soft">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="jump to anything — templates, panels, exports…"
            className="flex-1 bg-transparent outline-none text-base text-cocoa placeholder:text-cocoa-soft"
          />
          <kbd className="text-[10px] uppercase tracking-widest text-cocoa-soft border border-cocoa/20 rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        <div ref={listRef} className="max-h-[420px] overflow-y-auto thin-scroll py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-cocoa-soft">
              <div className="text-2xl mb-2 opacity-50">∅</div>
              nothing matches "{query}"
            </div>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="py-1">
                <div className="px-3 pb-1 text-[10px] uppercase tracking-widest text-cocoa-soft">
                  {GROUP_LABEL[group]}
                </div>
                {items.map((a) => {
                  const idx = runningIdx++;
                  const isActive = idx === highlight;
                  return (
                    <button
                      key={a.id}
                      data-idx={idx}
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => {
                        setOpen(false);
                        setTimeout(() => {
                          void a.run();
                        }, 0);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 transition ${
                        isActive ? 'bg-cream2 text-olive-ink' : 'text-cocoa hover:bg-cream/60'
                      }`}
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm truncate">{a.label}</span>
                        {a.hint && (
                          <span className="block text-[11px] text-cocoa-soft italic truncate">
                            {a.hint}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <span className="text-cocoa-soft text-xs">↵</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-cocoa/10 text-[10px] uppercase tracking-widest text-cocoa-soft bg-cream/60">
          <span>↑↓ navigate · ↵ select</span>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
