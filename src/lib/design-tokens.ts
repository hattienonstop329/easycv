import { Customization, FontKey, TemplateId, TemplateCategory } from './types';

export interface ColorTheme {
  id: string;
  name: string;
  accent: string;
  heading: string;
  text: string;
  muted: string;
  background: string;
  sidebar: string;
  sidebarText: string;
}

export const COLOR_THEMES: ReadonlyArray<ColorTheme> = [
  {
    id: 'earth',
    name: 'Earth',
    accent: '#3D4A2A',
    heading: '#2A331C',
    text: '#2D2D2D',
    muted: '#6B6B6B',
    background: '#FFFFFF',
    sidebar: '#2A331C',
    sidebarText: '#FBF8F1',
  },
  {
    id: 'slate',
    name: 'Slate',
    accent: '#1F4068',
    heading: '#0F1B2D',
    text: '#222831',
    muted: '#6C7480',
    background: '#FFFFFF',
    sidebar: '#1A2438',
    sidebarText: '#F1F5F9',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    accent: '#B45309',
    heading: '#171717',
    text: '#262626',
    muted: '#737373',
    background: '#FFFFFF',
    sidebar: '#1A1A1A',
    sidebarText: '#F5F5F4',
  },
  {
    id: 'navy',
    name: 'Navy',
    accent: '#C19A4B',
    heading: '#0B1F3A',
    text: '#1F2937',
    muted: '#6B7280',
    background: '#FFFFFF',
    sidebar: '#0B1F3A',
    sidebarText: '#F8FAFC',
  },
  {
    id: 'forest',
    name: 'Forest',
    accent: '#0F5132',
    heading: '#0A2E1F',
    text: '#1F2A24',
    muted: '#6B7770',
    background: '#FFFFFF',
    sidebar: '#0A2E1F',
    sidebarText: '#F0F4EC',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    accent: '#8E2C36',
    heading: '#3F1A1F',
    text: '#2E1F22',
    muted: '#7A6B6E',
    background: '#FFFFFF',
    sidebar: '#3F1A1F',
    sidebarText: '#FAF6F2',
  },
  {
    id: 'mono',
    name: 'Mono',
    accent: '#000000',
    heading: '#000000',
    text: '#1A1A1A',
    muted: '#6B6B6B',
    background: '#FFFFFF',
    sidebar: '#000000',
    sidebarText: '#FFFFFF',
  },
  {
    id: 'orchid',
    name: 'Orchid',
    accent: '#7C3AED',
    heading: '#312E81',
    text: '#27272A',
    muted: '#71717A',
    background: '#FFFFFF',
    sidebar: '#1E1B4B',
    sidebarText: '#F5F3FF',
  },
  {
    id: 'paper',
    name: 'Paper',
    accent: '#3D4A2A',
    heading: '#2A331C',
    text: '#4A3F35',
    muted: '#6B5D50',
    background: '#FBF8F1',
    sidebar: '#3D4A2A',
    sidebarText: '#FBF8F1',
  },
];

export interface FontDef {
  key: FontKey;
  name: string;
  cssVar: string;
  family: 'sans' | 'serif' | 'mono' | 'hand';
}

export const FONTS: ReadonlyArray<FontDef> = [
  { key: 'inter', name: 'Inter', cssVar: 'var(--font-inter)', family: 'sans' },
  { key: 'lato', name: 'Lato', cssVar: 'var(--font-lato)', family: 'sans' },
  { key: 'rubik', name: 'Rubik', cssVar: 'var(--font-rubik)', family: 'sans' },
  { key: 'fraunces', name: 'Fraunces', cssVar: 'var(--font-fraunces)', family: 'serif' },
  { key: 'lora', name: 'Lora', cssVar: 'var(--font-lora)', family: 'serif' },
  { key: 'playfair', name: 'Playfair Display', cssVar: 'var(--font-playfair)', family: 'serif' },
  { key: 'jetbrains', name: 'JetBrains Mono', cssVar: 'var(--font-jetbrains)', family: 'mono' },
  { key: 'caveat', name: 'Caveat', cssVar: 'var(--font-caveat)', family: 'hand' },
  { key: 'kalam', name: 'Kalam', cssVar: 'var(--font-kalam)', family: 'hand' },
];

export function fontVar(key: FontKey): string {
  return FONTS.find((f) => f.key === key)?.cssVar ?? 'var(--font-inter)';
}

export interface DensityScale {
  key: 'compact' | 'comfortable' | 'spacious';
  name: string;
  basePx: number;
  lineHeight: number;
  sectionGapPx: number;
  itemGapPx: number;
}

