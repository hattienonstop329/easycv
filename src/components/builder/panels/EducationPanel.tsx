'use client';

import { useRef } from 'react';
import { useResume } from '@/lib/store';
import { AddButton, FieldRow, Input, ItemCard, Textarea } from '../controls/Field';
import { SortableList, SortableItem, DragHandle } from '../controls/Sortable';
import { MonthInput } from '../controls/MonthInput';
import { EmptyState } from '../controls/EmptyState';
import { ResetSectionLink } from '../controls/ResetSectionLink';
import { focusInsideRef, useFocusOnTarget } from '../controls/useFocusOnTarget';

export function EducationPanel() {
  const items = useResume((s) => s.data.education);
  const add = useResume((s) => s.addEducation);
  const remove = useResume((s) => s.removeEducation);
  const update = useResume((s) => s.updateEducation);
  const reorder = useResume((s) => s.reorderEducation);
  const refs = useRef(new Map<string, HTMLDivElement | null>());

  useFocusOnTarget('edu', (id) => {
    const el = refs.current.get(id);
    focusInsideRef({ current: el ?? null });
  });

  if (items.length === 0) {
    return (
      <EmptyState
        title="add your education"
        body="school, degree, dates — and any honors or thesis worth mentioning."
        actionLabel="add education"
        onAction={add}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <ResetSectionLink section="education" label="education entries" />
      </div>
      <SortableList items={items} onReorder={reorder}>
        {(item) => (
          <SortableItem id={item.id}>
            {({ listeners }) => (
              <div
                ref={(el) => {
                  refs.current.set(item.id, el);
                }}
              >
                <ItemCard
                  onRemove={() => remove(item.id)}
                  dragHandle={<DragHandle listeners={listeners} />}
                >
                  <FieldRow label="school">
                    <Input
                      value={item.school}
                      onChange={(e) => update(item.id, { school: e.target.value })}
                      placeholder="Rhode Island School of Design"
                    />
                  </FieldRow>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <FieldRow label="degree">
                      <Input
                        value={item.degree}
                        onChange={(e) => update(item.id, { degree: e.target.value })}
                        placeholder="BFA"
                      />
                    </FieldRow>
                    <FieldRow label="field">
                      <Input
                        value={item.field}
                        onChange={(e) => update(item.id, { field: e.target.value })}
                        placeholder="Graphic Design"
                      />
                    </FieldRow>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <FieldRow label="start">
                      <MonthInput
                        value={item.start}
                        onChange={(v) => update(item.id, { start: v })}
                        placeholder="Sep 2014"
                      />
                    </FieldRow>
                    <FieldRow label="end">
                      <MonthInput
                        value={item.end}
                        onChange={(v) => update(item.id, { end: v })}
                        placeholder="May 2018"
                      />
                    </FieldRow>
                  </div>
                  <FieldRow label="notes">
                    <Textarea
                      value={item.notes}
                      onChange={(e) => update(item.id, { notes: e.target.value })}
                      placeholder="Honors, thesis, anything you'd write on a postcard."
                    />
                  </FieldRow>
                </ItemCard>
              </div>
            )}
          </SortableItem>
        )}
      </SortableList>
      <AddButton onClick={add} label="add education" />
    </div>
  );
}
