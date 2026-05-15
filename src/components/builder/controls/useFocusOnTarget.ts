'use client';

import { RefObject, useEffect } from 'react';
import { useUI } from '@/lib/ui-store';

/**
 * Subscribes to the global UI focusTarget and runs `onMatch` when the target
 * matches the given prefix (e.g. "edu:ed1"). Clears the target after firing
 * so it doesn't re-trigger.
 *
 * Common pattern: scroll the matching element into view + focus its first input.
 */
export function useFocusOnTarget(
  prefix: string,
  onMatch: (rest: string) => void,
): void {
  const focusTarget = useUI((s) => s.focusTarget);
  const clear = useUI((s) => s.clearFocusTarget);

  useEffect(() => {
    if (!focusTarget) return;
    if (!focusTarget.startsWith(`${prefix}:`)) return;
    const rest = focusTarget.slice(prefix.length + 1);
    onMatch(rest);
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTarget]);
}

/** Helper: scroll an element to view, then focus the first focusable input. */
export function focusInsideRef(ref: RefObject<HTMLElement | null>): void {
  if (!ref.current) return;
  ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const input = ref.current.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    'input, textarea',
  );
  if (input) {
    // Wait one tick for smooth-scroll to start, then focus.
    setTimeout(() => input.focus(), 50);
  }
}
