'use client';

import { create } from 'zustand';

export interface ToastItem {
  id: string;
  message: string;
  tone: 'info' | 'praise';
  // Optional dedup key — if a toast with this key was shown in the last `dedupMs`,
  // skip showing it again.
  dedupKey?: string;
  shownAt: number;
}

interface ToastStore {
  toasts: ToastItem[];
  lastDedupSeen: Record<string, number>;
  push: (msg: string, opts?: { tone?: ToastItem['tone']; dedupKey?: string; dedupMs?: number }) => void;
  dismiss: (id: string) => void;
}

let counter = 0;

export const useToasts = create<ToastStore>((set, get) => ({
  toasts: [],
  lastDedupSeen: {},
  push: (message, opts) => {
    const now = Date.now();
    const tone = opts?.tone ?? 'info';
    const dedupKey = opts?.dedupKey;
    const dedupMs = opts?.dedupMs ?? 60_000;

    if (dedupKey) {
      const last = get().lastDedupSeen[dedupKey];
      if (last && now - last < dedupMs) return;
    }

    const id = `t-${++counter}`;
    set((s) => ({
      toasts: [...s.toasts, { id, message, tone, dedupKey, shownAt: now }],
      lastDedupSeen: dedupKey
        ? { ...s.lastDedupSeen, [dedupKey]: now }
        : s.lastDedupSeen,
    }));

    // Auto-dismiss after 3.5s.
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
