import { ResumeData, ExperienceItem, EducationItem, ProjectItem, SkillGroup } from './types';

export type ChangeKind = 'added' | 'removed' | 'changed';

export interface FieldChange {
  field: string;
  before: string;
  after: string;
}

export interface ItemDiff {
  id: string;
  kind: ChangeKind;
  // Display title (e.g. "Senior Designer · Marigold")
  title: string;
  // Sub-label (dates, school, etc.)
  subtitle?: string;
  // For 'changed': field-level diffs
  fieldChanges?: FieldChange[];
  // For experience: bullet-level diffs
  bullets?: { kind: ChangeKind; before?: string; after?: string }[];
}

export interface ResumeDiff {
  profile: FieldChange[];
  template?: FieldChange;
  experience: ItemDiff[];
  education: ItemDiff[];
  projects: ItemDiff[];
  skills: ItemDiff[];
  // Counts to show in the summary line
  summary: {
    added: number;
    removed: number;
    changed: number;
  };
}

function diffField(a: string | undefined, b: string | undefined, name: string): FieldChange | null {
  const av = (a ?? '').trim();
  const bv = (b ?? '').trim();
  if (av === bv) return null;
  return { field: name, before: av, after: bv };
}

function diffStringList(a: string[], b: string[]): { kind: ChangeKind; before?: string; after?: string }[] {
  // Bullets are positional. Pair by index — when they differ, it's a "changed" entry.
  // Trailing extras → added/removed.
  const out: { kind: ChangeKind; before?: string; after?: string }[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    const av = (a[i] ?? '').trim();
    const bv = (b[i] ?? '').trim();
    if (av === bv) continue;
    if (!av) out.push({ kind: 'added', after: bv });
    else if (!bv) out.push({ kind: 'removed', before: av });
    else out.push({ kind: 'changed', before: av, after: bv });
  }
  return out;
}

