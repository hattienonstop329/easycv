'use client';

import { create } from 'zustand';

interface MetricsStore {
  // Live measurement of the resume preview's rendered height (CSS pixels).
  contentHeightPx: number;
  // The active page format's height in CSS pixels.
  pageHeightPx: number;
  setMetrics: (m: { contentHeightPx: number; pageHeightPx: number }) => void;
}

export const usePreviewMetrics = create<MetricsStore>((set) => ({
  contentHeightPx: 0,
  pageHeightPx: 0,
  setMetrics: (m) => set(m),
}));

export function isOverflowing(state: MetricsStore): boolean {
  return state.pageHeightPx > 0 && state.contentHeightPx > state.pageHeightPx + 4;
}

export function pageCount(state: MetricsStore): number {
  if (state.pageHeightPx === 0) return 1;
  return Math.max(1, Math.ceil(state.contentHeightPx / state.pageHeightPx));
}
