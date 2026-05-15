import { Suspense } from 'react';
import { BuilderClient } from './BuilderClient';

export const metadata = {
  title: 'easycv · builder',
  description: 'craft your resume on the desk',
};

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-cocoa-soft font-[family-name:var(--font-hand)] text-2xl">
          opening your desk…
        </div>
      }
    >
      <BuilderClient />
    </Suspense>
  );
}
