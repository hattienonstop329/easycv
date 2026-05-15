import { ResumeData, DEFAULT_CUSTOMIZATION, EMPTY_LETTER } from './types';

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  data: ResumeData;
}

const blank = (): ResumeData['letter'] => ({ ...EMPTY_LETTER });

const designer: ResumeData = {
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
    { id: 's-awards', type: 'awards', title: 'Awards', visible: false },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: false },
  ],
  experience: [
    { id: 'd-e1', company: 'Marigold Studio', role: 'Senior Product Designer', location: 'Remote', start: 'Jan 2022', end: 'Present', current: true,
      bullets: [
        'Led the redesign of the flagship editor used by 80,000+ daily creators, lifting weekly retention by 18%.',
        'Built and shipped a 120-component design system across web and iOS.',
        'Mentored two junior designers; both promoted within 12 months.',
      ] },
    { id: 'd-e2', company: 'Paperpress', role: 'Product Designer', location: 'New York, NY', start: 'Mar 2019', end: 'Dec 2021', current: false,
      bullets: [
        'Shipped the first mobile app, going from 0 → 40k MAU in eight months.',
        'Owned end-to-end design for the publishing flow used by 1,200 paying creators.',
      ] },
  ],
  education: [
    { id: 'd-ed1', school: 'Rhode Island School of Design', degree: 'BFA', field: 'Graphic Design', start: '2013', end: '2017', notes: "Dean's List 2015–2017." },
  ],
  skills: [
    { id: 'd-s1', category: 'Design', items: [{ name: 'Figma' }, { name: 'Framer' }, { name: 'Prototyping' }, { name: 'Design Systems' }, { name: 'User Research' }] },
    { id: 'd-s2', category: 'Engineering', items: [{ name: 'HTML' }, { name: 'CSS' }, { name: 'React basics' }] },
  ],
  projects: [
    { id: 'd-p1', name: 'Slowbrew Journal', link: 'slowbrew.cafe', description: 'Weekly newsletter on patient design — grew to 12k subscribers.', tech: ['Substack'] },
  ],
  certifications: [],
  languages: [{ id: 'd-l1', name: 'English', level: 'Native' }, { id: 'd-l2', name: 'French', level: 'Conversational' }],
  awards: [],
  customSections: {},
  template: 'onyx',
  customization: { ...DEFAULT_CUSTOMIZATION },
  letter: blank(),
};

const engineer: ResumeData = {
  profile: {
    fullName: 'Jordan Park',
    title: 'Staff Software Engineer',
    email: 'jordan@easycv.app',
    phone: '+1 (206) 555-0119',
    location: 'Seattle, WA',
    website: 'github.com/jpark',
    summary:
      'Staff engineer with 9 years building distributed systems at scale. I optimize for reliability, on-call sanity, and migrations that nobody notices.',
  },
  sections: [
    { id: 's-summary', type: 'summary', title: 'Summary', visible: true },
    { id: 's-exp', type: 'experience', title: 'Experience', visible: true },
    { id: 's-skills', type: 'skills', title: 'Skills', visible: true },
    { id: 's-proj', type: 'projects', title: 'Open Source', visible: true },
    { id: 's-edu', type: 'education', title: 'Education', visible: true },
    { id: 's-lang', type: 'languages', title: 'Languages', visible: false },
    { id: 's-awards', type: 'awards', title: 'Awards', visible: false },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: false },
  ],
  experience: [
    { id: 'j-e1', company: 'Northwave', role: 'Staff Software Engineer', location: 'Seattle, WA', start: 'Apr 2022', end: 'Present', current: true,
      bullets: [
        'Cut p99 API latency from 1.2s → 280ms by sharding the read path and adding a hot-key cache.',
        'Led migration of 14 services from REST to gRPC; zero customer-visible incidents over 3 months.',
        'Hired 4 engineers; built and ran the on-call rotation for a 38-engineer org.',
      ] },
    { id: 'j-e2', company: 'Pageturn', role: 'Senior Software Engineer', location: 'Remote', start: 'Aug 2018', end: 'Mar 2022', current: false,
      bullets: [
        'Designed and shipped the analytics pipeline (Kafka + ClickHouse) ingesting 4B events/day.',
        'Wrote the company\'s first SRE runbook and incident review template — adopted org-wide.',
      ] },
  ],
  education: [
    { id: 'j-ed1', school: 'Carnegie Mellon University', degree: 'BS', field: 'Computer Science', start: '2013', end: '2017', notes: '' },
  ],
  skills: [
    { id: 'j-s1', category: 'Languages', items: [{ name: 'Go' }, { name: 'Python' }, { name: 'TypeScript' }, { name: 'Rust' }, { name: 'SQL' }] },
    { id: 'j-s2', category: 'Infrastructure', items: [{ name: 'Kubernetes' }, { name: 'Terraform' }, { name: 'AWS' }, { name: 'Kafka' }, { name: 'PostgreSQL' }, { name: 'Redis' }] },
    { id: 'j-s3', category: 'Practices', items: [{ name: 'SRE' }, { name: 'Incident response' }, { name: 'TDD' }, { name: 'Code review' }] },
  ],
  projects: [
    { id: 'j-p1', name: 'caddyshack', link: 'github.com/jpark/caddyshack', description: 'Drop-in Kubernetes admission controller for cost guardrails. 2.1k stars.', tech: ['Go', 'K8s'] },
  ],
  certifications: [],
  languages: [],
  awards: [],
  customSections: {},
  template: 'mono',
  customization: { ...DEFAULT_CUSTOMIZATION, accent: '#1F4068', sidebar: '#1A2438', fontHead: 'jetbrains' },
  letter: blank(),
};

