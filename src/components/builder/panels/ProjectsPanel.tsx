'use client';

import { useRef } from 'react';
import { useResume } from '@/lib/store';
import { AddButton, FieldRow, Input, ItemCard, Textarea } from '../controls/Field';
import { SortableList, SortableItem, DragHandle } from '../controls/Sortable';
import { EmptyState } from '../controls/EmptyState';
import { ResetSectionLink } from '../controls/ResetSectionLink';
import { focusInsideRef, useFocusOnTarget } from '../controls/useFocusOnTarget';
import { PanelHints } from '../controls/PanelHints';
import { ItemAdvanced } from '../controls/ItemAdvanced';
import { SectionFormatDisclosure } from '../controls/SectionFormatDisclosure';

export function ProjectsPanel() {
  const items = useResume((s) => s.data.projects);
  const add = useResume((s) => s.addProject);
  const remove = useResume((s) => s.removeProject);
  const update = useResume((s) => s.updateProject);
  const reorder = useResume((s) => s.reorderProjects);
  const refs = useRef(new Map<string, HTMLDivElement | null>());

  useFocusOnTarget('proj', (id) => {
    focusInsideRef({ current: refs.current.get(id) ?? null });
  });

  if (items.length === 0) {
    return (
      <EmptyState
        title="add a project"
        body="side projects, open source, papers, or anything you want to show off — each one gets a name, a one-liner, and tags."
        actionLabel="add a project"
        onAction={add}
      />
    );
  }

  return (
    <div>
      <PanelHints panel="projects" />
      <div className="flex justify-end mb-2">
        <ResetSectionLink section="projects" label="projects" />
      </div>
      <SortableList items={items} onReorder={reorder}>
        {(item) => (
          <SortableItem id={item.id}>
            {({ listeners }) => (
              <div ref={(el) => { refs.current.set(item.id, el); }}>
              <ItemCard
                onRemove={() => remove(item.id)}
                dragHandle={<DragHandle listeners={listeners} />}
              >
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="name">
                    <Input
                      value={item.name}
                      onChange={(e) => update(item.id, { name: e.target.value })}
                      placeholder="Slowbrew Journal"
                    />
                  </FieldRow>
                  <FieldRow label="link">
                    <Input
                      value={item.link}
                      onChange={(e) => update(item.id, { link: e.target.value })}
                      placeholder="slowbrew.cafe"
                    />
                  </FieldRow>
                </div>
                <FieldRow label="description">
                  <Textarea
                    value={item.description}
                    onChange={(e) => update(item.id, { description: e.target.value })}
                    placeholder="A short, confident sentence on what it is and why it mattered."
                  />
                </FieldRow>
                <FieldRow label="tech / tags (comma-separated)">
                  <Input
                    value={item.tech.join(', ')}
                    onChange={(e) =>
                      update(item.id, {
                        tech: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Substack, Procreate"
                  />
                </FieldRow>
                <ItemAdvanced
                  value={item.overrides}
                  onChange={(o) => update(item.id, { overrides: o })}
                />
              </ItemCard>
              </div>
            )}
          </SortableItem>
        )}
      </SortableList>
      <AddButton onClick={add} label="add a project" />
      <SectionFormatDisclosure sectionType="projects" />
    </div>
  );
}
