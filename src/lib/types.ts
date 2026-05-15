export type TemplateId =
  // handwriting / creative
  | 'notebook'
  | 'matcha'
  | 'editorial'
  | 'polaroid'
  | 'minimalink'
  // professional
  | 'onyx'
  | 'cascade'
  | 'bronzor'
  | 'enfold'
  | 'cubic'
  | 'mono'
  | 'marquee';

export type TemplateCategory = 'professional' | 'creative';

export type FontKey =
  | 'inter'
  | 'lato'
  | 'rubik'
  | 'fraunces'
  | 'lora'
  | 'playfair'
  | 'jetbrains'
  | 'caveat'
  | 'kalam';

export type Density = 'compact' | 'comfortable' | 'spacious';
export type PageFormat = 'A4' | 'Letter';

export type PaperTexture = 'plain' | 'cream' | 'lined' | 'grid' | 'dotted' | 'coffee';

export type StickerKind =
  | 'star'
  | 'heart'
  | 'flower'
  | 'leaf'
  | 'spiral'
  | 'coffee'
  | 'paper-plane'
  | 'arrow'
  | 'squiggle';

export interface Sticker {
  id: string;
  kind: StickerKind;
  // 0..100 percentages relative to the page
  x: number;
  y: number;
  rotation: number; // degrees
  size: number; // pixels
  color: string;
}

export type BulletSymbol = '•' | '–' | '→' | '✦' | '·' | 'none';

/** Per-section-type typography overrides. All fields optional — undefined = use template default. */
export interface SectionTypography {
  /** Multiplier on the section heading size. 0.7 – 1.5. */
  titleSize?: number;
  /** Multiplier on the section body text. 0.7 – 1.4. */
  bodySize?: number;
  /** Extra space (px) added before the section. */
  sectionGapTop?: number;
  /** Extra space (px) between items inside this section. */
  itemGap?: number;
  /** Multiplier on line height for body text in this section. 1.0 – 2.0. */
  lineHeight?: number;
  /** Symbol used for bullets in this section. */
  bulletSymbol?: BulletSymbol;
  /** Font used for the section heading. */
  fontHead?: FontKey;
  /** Font used for the section body text. */
  fontBody?: FontKey;
  /** Override accent color (used for section title + bullet markers). */
  accent?: string;
  /** Override heading color (used for item titles within the section). */
  heading?: string;
  /** Override body text color within the section. */
  text?: string;
}

export type SectionTypographyMap = Partial<Record<SectionType, SectionTypography>>;

export interface Customization {
  accent: string;
  heading: string;
  text: string;
  muted: string;
  background: string;
  sidebar: string;
  sidebarText: string;
  fontHead: FontKey;
  fontBody: FontKey;
  density: Density;
  format: PageFormat;
  showPhoto: boolean;
  photo?: string;
  paperTexture: PaperTexture;
  stickers: Sticker[];
  /** Per-section-type typography overrides. */
  typography?: SectionTypographyMap;
}

/** Per-item layout overrides — applied to an individual job, project, etc. */
export interface ItemOverrides {
  /** Multiplier on this item's font size. 0.7 – 1.5. */
  fontSize?: number;
  /** Extra space (px) added before this item. */
  spaceBefore?: number;
  /** When true, force a print page break before this item. */
  pageBreakBefore?: boolean;
  /** When true, ask the renderer to keep this item on a single page. */
  keepTogether?: boolean;
}

export type SectionType =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'summary'
  | 'custom';

export interface Profile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string[];
  overrides?: ItemOverrides;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  notes: string;
  overrides?: ItemOverrides;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
  tech: string[];
  overrides?: ItemOverrides;
}

export interface SkillItem {
  name: string;
  level?: 1 | 2 | 3 | 4 | 5;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: SkillItem[];
}

export function asSkill(input: string | SkillItem): SkillItem {
  return typeof input === 'string' ? { name: input } : input;
}

export function skillName(input: string | SkillItem): string {
  return typeof input === 'string' ? input : input.name;
}