const student: ResumeData = {
  profile: {
    fullName: 'Sam Iyer',
    title: 'CS Undergraduate · Class of 2027',
    email: 'sam.iyer@university.edu',
    phone: '+1 (617) 555-0173',
    location: 'Cambridge, MA',
    website: 'samiyer.dev',
    summary:
      'CS undergraduate looking for a Summer 2026 software engineering internship. I build small, useful things and I am at my best with a clear problem and a deadline.',
  },
  sections: [
    { id: 's-summary', type: 'summary', title: 'Summary', visible: true },
    { id: 's-edu', type: 'education', title: 'Education', visible: true },
    { id: 's-exp', type: 'experience', title: 'Experience', visible: true },
    { id: 's-proj', type: 'projects', title: 'Projects', visible: true },
    { id: 's-skills', type: 'skills', title: 'Skills', visible: true },
    { id: 's-lang', type: 'languages', title: 'Languages', visible: false },
    { id: 's-awards', type: 'awards', title: 'Awards', visible: true },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: false },
  ],
  experience: [
    { id: 's-e1', company: 'University Robotics Lab', role: 'Undergraduate Researcher', location: 'Cambridge, MA', start: 'Sep 2024', end: 'Present', current: true,
      bullets: [
        'Built the data-collection pipeline for a 6-DOF arm experiment — 12k+ trials processed daily.',
        'Co-authored a paper draft on contact-rich manipulation (under review at ICRA 2026).',
      ] },
  ],
  education: [
    { id: 's-ed1', school: 'University of Massachusetts', degree: 'BS', field: 'Computer Science', start: 'Sep 2023', end: 'May 2027', notes: 'GPA: 3.92 · Coursework: Algorithms, Operating Systems, ML, Distributed Systems.' },
  ],
  skills: [
    { id: 's-s1', category: 'Languages', items: [{ name: 'Python' }, { name: 'C++' }, { name: 'TypeScript' }, { name: 'JavaScript' }] },
    { id: 's-s2', category: 'Tools', items: [{ name: 'Git' }, { name: 'Linux' }, { name: 'PyTorch' }, { name: 'React' }] },
  ],
  projects: [
    { id: 's-p1', name: 'mealmate', link: 'github.com/sami/mealmate', description: 'iOS app that turns a fridge photo into recipes. Featured in the campus paper.', tech: ['Swift', 'OpenAI API'] },
    { id: 's-p2', name: 'cs-notes', link: 'samiyer.dev/notes', description: 'Open-source course notes for CS 240, used by 800+ students this semester.', tech: ['Markdown', 'MkDocs'] },
  ],
  certifications: [],
  languages: [],
  awards: [
    { id: 's-a1', name: 'Hackathon Best UX', issuer: 'HackMIT 2024', date: '2024', description: 'For mealmate.' },
  ],
  customSections: {},
  template: 'onyx',
  customization: { ...DEFAULT_CUSTOMIZATION, accent: '#7C3AED' },
  letter: blank(),
};

