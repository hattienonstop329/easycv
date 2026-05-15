import { ResumeData } from '@/lib/types';
import { OnyxLetter } from './OnyxLetter';
import { MarqueeLetter } from './MarqueeLetter';
import { NotebookLetter } from './NotebookLetter';
import { CascadeLetter } from './CascadeLetter';
import { MonoLetter } from './MonoLetter';

export const LETTER_TEMPLATES = [
  { id: 'onyx-letter', name: 'Onyx Letter', tag: 'minimal · clean serif' },
  { id: 'cascade-letter', name: 'Cascade Letter', tag: 'sidebar · two-column' },
  { id: 'marquee-letter', name: 'Marquee Letter', tag: 'big serif · executive' },
  { id: 'mono-letter', name: 'Mono Letter', tag: 'developer · monospace' },
  { id: 'notebook-letter', name: 'Notebook Letter', tag: 'lined paper · handwriting' },
] as const;

export function LetterPreview({ data }: { data: ResumeData }) {
  switch (data.letter.template) {
    case 'marquee-letter':
      return <MarqueeLetter data={data} />;
    case 'notebook-letter':
      return <NotebookLetter data={data} />;
    case 'cascade-letter':
      return <CascadeLetter data={data} />;
    case 'mono-letter':
      return <MonoLetter data={data} />;
    case 'onyx-letter':
    default:
      return <OnyxLetter data={data} />;
  }
}
