export interface SectionPreset {
  id: string;
  title: string;
  hint: string;
  body: string;
  icon: string;
}

export const SECTION_PRESETS: ReadonlyArray<SectionPreset> = [
  {
    id: 'volunteering',
    title: 'Volunteering',
    hint: 'org names, your role, and the impact',
    icon: '✿',
    body:
`**Habitat for Humanity** · Site lead, 2023–present
Coordinated weekend builds with crews of 8–15 volunteers; trained 30+ first-timers on basic carpentry safety.

**Local Library** · Reading buddy, 2022–2023
Weekly 1:1 sessions with K–2 students working on phonics.`,
  },
  {
    id: 'publications',
    title: 'Publications',
    hint: 'papers, posts, talks — link to each',
    icon: '☉',
    body:
`**"How we shipped a 0→1 design system in 90 days"** · *A List Apart*, 2024
[alistapart.com/article/...](https://alistapart.com)

**"Quiet defaults: design for the patient user"** · *UX Collective*, 2023`,
  },
  {
    id: 'talks',
    title: 'Talks & Speaking',
    hint: 'conferences, podcasts, internal talks',
    icon: '◐',
    body:
`**Config 2024** · "Designing for the long quiet" · 30 min
**Design Systems Berlin** · "Tokens that survive contact with engineering" · workshop, 2023
**Podcast: Design Details** · ep. 412 · 2023`,
  },
  {
    id: 'references',
    title: 'References',
    hint: 'one-line, "available upon request" optional',
    icon: '✦',
    body:
`References available on request — happy to share contacts for any of the roles above.`,
  },
  {
    id: 'interests',
    title: 'Interests',
    hint: 'a short, human line — not a list of clichés',
    icon: '♡',
    body:
`Letterpress printing, slow coffee, distance running (3:42 marathon best), and convincing people to read more poetry.`,
  },
  {
    id: 'open-source',
    title: 'Open Source',
    hint: 'projects you maintain or contribute to',
    icon: '◇',
    body:
`**[your-project](https://github.com/you/your-project)** · maintainer
A 2.1k-star library that does one small thing well. Triaged 80+ issues last year; reviewed 30+ PRs.

**[other-project](https://github.com/...)** · regular contributor
Refactored the test runner to cut CI time in half.`,
  },
  {
    id: 'patents',
    title: 'Patents',
    hint: 'title · status · year · co-inventors',
    icon: '⌗',
    body:
`**Method and system for adaptive task scheduling** — *US Patent 11,234,567* · Granted 2024
Co-inventors: Pat Alvarez, Dana Kim`,
  },
  {
    id: 'thesis',
    title: 'Thesis & Research',
    hint: 'title · advisor · one-line abstract',
    icon: '✎',
    body:
`**"Type that breathes: vertical rhythm in long-form digital reading"** — RISD, 2017
Advisor: Prof. M. Hollander
Argued for grid-aware leading scales; prototype shipped to 4,000 readers.`,
  },
];
