import { ResumeData } from '@/lib/types';
import { TEMPLATE_REGISTRY } from '@/lib/design-tokens';

import { NotebookTemplate } from './handwriting/Notebook';
import { MatchaTemplate } from './handwriting/Matcha';
import { EditorialTemplate } from './handwriting/Editorial';
import { PolaroidTemplate } from './handwriting/Polaroid';
import { MinimalinkTemplate } from './handwriting/Minimalink';

import { Onyx } from './professional/Onyx';
import { Cascade } from './professional/Cascade';
import { Bronzor } from './professional/Bronzor';
import { Enfold } from './professional/Enfold';
import { Cubic } from './professional/Cubic';
import { Mono } from './professional/Mono';
import { Marquee } from './professional/Marquee';

export { TEMPLATE_REGISTRY as TEMPLATES };

export function ResumePreview({ data }: { data: ResumeData }) {
  switch (data.template) {
    case 'notebook':
      return <NotebookTemplate data={data} />;
    case 'matcha':
      return <MatchaTemplate data={data} />;
    case 'editorial':
      return <EditorialTemplate data={data} />;
    case 'polaroid':
      return <PolaroidTemplate data={data} />;
    case 'minimalink':
      return <MinimalinkTemplate data={data} />;
    case 'onyx':
      return <Onyx data={data} />;
    case 'cascade':
      return <Cascade data={data} />;
    case 'bronzor':
      return <Bronzor data={data} />;
    case 'enfold':
      return <Enfold data={data} />;
    case 'cubic':
      return <Cubic data={data} />;
    case 'mono':
      return <Mono data={data} />;
    case 'marquee':
      return <Marquee data={data} />;
    default:
      return <Onyx data={data} />;
  }
}
