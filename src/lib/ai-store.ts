'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIModel = 'claude-haiku-4-5' | 'claude-sonnet-4-6' | 'claude-opus-4-7';

export const AI_MODELS: { id: AIModel; label: string; hint: string }[] = [
  { id: 'claude-haiku-4-5', label: 'Haiku 4.5', hint: 'fastest · cheapest · default' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6', hint: 'balanced quality + speed' },
  { id: 'claude-opus-4-7', label: 'Opus 4.7', hint: 'highest quality · slowest' },
];

interface AIStore {
  apiKey: string | null;
  model: AIModel;
  setApiKey: (key: string | null) => void;
  setModel: (m: AIModel) => void;
}

export const useAIKey = create<AIStore>()(
  persist(
    (set) => ({
      apiKey: null,
      model: 'claude-haiku-4-5',
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
    }),
    { name: 'easycv-ai' },
  ),
);

export function hasAIKey(): boolean {
  return !!useAIKey.getState().apiKey;
}
