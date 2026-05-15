'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import {
  DEFAULT_CUSTOMIZATION,
  DEFAULT_RESUME,
  EMPTY_LETTER,
  ResumeData,
  Section,
  TemplateId,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  AwardItem,
  Customization,
  CoverLetter,
  LetterTemplateId,
} from './types';
import { COLOR_THEMES, getTemplateMeta } from './design-tokens';
import { pushSnapshot } from './snapshots';

const id = () => Math.random().toString(36).slice(2, 10);

export interface VersionMeta {
  id: string;
  name: string;
}

interface ResumeStore {
  // Active document
  data: ResumeData;
  activeId: string;

  // Track the last save time for the "saved Xs ago" toolbar pill.
  lastSavedAt: number;

  // All saved versions (excluding the active one, which lives in `data`)
  versions: VersionMeta[];
  versionsData: Record<string, ResumeData>;

  // Document actions
  reset: () => void;
  loadSample: () => void;
  clear: () => void;
  loadResume: (next: ResumeData) => void;
  restoreSnapshot: (data: ResumeData) => void;

  // Versioning
  switchVersion: (vid: string) => void;
  newVersion: (name: string, fromCurrent?: boolean) => void;
  renameVersion: (vid: string, name: string) => void;
  deleteVersion: (vid: string) => void;

  setTemplate: (t: TemplateId) => void;
  applyThemePreset: (themeId: string) => void;
  updateCustomization: (patch: Partial<Customization>) => void;
  setPhoto: (dataUrl: string | undefined) => void;

  addSticker: (sticker: import('./types').Sticker) => void;
  updateSticker: (sid: string, patch: Partial<import('./types').Sticker>) => void;
  removeSticker: (sid: string) => void;
  clearStickers: () => void;

  updateLetter: (patch: Partial<CoverLetter>) => void;
  setLetterTemplate: (t: LetterTemplateId) => void;

  updateProfile: (p: Partial<ResumeData['profile']>) => void;
  reorderSections: (sections: Section[]) => void;
  toggleSection: (sid: string) => void;
  renameSection: (sid: string, title: string) => void;
  addCustomSection: (title?: string) => void;
  removeSection: (sid: string) => void;
  updateCustomSectionBody: (sid: string, body: string) => void;

  addExperience: () => void;
  updateExperience: (eid: string, patch: Partial<ExperienceItem>) => void;
  removeExperience: (eid: string) => void;
  reorderExperience: (items: ExperienceItem[]) => void;
  moveBulletToExperience: (fromEid: string, bulletIndex: number, toEid: string) => void;

  resetSection: (
    sectionType:
      | 'experience'
      | 'education'
      | 'skills'
      | 'projects'
      | 'certifications'
      | 'languages'
      | 'awards',
  ) => void;

  addEducation: () => void;
  updateEducation: (eid: string, patch: Partial<EducationItem>) => void;
  removeEducation: (eid: string) => void;
  reorderEducation: (items: EducationItem[]) => void;

  addSkillGroup: () => void;
  updateSkillGroup: (sid: string, patch: Partial<SkillGroup>) => void;
  removeSkillGroup: (sid: string) => void;
  reorderSkillGroups: (items: SkillGroup[]) => void;
  addSkillToGroup: (sid: string, skill: string) => void;

  addProject: () => void;
  updateProject: (pid: string, patch: Partial<ProjectItem>) => void;
  removeProject: (pid: string) => void;
  reorderProjects: (items: ProjectItem[]) => void;

  addCertification: () => void;
  updateCertification: (cid: string, patch: Partial<CertificationItem>) => void;
  removeCertification: (cid: string) => void;

  addLanguage: () => void;
  updateLanguage: (lid: string, patch: Partial<LanguageItem>) => void;
  removeLanguage: (lid: string) => void;

  addAward: () => void;
  updateAward: (aid: string, patch: Partial<AwardItem>) => void;
  removeAward: (aid: string) => void;
}