export function skillLevel(input: string | SkillItem): number | undefined {
  return typeof input === 'string' ? undefined : input.level;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface AwardItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  overrides?: ItemOverrides;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
}

export interface CustomSectionContent {
  id: string;
  body: string;
}

export type LetterTemplateId =
  | 'onyx-letter'
  | 'marquee-letter'
  | 'notebook-letter'
  | 'cascade-letter'
  | 'mono-letter';

export interface CoverLetter {
  template: LetterTemplateId;
  recipientName: string;
  recipientCompany: string;
  recipientAddress: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  signatureName: string;
  // When false, the sender block on the letter pulls from the resume profile.
  // When true, the user can override it via senderName/senderEmail/etc.
  overrideSender: boolean;
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
  senderWebsite: string;
}

export interface ResumeData {
  profile: Profile;
  sections: Section[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards: AwardItem[];
  customSections: Record<string, CustomSectionContent>;
  template: TemplateId;
  customization: Customization;
  letter: CoverLetter;
}

export const DEFAULT_CUSTOMIZATION: Customization = {
  accent: '#3D4A2A',
  heading: '#1A1A1A',
  text: '#2D2D2D',
  muted: '#6B6B6B',
  background: '#FFFFFF',
  sidebar: '#2A331C',
  sidebarText: '#FBF8F1',
  fontHead: 'inter',
  fontBody: 'inter',
  density: 'comfortable',
  format: 'A4',
  showPhoto: false,
  paperTexture: 'plain',
  stickers: [],
};

export const DEFAULT_RESUME: ResumeData = {
  profile: {
    fullName: 'Aria Hollis',
    title: 'Senior Product Designer',
    email: 'aria@easycv.app',
    phone: '+1 (415) 555-0142',
    location: 'Brooklyn, NY',
    website: 'ariahollis.studio',
    summary:
      'Senior product designer with 7+ years shipping consumer SaaS. I lead design systems, mentor junior designers, and translate ambiguous business problems into focused, measurable product wins.',
  },
  sections: [
    { id: 's-summary', type: 'summary', title: 'Summary', visible: true },
    { id: 's-exp', type: 'experience', title: 'Experience', visible: true },
    { id: 's-proj', type: 'projects', title: 'Selected Projects', visible: true },
    { id: 's-edu', type: 'education', title: 'Education', visible: true },
    { id: 's-skills', type: 'skills', title: 'Skills', visible: true },
    { id: 's-lang', type: 'languages', title: 'Languages', visible: true },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: false },
    { id: 's-awards', type: 'awards', title: 'Awards', visible: false },
  ],
  experience: [
    {
      id: 'e1',
      company: 'Marigold Studio',
      role: 'Senior Product Designer',
      location: 'Remote',
      start: 'Jan 2022',
      end: 'Present',
      current: true,
      bullets: [
        'Led the redesign of the flagship editor used by 80,000+ daily creators, lifting weekly retention by 18% and trial-to-paid conversion by 11%.',
        'Built and shipped a 120-component design system across web and iOS, reducing new-feature design time by ~40%.',
        'Mentored two junior designers through a structured craft program; both promoted within 12 months.',
      ],
    },
    {
      id: 'e2',
      company: 'Paperpress',
      role: 'Product Designer',
      location: 'New York, NY',
      start: 'Mar 2019',
      end: 'Dec 2021',
      current: false,
      bullets: [
        'Shipped the company\'s first mobile app, going from 0 to 40,000 monthly active users in eight months.',
        'Owned end-to-end design for the publishing flow used by 1,200 paying creators.',
        'Partnered with engineering to define the analytics taxonomy now used by every product team.',
      ],
    },
    {
      id: 'e3',
      company: 'Northwind Labs',
      role: 'Junior Designer',
      location: 'Boston, MA',
      start: 'Jul 2017',
      end: 'Feb 2019',
      current: false,
      bullets: [
        'Designed onboarding flows for an early-stage CRM, shortening time-to-value from 18 minutes to 4.',
        'Ran weekly usability sessions; findings drove the company\'s first quarterly OKR centered on activation.',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      school: 'Rhode Island School of Design',
      degree: 'BFA',
      field: 'Graphic Design',
      start: '2013',
      end: '2017',
      notes: 'Dean\'s List, 2015–2017. Thesis: "Type that breathes."',
    },
  ],
  skills: [
    {
      id: 'sk1',
      category: 'Design',
      items: [
        { name: 'Figma', level: 5 },
        { name: 'Framer', level: 4 },
        { name: 'Prototyping', level: 5 },
        { name: 'Design Systems', level: 5 },
        { name: 'User Research', level: 4 },
      ],
    },
    {
      id: 'sk2',
      category: 'Engineering',
      items: [
        { name: 'HTML' },
        { name: 'CSS' },
        { name: 'React' },
        { name: 'TypeScript' },
        { name: 'Git' },
      ],
    },
    {
      id: 'sk3',
      category: 'Leadership',
      items: [
        { name: 'Mentoring' },
        { name: 'Cross-functional facilitation' },
        { name: 'Workshops' },
        { name: 'Hiring' },
      ],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Slowbrew Journal',
      link: 'slowbrew.cafe',
      description:
        'Weekly newsletter on patient design — grew to 12,000 subscribers in 18 months with hand-illustrated issues.',
      tech: ['Substack', 'Procreate'],
    },
    {
      id: 'p2',
      name: 'Field Notes App',
      link: 'fieldapp.io',
      description:
        'Open-source iOS app for naturalists — sketch, geotag, and share field observations.',
      tech: ['SwiftUI', 'MapKit', 'CloudKit'],
    },
  ],
  certifications: [
    { id: 'c1', name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', date: '2023' },
  ],
  languages: [
    { id: 'l1', name: 'English', level: 'Native' },
    { id: 'l2', name: 'French', level: 'Conversational' },
    { id: 'l3', name: 'Spanish', level: 'Reading' },
  ],
  awards: [
    {
      id: 'a1',
      name: 'AIGA Best in Show',
      issuer: 'AIGA New York',
      date: '2023',
      description: 'For the Marigold Studio editor redesign.',
    },
  ],
  customSections: {},
  template: 'onyx',
  customization: DEFAULT_CUSTOMIZATION,
  letter: {
    template: 'onyx-letter',
    recipientName: 'Hiring Team',
    recipientCompany: 'Marigold Studio',
    recipientAddress: '120 Oak Lane, Brooklyn, NY',
    date: 'May 14, 2026',
    subject: 'Re: Senior Product Designer',
    salutation: 'Dear Marigold team,',
    body: `I have been a quiet admirer of your editor for years — the way it leans into care over speed is exactly the kind of design I want to keep doing.

Over the last seven years I have led design on consumer SaaS used by ~80,000 daily creators, built out a 120-component design system across web and iOS, and grown two junior designers into senior contributors. The thread through all of it: keep the surface warm, keep the underlying mechanics honest.

I would love to talk about how I could help shape the next chapter of the editor. I have attached my resume and a few sample projects.

Thank you for reading,`,
    closing: 'Warmly,',
    signatureName: 'Aria Hollis',
    overrideSender: false,
    senderName: '',
    senderTitle: '',
    senderEmail: '',
    senderPhone: '',
    senderLocation: '',
    senderWebsite: '',
  },
};

export const EMPTY_LETTER: CoverLetter = {
  template: 'onyx-letter',
  recipientName: '',
  recipientCompany: '',
  recipientAddress: '',
  date: '',
  subject: '',
  salutation: 'Dear Hiring Team,',
  body: '',
  closing: 'Sincerely,',
  signatureName: '',
  overrideSender: false,
  senderName: '',
  senderTitle: '',
  senderEmail: '',
  senderPhone: '',
  senderLocation: '',
  senderWebsite: '',
};
