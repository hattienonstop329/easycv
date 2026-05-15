'use client';

import { useEffect, useState } from 'react';
import { AI_MODELS, useAIKey } from '@/lib/ai-store';

export function AIKeyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const apiKey = useAIKey((s) => s.apiKey);
  const setApiKey = useAIKey((s) => s.setApiKey);
  const model = useAIKey((s) => s.model);
  const setModel = useAIKey((s) => s.setModel);

  const [draft, setDraft] = useState(apiKey ?? '');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(apiKey ?? '');
      setShow(false);
    }
  }, [open, apiKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = draft.trim();
  const looksValid = trimmed.startsWith('sk-ant-') && trimmed.length > 30;

  const save = () => {
    setApiKey(trimmed.length > 0 ? trimmed : null);
    onClose();
  };

  const masked = apiKey ? `${apiKey.slice(0, 12)}…${apiKey.slice(-4)}` : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-cocoa/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-paper border border-cocoa/15 rounded-3xl shadow-2xl p-6">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="font-[family-name:var(--font-hand)] text-xl text-strawberry-deep -rotate-1 inline-block">
              optional ✦
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-olive-ink font-light">
              ai rewrite settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-cocoa-soft hover:text-olive-ink text-xl leading-none"
            aria-label="close"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-cocoa-soft leading-relaxed mb-4">
          paste an{' '}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-olive-ink underline underline-offset-2"
          >
            anthropic api key
          </a>{' '}
          to enable real ai rewrites in the polish panel. the key lives only in your browser&apos;s
          localStorage and goes only to anthropic — easycv never sees it.
        </p>

        <label className="block text-[10px] uppercase tracking-widest text-cocoa-soft mb-1">
          api key
        </label>
        <div className="flex gap-1.5 mb-2">
          <input
            type={show ? 'text' : 'password'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="sk-ant-…"
            className="flex-1 bg-paper border border-cocoa/15 rounded-xl px-3 py-2 text-sm text-olive-ink focus:outline-none focus:border-matcha focus:ring-2 focus:ring-matcha/20 font-mono"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-xs text-cocoa-soft hover:text-olive-ink px-3 rounded-xl border border-cocoa/15 hover:bg-cream2"
          >
            {show ? 'hide' : 'show'}
          </button>
        </div>
        {trimmed && !looksValid && (
          <div className="text-[11px] text-strawberry-deep mb-2">
            doesn&apos;t look like an anthropic key (should start with <code>sk-ant-</code>).
          </div>
        )}
        {masked && !show && (
          <div className="text-[11px] text-cocoa-soft mb-2">
            currently saved: <code className="text-olive-ink">{masked}</code>
          </div>
        )}

        <label className="block text-[10px] uppercase tracking-widest text-cocoa-soft mb-1 mt-4">
          model
        </label>
        <div className="space-y-1 mb-4">
          {AI_MODELS.map((m) => (
            <label
              key={m.id}
              className={`flex items-start gap-2 px-3 py-2 rounded-xl border cursor-pointer transition ${
                model === m.id
                  ? 'border-olive-ink bg-cream2'
                  : 'border-cocoa/15 hover:bg-cream/60'
              }`}
            >
              <input
                type="radio"
                checked={model === m.id}
                onChange={() => setModel(m.id)}
                className="accent-matcha-deep mt-1"
              />
              <span className="flex-1">
                <span className="text-sm text-olive-ink font-medium">{m.label}</span>
                <span className="block text-[11px] text-cocoa-soft">{m.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          {apiKey && (
            <button
              type="button"
              onClick={() => {
                setApiKey(null);
                setDraft('');
              }}
              className="text-xs text-strawberry-deep hover:text-strawberry"
            >
              clear key
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-cocoa-soft hover:text-olive-ink px-3 py-1.5"
          >
            cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={trimmed.length > 0 && !looksValid}
            className="bg-olive-ink text-paper px-4 py-2 rounded-full text-sm font-medium hover:bg-olive transition disabled:opacity-60"
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}
