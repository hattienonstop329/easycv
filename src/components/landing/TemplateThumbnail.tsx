import { ResumePreview } from '@/components/templates';
import { LetterPreview } from '@/components/templates/letter';
import { DEFAULT_RESUME, LetterTemplateId, TemplateId } from '@/lib/types';

export function TemplateThumbnail({ template }: { template: TemplateId }) {
  return (
    <div className="thumb-shell">
      <div className="thumb-page">
        <ResumePreview data={{ ...DEFAULT_RESUME, template }} />
      </div>
    </div>
  );
}

export function LetterThumbnail({ template }: { template: LetterTemplateId }) {
  return (
    <div className="thumb-shell">
      <div className="thumb-page">
        <LetterPreview
          data={{ ...DEFAULT_RESUME, letter: { ...DEFAULT_RESUME.letter, template } }}
        />
      </div>
    </div>
  );
}
