'use client';

import { create } from 'zustand';

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
}

export const useUI = create<UIStore>((set) => ({
  focusTarget: null,
  setFocusTarget: (t) => set({ focusTarget: t }),
  clearFocusTarget: () => set({ focusTarget: null }),
  tourOpen: false,
  openTour: () => set({ tourOpen: true }),
  closeTour: () => set({ tourOpen: false }),
}));