const founder: ResumeData = {
  profile: {
    fullName: 'Maya Okafor',
    title: 'Founder · ex-Stripe',
    email: 'maya@okafor.co',
    phone: '+1 (415) 555-0181',
    location: 'San Francisco, CA',
    website: 'okafor.co',
    summary:
      'Founder and operator who builds zero-to-product. Started a B2B fintech (acquired 2024), shipped infrastructure at Stripe, and most recently raised a $6M seed for a developer-tools company.',
  },
  sections: [
    { id: 's-summary', type: 'summary', title: 'About', visible: true },
    { id: 's-exp', type: 'experience', title: 'Selected Experience', visible: true },
    { id: 's-edu', type: 'education', title: 'Education', visible: true },
    { id: 's-skills', type: 'skills', title: 'Strengths', visible: true },
    { id: 's-awards', type: 'awards', title: 'Notable', visible: true },
    { id: 's-proj', type: 'projects', title: 'Projects', visible: false },
    { id: 's-lang', type: 'languages', title: 'Languages', visible: false },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: false },
  ],
  experience: [
    { id: 'm-e1', company: 'Inkstone (stealth)', role: 'Co-founder & CEO', location: 'San Francisco, CA', start: 'Jan 2024', end: 'Present', current: true,
      bullets: [
        'Raised $6M seed from Felicis and a16z to build the next-gen testing platform.',
        'Hired the founding team (5 eng, 1 designer, 1 PM) and shipped private alpha to 22 design partners.',
      ] },
    { id: 'm-e2', company: 'Sundial', role: 'Co-founder & CTO', location: 'Remote', start: 'Mar 2020', end: 'Nov 2023', current: false,
      bullets: [
        'Built B2B fintech reconciliation tool from zero to $4M ARR; acquired by a public co. in late 2023.',
        'Served as CTO through Series A, scaled engineering org from 2 → 19.',
      ] },
    { id: 'm-e3', company: 'Stripe', role: 'Senior Engineer, Infrastructure', location: 'San Francisco, CA', start: 'Jul 2016', end: 'Feb 2020', current: false,
      bullets: [
        'Led the Schemas & API team; shipped the v2 API consumed by 90% of Stripe traffic.',
      ] },
  ],
  education: [
    { id: 'm-ed1', school: 'Stanford University', degree: 'BS', field: 'Computer Science', start: '2012', end: '2016', notes: 'Honors thesis: queue scheduling for low-latency RPCs.' },
  ],
  skills: [
    { id: 'm-s1', category: 'Operating', items: [{ name: 'Hiring' }, { name: 'Fundraising' }, { name: 'Roadmap planning' }, { name: 'Board management' }] },
    { id: 'm-s2', category: 'Engineering', items: [{ name: 'Distributed systems' }, { name: 'API design' }, { name: 'Go' }, { name: 'TypeScript' }, { name: 'Postgres' }] },
  ],
  projects: [],
  certifications: [],
  languages: [],
  awards: [
    { id: 'm-a1', name: '40 under 40', issuer: 'Forbes', date: '2024', description: '' },
  ],
  customSections: {},
  template: 'marquee',
  customization: { ...DEFAULT_CUSTOMIZATION, fontHead: 'playfair', accent: '#0B1F3A', heading: '#0B1F3A', sidebar: '#0B1F3A' },
  letter: blank(),
};