function expTitle(e: ExperienceItem): string {
  return [e.role, e.company].filter(Boolean).join(' · ') || 'Untitled job';
}
function expSubtitle(e: ExperienceItem): string {
  return [e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ');
}

function eduTitle(e: EducationItem): string {
  return [e.degree, e.school].filter(Boolean).join(' · ') || 'Untitled education';
}
function eduSubtitle(e: EducationItem): string {
  return [e.start, e.end].filter(Boolean).join(' – ');
}

function diffExperience(a: ExperienceItem[], b: ExperienceItem[]): ItemDiff[] {
  const out: ItemDiff[] = [];
  const aMap = new Map(a.map((x) => [x.id, x]));
  const bMap = new Map(b.map((x) => [x.id, x]));
  for (const av of a) {
    const bv = bMap.get(av.id);
    if (!bv) {
      out.push({ id: av.id, kind: 'removed', title: expTitle(av), subtitle: expSubtitle(av) });
      continue;
    }
    const fields = [
      diffField(av.role, bv.role, 'role'),
      diffField(av.company, bv.company, 'company'),
      diffField(av.location, bv.location, 'location'),
      diffField(av.start, bv.start, 'start'),
      diffField(av.end, bv.end, 'end'),
    ].filter((x): x is FieldChange => x !== null);
    const bullets = diffStringList(av.bullets, bv.bullets);
    if (fields.length === 0 && bullets.length === 0) continue;
    out.push({
      id: av.id,
      kind: 'changed',
      title: expTitle(bv),
      subtitle: expSubtitle(bv),
      fieldChanges: fields,
      bullets,
    });
  }
  for (const bv of b) {
    if (!aMap.has(bv.id)) {
      out.push({ id: bv.id, kind: 'added', title: expTitle(bv), subtitle: expSubtitle(bv) });
    }
  }
  return out;
}

function diffEducation(a: EducationItem[], b: EducationItem[]): ItemDiff[] {
  const out: ItemDiff[] = [];
  const aMap = new Map(a.map((x) => [x.id, x]));
  const bMap = new Map(b.map((x) => [x.id, x]));
  for (const av of a) {
    const bv = bMap.get(av.id);
    if (!bv) {
      out.push({ id: av.id, kind: 'removed', title: eduTitle(av), subtitle: eduSubtitle(av) });
      continue;
    }
    const fields = [
      diffField(av.school, bv.school, 'school'),
      diffField(av.degree, bv.degree, 'degree'),
      diffField(av.field, bv.field, 'field'),
      diffField(av.start, bv.start, 'start'),
      diffField(av.end, bv.end, 'end'),
      diffField(av.notes, bv.notes, 'notes'),
    ].filter((x): x is FieldChange => x !== null);
    if (fields.length === 0) continue;
    out.push({
      id: av.id,
      kind: 'changed',
      title: eduTitle(bv),
      subtitle: eduSubtitle(bv),
      fieldChanges: fields,
    });
  }
  for (const bv of b) {
    if (!aMap.has(bv.id)) {
      out.push({ id: bv.id, kind: 'added', title: eduTitle(bv), subtitle: eduSubtitle(bv) });
    }
  }
  return out;
}

function diffProjects(a: ProjectItem[], b: ProjectItem[]): ItemDiff[] {
  const out: ItemDiff[] = [];
  const aMap = new Map(a.map((x) => [x.id, x]));
  const bMap = new Map(b.map((x) => [x.id, x]));
  for (const av of a) {
    const bv = bMap.get(av.id);
    if (!bv) {
      out.push({ id: av.id, kind: 'removed', title: av.name || 'Untitled project' });
      continue;
    }
    const fields = [
      diffField(av.name, bv.name, 'name'),
      diffField(av.link, bv.link, 'link'),
      diffField(av.description, bv.description, 'description'),
      diffField(av.tech.join(', '), bv.tech.join(', '), 'tech'),
    ].filter((x): x is FieldChange => x !== null);
    if (fields.length === 0) continue;
    out.push({
      id: av.id,
      kind: 'changed',
      title: bv.name || 'Untitled project',
      fieldChanges: fields,
    });
  }
  for (const bv of b) {
    if (!aMap.has(bv.id)) {
      out.push({ id: bv.id, kind: 'added', title: bv.name || 'Untitled project' });
    }
  }
  return out;
}

function diffSkills(a: SkillGroup[], b: SkillGroup[]): ItemDiff[] {
  const out: ItemDiff[] = [];
  const aMap = new Map(a.map((x) => [x.id, x]));
  const bMap = new Map(b.map((x) => [x.id, x]));
  for (const av of a) {
    const bv = bMap.get(av.id);
    if (!bv) {
      out.push({ id: av.id, kind: 'removed', title: av.category || 'Untitled group' });
      continue;
    }
    const beforeNames = av.items.map((i) => i.name);
    const afterNames = bv.items.map((i) => i.name);
    const fieldsBefore = beforeNames.join(', ');
    const fieldsAfter = afterNames.join(', ');
    if (fieldsBefore === fieldsAfter && av.category === bv.category) continue;
    const fields: FieldChange[] = [];
    const cat = diffField(av.category, bv.category, 'category');
    if (cat) fields.push(cat);
    if (fieldsBefore !== fieldsAfter) fields.push({ field: 'items', before: fieldsBefore, after: fieldsAfter });
    out.push({
      id: av.id,
      kind: 'changed',
      title: bv.category || 'Untitled group',
      fieldChanges: fields,
    });
  }
  for (const bv of b) {
    if (!aMap.has(bv.id)) {
      out.push({
        id: bv.id,
        kind: 'added',
        title: bv.category || 'Untitled group',
        subtitle: bv.items.map((i) => i.name).join(', '),
      });
    }
  }
  return out;
}

export function diffResumes(a: ResumeData, b: ResumeData): ResumeDiff {
  const profile = (
    [
      diffField(a.profile.fullName, b.profile.fullName, 'name'),
      diffField(a.profile.title, b.profile.title, 'title'),
      diffField(a.profile.email, b.profile.email, 'email'),
      diffField(a.profile.phone, b.profile.phone, 'phone'),
      diffField(a.profile.location, b.profile.location, 'location'),
      diffField(a.profile.website, b.profile.website, 'website'),
      diffField(a.profile.summary, b.profile.summary, 'summary'),
    ].filter((x): x is FieldChange => x !== null)
  );
  const template = a.template !== b.template
    ? { field: 'template', before: a.template, after: b.template }
    : undefined;

  const experience = diffExperience(a.experience, b.experience);
  const education = diffEducation(a.education, b.education);
  const projects = diffProjects(a.projects, b.projects);
  const skills = diffSkills(a.skills, b.skills);

  const allItems = [...experience, ...education, ...projects, ...skills];
  const added = allItems.filter((i) => i.kind === 'added').length;
  const removed = allItems.filter((i) => i.kind === 'removed').length;
  const changed = allItems.filter((i) => i.kind === 'changed').length + profile.length + (template ? 1 : 0);

  return { profile, template, experience, education, projects, skills, summary: { added, removed, changed } };
}
