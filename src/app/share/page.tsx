import { Suspense } from 'react';
import { ShareClient } from './ShareClient';

export const metadata = {
  title: 'easycv · shared resume',
  description: 'a resume shared with you via easycv',
};

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-cocoa-soft font-[family-name:var(--font-hand)] text-2xl">
          unfolding…
        </div>
      }
    >
      <ShareClient />
    </Suspense>
  );
}