const switcher: ResumeData = {
  profile: {
    fullName: 'Riley Chen',
    title: 'Career Switcher → Software Engineer',
    email: 'riley@easycv.app',
    phone: '+1 (303) 555-0146',
    location: 'Denver, CO',
    website: 'rileychen.dev',
    summary:
      'Former mechanical engineer transitioning into software. Six years of engineering rigor, two years of self-taught web development, and one bootcamp completed with honors. Looking for a junior or apprentice role on a team that values craft and clear writing.',
  },
  sections: [
    { id: 's-summary', type: 'summary', title: 'About', visible: true },
    { id: 's-skills', type: 'skills', title: 'Technical Skills', visible: true },
    { id: 's-proj', type: 'projects', title: 'Projects', visible: true },
    { id: 's-exp', type: 'experience', title: 'Experience', visible: true },
    { id: 's-edu', type: 'education', title: 'Education', visible: true },
    { id: 's-cert', type: 'certifications', title: 'Certifications', visible: true },
    { id: 's-lang', type: 'languages', title: 'Languages', visible: false },
    { id: 's-awards', type: 'awards', title: 'Awards', visible: false },
  ],
  experience: [
    { id: 'r-e1', company: 'Apex Manufacturing', role: 'Mechanical Engineer II', location: 'Denver, CO', start: 'Jul 2018', end: 'Mar 2024', current: false,
      bullets: [
        'Owned design and tolerancing for a $14M product line; cut field failure rate by 35% over two years.',
        'Built internal CAD-automation scripts (Python) that saved the team ~12 hours/week.',
        'Mentored 4 new engineers through their first design reviews.',
      ] },
  ],
  education: [
    { id: 'r-ed1', school: 'University of Colorado Boulder', degree: 'BS', field: 'Mechanical Engineering', start: '2014', end: '2018', notes: '' },
  ],
  skills: [
    { id: 'r-s1', category: 'Languages', items: [{ name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'Python' }] },
    { id: 'r-s2', category: 'Web', items: [{ name: 'React' }, { name: 'Next.js' }, { name: 'Node.js' }, { name: 'Tailwind' }] },
    { id: 'r-s3', category: 'Tools', items: [{ name: 'Git' }, { name: 'PostgreSQL' }, { name: 'Docker basics' }] },
  ],
  projects: [
    { id: 'r-p1', name: 'commute', link: 'commute.rileychen.dev', description: 'Open-source bike-route planner that prioritizes shaded streets. 480 stars on GitHub.', tech: ['Next.js', 'Mapbox'] },
    { id: 'r-p2', name: 'pinwheel', link: 'github.com/rcc/pinwheel', description: 'A tiny CLI for rotating .env files across local projects.', tech: ['Node.js', 'TypeScript'] },
  ],
  certifications: [
    { id: 'r-c1', name: 'Full-Stack Web Development', issuer: 'Hack Reactor', date: '2024' },
  ],
  languages: [],
  awards: [],
  customSections: {},
  template: 'enfold',
  customization: { ...DEFAULT_CUSTOMIZATION, accent: '#0F5132' },
  letter: blank(),
};

export const PERSONAS: ReadonlyArray<Persona> = [
  {
    id: 'designer',
    name: 'Designer',
    tagline: 'Senior product designer',
    blurb: '7+ years, design systems, mentoring. Onyx template + earth tones.',
    data: designer,
  },
  {
    id: 'engineer',
    name: 'Engineer',
    tagline: 'Staff software engineer',
    blurb: 'Distributed systems, gRPC, on-call. Mono template + slate accent.',
    data: engineer,
  },
  {
    id: 'student',
    name: 'Student',
    tagline: 'CS undergraduate',
    blurb: 'Internship hunt, projects-forward. Onyx + orchid accent.',
    data: student,
  },
  {
    id: 'founder',
    name: 'Founder',
    tagline: 'Founder · ex-Stripe',
    blurb: 'Acquisition, fundraising, hiring. Marqee template + navy.',
    data: founder,
  },
  {
    id: 'switcher',
    name: 'Career switcher',
    tagline: 'ME → SWE',
    blurb: 'Career change, projects + bootcamp. Enfold template + forest.',
    data: switcher,
  },
];
