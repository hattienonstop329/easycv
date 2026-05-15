'use client';

import { useEffect, useState } from 'react';
import { useResume } from '@/lib/store';
import { useUI } from '@/lib/ui-store';
import { TemplateId } from '@/lib/types';
import {
  AwardsEditor,
  CertificationsEditor,
  DesignPanel,
  DiffPanel,
  TypographyPanel,
  EducationPanel,
  ExperiencePanel,
  LanguagesEditor,
  LetterPanel,
  MatchJDPanel,
  PolishPanel,
  ProfilePanel,
  ProjectsPanel,
  SectionsPanel,
  SkillsPanel,
  StickersPanel,
  TemplatesPanel,
} from '../panels';
import { PreviewPane, PreviewPrint } from '../preview';
import { Toolbar } from './Toolbar';
import {
  PanelSwitcher,
  PanelId,
  DocumentMode,
  DEFAULT_PANEL_FOR,
  panelsFor,
} from './PanelSwitcher';
import { MobileTabs, MobileView } from './MobileTabs';
import { PreviewClickRouter } from './PreviewClickRouter';
import { PersonaPicker } from './PersonaPicker';
import { ShortcutsOverlay } from './ShortcutsOverlay';
import { OnboardingTour } from './OnboardingTour';
import { ToastStack } from './ToastStack';
import { MilestoneWatcher } from './MilestoneWatcher';
import { CommandPalette } from './CommandPalette';
import { AIKeyDialog } from './AIKeyDialog';
import { PWARegister } from './PWARegister';
import { useAIDialogOpen, useCloseAIDialog } from '@/lib/ui-store';

const MODE_KEY = 'easycv-doc-mode';

export function Shell({ initialTemplate }: { initialTemplate?: TemplateId }) {
  const data = useResume((s) => s.data);
  const setTemplate = useResume((s) => s.setTemplate);
  const [mode, setModeState] = useState<DocumentMode>('resume');
  const [panel, setPanel] = useState<PanelId>('profile');
  const [view, setView] = useState<MobileView>('edit');
  const [hydrated, setHydrated] = useState(false);

  // Restore saved mode + default panel for that mode on first mount.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(MODE_KEY) as DocumentMode | null;
      if (saved === 'letter' || saved === 'resume') {
        setModeState(saved);
        setPanel(DEFAULT_PANEL_FOR[saved]);
      }
    }
    setHydrated(true);
    if (initialTemplate && initialTemplate !== data.template) {
      setTemplate(initialTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplate]);

  const setMode = (next: DocumentMode) => {
    setModeState(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(MODE_KEY, next);
    // If the active panel doesn't exist in the new mode, jump to that mode's default.
    const allowed = new Set(panelsFor(next).map((p) => p.id));
    if (!allowed.has(panel)) setPanel(DEFAULT_PANEL_FOR[next]);
  };

  // Honor cross-panel navigation requests posted to the UI store.
  const navRequest = useUI((s) => s.navRequest);
  const clearNavRequest = useUI((s) => s.clearNavRequest);
  useEffect(() => {
    if (!navRequest) return;
    const target = navRequest.mode ?? mode;
    if (target !== mode) setMode(target);
    if (navRequest.panel) {
      const allowed = new Set(panelsFor(target).map((p) => p.id));
      if (allowed.has(navRequest.panel as PanelId)) {
        setPanel(navRequest.panel as PanelId);
      }
    }
    clearNavRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navRequest]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cocoa-soft font-[family-name:var(--font-hand)] text-2xl">
        opening your desk…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col paper-bg">
      <Toolbar mode={mode} setMode={setMode} setPanel={setPanel} />

      <div className="flex-1 lg:grid lg:grid-cols-[minmax(420px,_42%)_1fr] no-print">
        <div
          className={`border-r border-cocoa/15 bg-cream/40 flex flex-col h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] ${
            view === 'edit' ? '' : 'hidden lg:flex'
          }`}
        >
          <PanelSwitcher panel={panel} setPanel={setPanel} mode={mode} />
          <div className="flex-1 overflow-y-auto thin-scroll p-4 md:p-6 pb-24 lg:pb-6">
            {panel === 'templates' && <TemplatesPanel mode={mode} />}
            {panel === 'design' && <DesignPanel />}
            {panel === 'typography' && <TypographyPanel />}
            {panel === 'sections' && <SectionsPanel />}
            {panel === 'profile' && <ProfilePanel />}
            {panel === 'experience' && <ExperiencePanel />}
            {panel === 'education' && <EducationPanel />}
            {panel === 'skills' && <SkillsPanel />}
            {panel === 'projects' && <ProjectsPanel />}
            {panel === 'letter' && <LetterPanel />}
            {panel === 'matchjd' && <MatchJDPanel />}
            {panel === 'polish' && <PolishPanel />}
            {panel === 'diff' && <DiffPanel />}
            {panel === 'stickers' && <StickersPanel />}
            {panel === 'languages' && <LanguagesEditor />}
            {panel === 'awards' && <AwardsEditor />}
            {panel === 'certifications' && <CertificationsEditor />}
          </div>
        </div>

        <div
          className={`h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] ${
            view === 'preview' ? '' : 'hidden lg:block'
          }`}
        >
          <PreviewClickRouter onJump={setPanel} disabled={mode === 'letter'}>
            <PreviewPane mode={mode} />
          </PreviewClickRouter>
        </div>
      </div>

      <MobileTabs view={view} setView={setView} />

      <div className="hidden print:block">
        <PreviewPrint mode={mode} />
      </div>

      <PersonaPicker />
      <OnboardingTour />
      <ShortcutsOverlay />
      <ToastStack />
      <MilestoneWatcher />
      <CommandPalette mode={mode} setMode={setMode} setPanel={setPanel} />
      <AIDialogMount />
      <PWARegister />
    </div>
  );
}

function AIDialogMount() {
  const open = useAIDialogOpen();
  const close = useCloseAIDialog();
  return <AIKeyDialog open={open} onClose={close} />;
}