export const DENSITY_SCALES: Record<'compact' | 'comfortable' | 'spacious', DensityScale> = {
  compact: { key: 'compact', name: 'Compact', basePx: 9.5, lineHeight: 1.35, sectionGapPx: 12, itemGapPx: 6 },
  comfortable: { key: 'comfortable', name: 'Comfortable', basePx: 10.5, lineHeight: 1.5, sectionGapPx: 18, itemGapPx: 10 },
  spacious: { key: 'spacious', name: 'Spacious', basePx: 11.5, lineHeight: 1.65, sectionGapPx: 24, itemGapPx: 14 },
};

export interface PageSize {
  key: 'A4' | 'Letter';
  widthPx: number;
  heightPx: number;
  widthMm: string;
  heightMm: string;
}

export const PAGE_SIZES: Record<'A4' | 'Letter', PageSize> = {
  A4: { key: 'A4', widthPx: 794, heightPx: 1123, widthMm: '210mm', heightMm: '297mm' },
  Letter: { key: 'Letter', widthPx: 816, heightPx: 1056, widthMm: '215.9mm', heightMm: '279.4mm' },
};

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  tag: string;
  recommendedTheme?: string;
  recommendedFontHead?: FontKey;
  recommendedFontBody?: FontKey;
  /** Whether the template renders the uploaded photo. Most don't. */
  showsPhoto?: boolean;
}

export const TEMPLATE_REGISTRY: ReadonlyArray<TemplateMeta> = [
  // Professional
  { id: 'onyx', name: 'Onyx', category: 'professional', tag: 'minimal · single-column · ATS-safe', recommendedFontHead: 'inter', recommendedFontBody: 'inter' },
  { id: 'cascade', name: 'Cascade', category: 'professional', tag: 'left sidebar · two-column · technical', recommendedFontHead: 'rubik', recommendedFontBody: 'inter', showsPhoto: true },
  { id: 'bronzor', name: 'Bronzor', category: 'professional', tag: 'classic serif · traditional', recommendedFontHead: 'lora', recommendedFontBody: 'lora' },
  { id: 'enfold', name: 'Enfold', category: 'professional', tag: 'right sidebar · clean', recommendedFontHead: 'inter', recommendedFontBody: 'inter' },
  { id: 'cubic', name: 'Cubic', category: 'professional', tag: 'bold header band · modern', recommendedFontHead: 'rubik', recommendedFontBody: 'inter' },
  { id: 'mono', name: 'Mono', category: 'professional', tag: 'developer · monospace details', recommendedFontHead: 'jetbrains', recommendedFontBody: 'inter' },
  { id: 'marquee', name: 'Marquee', category: 'professional', tag: 'big serif name · executive', recommendedFontHead: 'playfair', recommendedFontBody: 'lora' },
  // Creative / handwriting
  { id: 'notebook', name: 'Notebook', category: 'creative', tag: 'lined paper · cozy', recommendedFontHead: 'caveat', recommendedFontBody: 'inter' },
  { id: 'matcha', name: 'Matcha', category: 'creative', tag: 'two-column · earthy', recommendedFontHead: 'fraunces', recommendedFontBody: 'inter' },
  { id: 'editorial', name: 'Editorial', category: 'creative', tag: 'magazine spread · serif', recommendedFontHead: 'fraunces', recommendedFontBody: 'inter' },
  { id: 'polaroid', name: 'Polaroid', category: 'creative', tag: 'sticker · scrapbook', recommendedFontHead: 'caveat', recommendedFontBody: 'inter' },
  { id: 'minimalink', name: 'Minimal Ink', category: 'creative', tag: 'mono · quiet', recommendedFontHead: 'jetbrains', recommendedFontBody: 'jetbrains' },
];

export function getTemplateMeta(id: TemplateId): TemplateMeta {
  return TEMPLATE_REGISTRY.find((t) => t.id === id) ?? TEMPLATE_REGISTRY[0];
}

export function styleVarsFor(c: Customization): React.CSSProperties {
  const d = DENSITY_SCALES[c.density];
  return {
    ['--accent' as string]: c.accent,
    ['--heading' as string]: c.heading,
    ['--text' as string]: c.text,
    ['--muted' as string]: c.muted,
    ['--bg' as string]: c.background,
    ['--sidebar' as string]: c.sidebar,
    ['--sidebar-text' as string]: c.sidebarText,
    ['--font-head' as string]: fontVar(c.fontHead),
    ['--font-body' as string]: fontVar(c.fontBody),
    ['--base-px' as string]: `${d.basePx}px`,
    ['--line-height' as string]: `${d.lineHeight}`,
    ['--gap-section' as string]: `${d.sectionGapPx}px`,
    ['--gap-item' as string]: `${d.itemGapPx}px`,
    color: c.text,
    backgroundColor: c.background,
    fontFamily: fontVar(c.fontBody),
    fontSize: `${d.basePx}px`,
    lineHeight: d.lineHeight,
  };
}