const empty = (): ResumeData => ({
  profile: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  sections: [
    { id: 's-summary', type: 'summary', title: 'Summary', visible: true },
    { id: 's-exp', type: 'experience', title: 'Experience', visible: true },
    { id: 's-proj', type: 'projects', title: 'Projects', visible: true },
    { id: 's-edu', type: 'education', title: 'Education', visible: true },
    { id: 's-skills', type: 'skills', title: 'Skills', visible: true },
    { id: 's-lang', type: 'languages', title: 'Languages', visible: false },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: false },
    { id: 's-awards', type: 'awards', title: 'Awards', visible: false },
  ],
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  customSections: {},
  template: 'onyx',
  customization: DEFAULT_CUSTOMIZATION,
  letter: EMPTY_LETTER,
});

const DEFAULT_VERSION_ID = 'default';

export const useResume = create<ResumeStore>()(
  persist(
    temporal(
      (set, get) => ({
        data: DEFAULT_RESUME,
        activeId: DEFAULT_VERSION_ID,
        lastSavedAt: Date.now(),
        versions: [{ id: DEFAULT_VERSION_ID, name: 'My Resume' }],
        versionsData: {},

        reset: () => {
          pushSnapshot('before reset to sample', get().data);
          set({ data: DEFAULT_RESUME });
        },
        loadSample: () => {
          pushSnapshot('before sample load', get().data);
          set({ data: DEFAULT_RESUME });
        },
        clear: () => {
          pushSnapshot('before clear', get().data);
          set({ data: empty() });
        },
        loadResume: (next) => {
          pushSnapshot('before resume import', get().data);
          set({ data: next });
        },
        restoreSnapshot: (next) => {
          pushSnapshot('before restoring snapshot', get().data);
          set({ data: next });
        },

        switchVersion: (vid) =>
          set((s) => {
            if (vid === s.activeId) return s;
            // Save current data into the previous version's slot, then load the requested one
            const savedVersionsData = { ...s.versionsData, [s.activeId]: s.data };
            const nextData = savedVersionsData[vid] ?? empty();
            const remaining = { ...savedVersionsData };
            delete remaining[vid];
            return { activeId: vid, data: nextData, versionsData: remaining };
          }),

        newVersion: (name, fromCurrent = true) =>
          set((s) => {
            const newId = `v-${id()}`;
            // Save current data, switch to new, prefilling from current or empty
            const savedVersionsData = { ...s.versionsData, [s.activeId]: s.data };
            return {
              versions: [...s.versions, { id: newId, name }],
              activeId: newId,
              data: fromCurrent ? structuredClone(s.data) : empty(),
              versionsData: savedVersionsData,
            };
          }),

        renameVersion: (vid, name) =>
          set((s) => ({
            versions: s.versions.map((v) => (v.id === vid ? { ...v, name } : v)),
          })),

        deleteVersion: (vid) =>
          set((s) => {
            if (s.versions.length <= 1) return s;
            const remainingVersions = s.versions.filter((v) => v.id !== vid);
            const remainingData = { ...s.versionsData };
            delete remainingData[vid];
            // If deleting active, switch to the first remaining version
            if (vid === s.activeId) {
              const next = remainingVersions[0];
              const nextData = remainingData[next.id] ?? empty();
              const cleaned = { ...remainingData };
              delete cleaned[next.id];
              return {
                versions: remainingVersions,
                versionsData: cleaned,
                activeId: next.id,
                data: nextData,
              };
            }
            return { versions: remainingVersions, versionsData: remainingData };
          }),

        setTemplate: (t) =>
          set((s) => {
            const meta = getTemplateMeta(t);
            return {
              data: {
                ...s.data,
                template: t,
                customization: {
                  ...s.data.customization,
                  fontHead: meta.recommendedFontHead ?? s.data.customization.fontHead,
                  fontBody: meta.recommendedFontBody ?? s.data.customization.fontBody,
                },
              },
            };
          }),

        applyThemePreset: (themeId) =>
          set((s) => {
            const t = COLOR_THEMES.find((x) => x.id === themeId);
            if (!t) return s;
            return {
              data: {
                ...s.data,
                customization: {
                  ...s.data.customization,
                  accent: t.accent,
                  heading: t.heading,
                  text: t.text,
                  muted: t.muted,
                  background: t.background,
                  sidebar: t.sidebar,
                  sidebarText: t.sidebarText,
                },
              },
            };
          }),

        updateCustomization: (patch) =>
          set((s) => ({
            data: { ...s.data, customization: { ...s.data.customization, ...patch } },
          })),

        setPhoto: (dataUrl) =>
          set((s) => ({
            data: {
              ...s.data,
              customization: {
                ...s.data.customization,
                photo: dataUrl,
                showPhoto: dataUrl ? true : s.data.customization.showPhoto,
              },
            },
          })),

        addSticker: (sticker) =>
          set((s) => ({
            data: {
              ...s.data,
              customization: {
                ...s.data.customization,
                stickers: [...s.data.customization.stickers, sticker],
              },
            },
          })),
        updateSticker: (sid, patch) =>
          set((s) => ({
            data: {
              ...s.data,
              customization: {
                ...s.data.customization,
                stickers: s.data.customization.stickers.map((x) =>
                  x.id === sid ? { ...x, ...patch } : x,
                ),
              },
            },
          })),
        removeSticker: (sid) =>
          set((s) => ({
            data: {
              ...s.data,
              customization: {
                ...s.data.customization,
                stickers: s.data.customization.stickers.filter((x) => x.id !== sid),
              },
            },
          })),
        clearStickers: () =>
          set((s) => ({
            data: {
              ...s.data,
              customization: { ...s.data.customization, stickers: [] },
            },
          })),

        updateLetter: (patch) =>
          set((s) => ({
            data: { ...s.data, letter: { ...s.data.letter, ...patch } },
          })),
        setLetterTemplate: (t) =>
          set((s) => ({
            data: { ...s.data, letter: { ...s.data.letter, template: t } },
          })),

        updateProfile: (p) =>
          set((s) => ({ data: { ...s.data, profile: { ...s.data.profile, ...p } } })),

        reorderSections: (sections) => set((s) => ({ data: { ...s.data, sections } })),
        toggleSection: (sid) =>
          set((s) => ({
            data: {
              ...s.data,
              sections: s.data.sections.map((x) => (x.id === sid ? { ...x, visible: !x.visible } : x)),
            },
          })),
        renameSection: (sid, title) =>
          set((s) => ({
            data: {
              ...s.data,
              sections: s.data.sections.map((x) => (x.id === sid ? { ...x, title } : x)),
            },
          })),

        addCustomSection: (title = 'Custom') =>
          set((s) => {
            const newId = `s-custom-${id()}`;
            return {
              data: {
                ...s.data,
                sections: [...s.data.sections, { id: newId, type: 'custom', title, visible: true }],
                customSections: { ...s.data.customSections, [newId]: { id: newId, body: '' } },
              },
            };
          }),

        removeSection: (sid) =>
          set((s) => {
            const next = { ...s.data.customSections };
            delete next[sid];
            return {
              data: {
                ...s.data,
                sections: s.data.sections.filter((x) => x.id !== sid),
                customSections: next,
              },
            };
          }),

        updateCustomSectionBody: (sid, body) =>
          set((s) => ({
            data: {
              ...s.data,
              customSections: { ...s.data.customSections, [sid]: { id: sid, body } },
            },
          })),

        addExperience: () =>
          set((s) => ({
            data: {
              ...s.data,
              experience: [
                ...s.data.experience,
                { id: id(), company: '', role: '', location: '', start: '', end: '', current: false, bullets: [''] },
              ],
            },
          })),
        updateExperience: (eid, patch) =>
          set((s) => ({
            data: { ...s.data, experience: s.data.experience.map((x) => (x.id === eid ? { ...x, ...patch } : x)) },
          })),
        removeExperience: (eid) =>
          set((s) => ({ data: { ...s.data, experience: s.data.experience.filter((x) => x.id !== eid) } })),
        reorderExperience: (items) => set((s) => ({ data: { ...s.data, experience: items } })),

        moveBulletToExperience: (fromEid, bulletIndex, toEid) =>
          set((s) => {
            const from = s.data.experience.find((x) => x.id === fromEid);
            const to = s.data.experience.find((x) => x.id === toEid);
            if (!from || !to || from === to) return s;
            const bullet = from.bullets[bulletIndex];
            if (bullet === undefined) return s;
            const nextFromBullets = from.bullets.filter((_, i) => i !== bulletIndex);
            return {
              data: {
                ...s.data,
                experience: s.data.experience.map((x) => {
                  if (x.id === fromEid) {
                    return { ...x, bullets: nextFromBullets.length ? nextFromBullets : [''] };
                  }
                  if (x.id === toEid) {
                    return { ...x, bullets: [...x.bullets, bullet] };
                  }
                  return x;
                }),
              },
            };
          }),

        resetSection: (sectionType) => {
          pushSnapshot(`before reset of ${sectionType}`, get().data);
          set((s) => {
            const next = { ...s.data };
            switch (sectionType) {
              case 'experience': next.experience = []; break;
              case 'education': next.education = []; break;
              case 'skills': next.skills = []; break;
              case 'projects': next.projects = []; break;
              case 'certifications': next.certifications = []; break;
              case 'languages': next.languages = []; break;
              case 'awards': next.awards = []; break;
            }
            return { data: next };
          });
        },

        addEducation: () =>
          set((s) => ({
            data: {
              ...s.data,
              education: [
                ...s.data.education,
                { id: id(), school: '', degree: '', field: '', start: '', end: '', notes: '' },
              ],
            },
          })),
        updateEducation: (eid, patch) =>
          set((s) => ({
            data: { ...s.data, education: s.data.education.map((x) => (x.id === eid ? { ...x, ...patch } : x)) },
          })),
        removeEducation: (eid) =>
          set((s) => ({ data: { ...s.data, education: s.data.education.filter((x) => x.id !== eid) } })),
        reorderEducation: (items) => set((s) => ({ data: { ...s.data, education: items } })),

        addSkillGroup: () =>
          set((s) => ({
            data: { ...s.data, skills: [...s.data.skills, { id: id(), category: 'New group', items: [] }] },
          })),
        updateSkillGroup: (sid, patch) =>
          set((s) => ({
            data: { ...s.data, skills: s.data.skills.map((x) => (x.id === sid ? { ...x, ...patch } : x)) },
          })),
        removeSkillGroup: (sid) =>
          set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((x) => x.id !== sid) } })),
        reorderSkillGroups: (items) => set((s) => ({ data: { ...s.data, skills: items } })),
        addSkillToGroup: (sid, skill) =>
          set((s) => ({
            data: {
              ...s.data,
              skills: s.data.skills.map((g) =>
                g.id === sid
                  ? {
                      ...g,
                      items: g.items.some((it) => it.name.toLowerCase() === skill.toLowerCase())
                        ? g.items
                        : [...g.items, { name: skill }],
                    }
                  : g,
              ),
            },
          })),

        addProject: () =>
          set((s) => ({
            data: {
              ...s.data,
              projects: [...s.data.projects, { id: id(), name: '', link: '', description: '', tech: [] }],
            },
          })),
        updateProject: (pid, patch) =>
          set((s) => ({
            data: { ...s.data, projects: s.data.projects.map((x) => (x.id === pid ? { ...x, ...patch } : x)) },
          })),
        removeProject: (pid) =>
          set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((x) => x.id !== pid) } })),
        reorderProjects: (items) => set((s) => ({ data: { ...s.data, projects: items } })),

        addCertification: () =>
          set((s) => ({
            data: { ...s.data, certifications: [...s.data.certifications, { id: id(), name: '', issuer: '', date: '' }] },
          })),
        updateCertification: (cid, patch) =>
          set((s) => ({
            data: { ...s.data, certifications: s.data.certifications.map((x) => (x.id === cid ? { ...x, ...patch } : x)) },
          })),
        removeCertification: (cid) =>
          set((s) => ({ data: { ...s.data, certifications: s.data.certifications.filter((x) => x.id !== cid) } })),

        addLanguage: () =>
          set((s) => ({ data: { ...s.data, languages: [...s.data.languages, { id: id(), name: '', level: '' }] } })),
        updateLanguage: (lid, patch) =>
          set((s) => ({
            data: { ...s.data, languages: s.data.languages.map((x) => (x.id === lid ? { ...x, ...patch } : x)) },
          })),
        removeLanguage: (lid) =>
          set((s) => ({ data: { ...s.data, languages: s.data.languages.filter((x) => x.id !== lid) } })),

        addAward: () =>
          set((s) => ({
            data: { ...s.data, awards: [...s.data.awards, { id: id(), name: '', issuer: '', date: '', description: '' }] },
          })),
        updateAward: (aid, patch) =>
          set((s) => ({
            data: { ...s.data, awards: s.data.awards.map((x) => (x.id === aid ? { ...x, ...patch } : x)) },
          })),
        removeAward: (aid) =>
          set((s) => ({ data: { ...s.data, awards: s.data.awards.filter((x) => x.id !== aid) } })),
      }),
      {
        // Only `data` is undoable — version metadata + non-data fields are not.
        partialize: (state) => ({ data: state.data }),
        limit: 60,
        equality: (a, b) => JSON.stringify(a.data) === JSON.stringify(b.data),
      },
    ),
    {
      name: 'easycv-resume',
      version: 6,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        activeId: state.activeId,
        versions: state.versions,
        versionsData: state.versionsData,
        lastSavedAt: state.lastSavedAt,
      }),
      migrate: (state, version) => {
        if (!state) return state;
        const s = state as Partial<ResumeStore>;
        if (s.data && !s.data.customization) {
          s.data.customization = DEFAULT_CUSTOMIZATION;
        }
        if (s.data && !s.data.customSections) {
          s.data.customSections = {};
        }
        if (version < 3) {
          s.activeId = DEFAULT_VERSION_ID;
          s.versions = [{ id: DEFAULT_VERSION_ID, name: 'My Resume' }];
          s.versionsData = {};
        }
        if (version < 4 && s.data?.customization) {
          const cust = s.data.customization as Customization & {
            paperTexture?: unknown;
            stickers?: unknown;
          };
          if (cust.paperTexture === undefined) cust.paperTexture = 'plain';
          if (cust.stickers === undefined) cust.stickers = [];
        }
        if (version < 5 && s.data && !s.data.letter) {
          s.data.letter = EMPTY_LETTER;
        }
        if (version < 6 && s.data?.skills) {
          // Migrate skill items from string[] to SkillItem[].
          s.data.skills = s.data.skills.map((g) => ({
            ...g,
            items: (g.items as unknown as Array<string | { name: string; level?: number }>).map(
              (it) =>
                typeof it === 'string'
                  ? { name: it }
                  : { name: it.name, level: it.level as 1 | 2 | 3 | 4 | 5 | undefined },
            ),
          }));
        }
        return s;
      },
    },
  ),
);

// Hook to access the temporal (undo/redo) state.
export const useTemporal = () => useResume.temporal;

// Whenever the resume data actually changes, stamp the time.
// Persist middleware will commit it to localStorage on the same tick.
useResume.subscribe((curr, prev) => {
  if (curr.data !== prev.data) {
    useResume.setState({ lastSavedAt: Date.now() });
  }
});
