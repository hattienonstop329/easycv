'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'easycv-install-dismissed';

/**
 * Registers the service worker and surfaces a tiny "install" pill in the
 * bottom-right when the browser fires beforeinstallprompt. Hides itself if
 * the app is already installed (display-mode: standalone) or if the user
 * dismissed the prompt previously.
 */
export function PWARegister() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDev = process.env.NODE_ENV !== 'production';

    if ('serviceWorker' in navigator) {
      if (isDev) {
        // Dev builds change chunk hashes on every recompile. A stale SW
        // serves the old HTML, which then 404s on chunks that no longer
        // exist and the page hangs on the Suspense fallback. Strip any
        // SW that an earlier session installed.
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (const r of regs) r.unregister().catch(() => {});
        }).catch(() => {});
      } else if (
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost'
      ) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }
    }

    // Hide if already installed
    if (window.matchMedia?.('(display-mode: standalone)').matches) {
      setHidden(true);
      return;
    }
    if (window.localStorage.getItem(DISMISSED_KEY)) {
      setHidden(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setHidden(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (hidden || !installEvent) return null;

  const accept = async () => {
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'dismissed') {
        window.localStorage.setItem(DISMISSED_KEY, '1');
      }
    } catch {
      /* user closed it */
    } finally {
      setInstallEvent(null);
    }
  };

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, '1');
    setHidden(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 no-print">
      <div className="bg-paper border border-cocoa/20 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-xs">
        <div className="text-2xl shrink-0">⌂</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-olive-ink leading-tight">
            install easycv
          </div>
          <div className="text-[11px] text-cocoa-soft mt-0.5">
            keep it on your home screen — works offline.
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={accept}
            className="bg-olive-ink text-paper text-xs px-3 py-1.5 rounded-full font-medium hover:bg-olive transition"
          >
            install
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="text-[10px] text-cocoa-soft hover:text-strawberry-deep"
          >
            dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
