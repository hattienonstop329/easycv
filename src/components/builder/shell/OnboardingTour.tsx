'use client';

import { useEffect, useState } from 'react';
import { useUI } from '@/lib/ui-store';
import { TourDemo, type DemoKind } from './TourDemos';

const SEEN_KEY = 'easycv-seen-tour';
const PERSONA_KEY = 'easycv-seen-personas';

interface Step {
  title: string;
  body: string;
  demo: DemoKind;
}

const STEPS: ReadonlyArray<Step> = [
  {
    title: 'switch document mode',
    body: 'use the resume / letter toggle at the top to flip between your resume and the matching cover letter — same colors, same fonts, one application package.',
    demo: 'mode',
  },
  {
    title: 'pick a panel',
    body: 'every editable section lives in a panel along the left strip — profile, experience, skills, design, polish, and more.',
    demo: 'panels',
  },
  {
    title: 'click on the preview',
    body: 'hover any section in the live preview on the right — when the dashed outline appears, click to jump straight to its editor.',
    demo: 'click',
  },
  {
    title: 'export when ready',
    body: 'export pdf is the main button. the chevron next to it opens png, plain text, and json resume formats.',
    demo: 'export',
  },
];

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [autoOpen, setAutoOpen] = useState(false);
  const tourOpen = useUI((s) => s.tourOpen);
  const closeTour = useUI((s) => s.closeTour);
  const open = autoOpen || tourOpen;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seenTour = window.localStorage.getItem(SEEN_KEY);
    const seenPersonas = window.localStorage.getItem(PERSONA_KEY);
    // First-time auto-show: only after the persona picker has been dismissed.
    if (!seenTour && seenPersonas) {
      const t = setTimeout(() => setAutoOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, []);

  // When the user re-opens the tour from the shortcuts overlay, restart at step 0.
  useEffect(() => {
    if (tourOpen) setStep(0);
  }, [tourOpen]);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SEEN_KEY, '1');
    }
    setAutoOpen(false);
    closeTour();
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else dismiss();
  };

  if (!open) return null;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-cocoa-soft/40 backdrop-blur no-print">
      <div className="bg-paper border border-cocoa/15 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-7 relative max-h-[92vh] overflow-y-auto thin-scroll">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 text-cocoa-soft hover:text-olive-ink text-sm leading-none p-1"
          aria-label="skip tour"
        >
          ×
        </button>

        <div className="text-[10px] uppercase tracking-widest text-strawberry-deep mb-2">
          step {step + 1} of {STEPS.length}
        </div>

        <TourDemo kind={current.demo} />

        <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-olive-ink font-light leading-tight">
          {current.title}
        </h2>
        <p className="text-cocoa-soft mt-3 leading-relaxed text-sm">{current.body}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-cocoa-soft hover:text-olive-ink"
          >
            skip
          </button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition ${
                  i === step ? 'bg-olive-ink scale-125' : 'bg-cocoa/20'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="bg-olive-ink text-paper px-5 py-2 rounded-full text-sm font-medium hover:bg-olive transition"
          >
            {step === STEPS.length - 1 ? 'got it ✦' : 'next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
