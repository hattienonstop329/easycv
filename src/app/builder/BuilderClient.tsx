'use client';

import { useSearchParams } from 'next/navigation';
import { Shell } from '@/components/builder/shell';
import { TemplateId } from '@/lib/types';
import { TEMPLATE_REGISTRY } from '@/lib/design-tokens';

const ALLOWED = new Set<TemplateId>(TEMPLATE_REGISTRY.map((t) => t.id));

export function BuilderClient() {
  const params = useSearchParams();
  const t = params.get('template') as TemplateId | null;
  const initialTemplate = t && ALLOWED.has(t) ? t : undefined;
  return <Shell initialTemplate={initialTemplate} />;
}
