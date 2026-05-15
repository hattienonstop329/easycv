'use client';

import { ReactNode } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  children,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T) => ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onReorder(arrayMove(items, oldIdx, newIdx));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id}>{children(item)}</div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function SortableItem({
  id,
  children,
  handleClassName = '',
}: {
  id: string;
  children: (handleProps: { listeners: ReturnType<typeof useSortable>['listeners']; isDragging: boolean }) => ReactNode;
  handleClassName?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  void handleClassName;
  void attributes;
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners, isDragging })}
    </div>
  );
}

export function DragHandle({
  listeners,
  className = '',
}: {
  listeners: ReturnType<typeof useSortable>['listeners'];
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`cursor-grab active:cursor-grabbing text-cocoa-soft hover:text-olive-ink p-1 ${className}`}
      {...listeners}
      title="drag to reorder"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <circle cx="4" cy="3" r="1.4" />
        <circle cx="10" cy="3" r="1.4" />
        <circle cx="4" cy="7" r="1.4" />
        <circle cx="10" cy="7" r="1.4" />
        <circle cx="4" cy="11" r="1.4" />
        <circle cx="10" cy="11" r="1.4" />
      </svg>
    </button>
  );
}
