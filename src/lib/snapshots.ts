import { ResumeData } from './types';

export const MAX_SNAPSHOTS = 8;
export const SNAPSHOT_KEY = 'easycv-snapshots';

export interface Snapshot {
  id: string;
  takenAt: number; // unix ms
  reason: string; // e.g. 'before clear', 'before sample load'
  data: ResumeData;
}

function readAll(): Snapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Snapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: Snapshot[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list));
  } catch {
    // Storage quota or private mode — fail silently.
  }
}

export function listSnapshots(): Snapshot[] {
  return readAll();
}

export function pushSnapshot(reason: string, data: ResumeData): Snapshot {
  const snap: Snapshot = {
    id: `snap-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    takenAt: Date.now(),
    reason,
    data,
  };
  const list = [snap, ...readAll()].slice(0, MAX_SNAPSHOTS);
  writeAll(list);
  return snap;
}

export function removeSnapshot(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function clearSnapshots(): void {
  writeAll([]);
}

export function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 5_000) return 'just now';
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}
