'use client';

import { create } from 'zustand';

export interface NavRequest {
  mode?: 'resume' | 'letter';
  panel?: string; // PanelId — string here to keep ui-store free of cyclic imports
}

// Transient UI state that should NOT be persisted (no localStorage).
// Used for things like "after click-to-edit, scroll-and-focus this specific field."
interface UIStore {
  // A short string the receiving panel matches against, e.g.
  //   "exp:e1.bullets.2"  → ExperiencePanel scrolls to job e1's third bullet
  //   "edu:ed1"           → EducationPanel scrolls to that entry
  //   "proj:p1"           → ProjectsPanel
  //   "skill:sk1"         → SkillsPanel
  focusTarget: string | null;
  setFocusTarget: (t: string | null) => void;
  clearFocusTarget: () => void;

  // Onboarding tour: open from anywhere by setting tourOpen → true.
  tourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;

  // One-shot navigation requests from anywhere → consumed by the Shell.
  navRequest: NavRequest | null;
  requestNav: (n: NavRequest) => void;
  clearNavRequest: () => void;

  // AI settings dialog — opened from the toolbar, the polish panel, or any
  // bullet's "AI rewrite" affordance when no key is set.
  aiDialogOpen: boolean;
  openAIDialog: () => void;
  closeAIDialog: () => void;
}

export const useUI = create<UIStore>((set) => ({
  focusTarget: null,
  setFocusTarget: (t) => set({ focusTarget: t }),
  clearFocusTarget: () => set({ focusTarget: null }),
  tourOpen: false,
  openTour: () => set({ tourOpen: true }),
  closeTour: () => set({ tourOpen: false }),
  navRequest: null,
  requestNav: (n) => set({ navRequest: n }),
  clearNavRequest: () => set({ navRequest: null }),
  aiDialogOpen: false,
  openAIDialog: () => set({ aiDialogOpen: true }),
  closeAIDialog: () => set({ aiDialogOpen: false }),
}));

// Stable hooks for the AI dialog — each selects a primitive so Zustand only
// re-renders consumers when the relevant slice changes.
export const useAIDialogOpen = () => useUI((s) => s.aiDialogOpen);
export const useOpenAIDialog = () => useUI((s) => s.openAIDialog);
export const useCloseAIDialog = () => useUI((s) => s.closeAIDialog);
