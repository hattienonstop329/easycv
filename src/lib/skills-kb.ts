// Curated keyword KB used by the JD matcher.
// Each entry can be matched as a whole word or short phrase.
// Aliases let us match variants (e.g. "node.js" -> "Node.js", "rest" -> "REST APIs").

export interface KbEntry {
  term: string;
  aliases?: string[];
  category: 'language' | 'framework' | 'platform' | 'tool' | 'data' | 'devops' | 'design' | 'soft' | 'method';
}

export const SKILLS_KB: ReadonlyArray<KbEntry> = [
  // Languages
  { term: 'JavaScript', aliases: ['JS'], category: 'language' },
  { term: 'TypeScript', aliases: ['TS'], category: 'language' },
  { term: 'Python', category: 'language' },
  { term: 'Java', category: 'language' },
  { term: 'Kotlin', category: 'language' },
  { term: 'Swift', category: 'language' },
  { term: 'Go', aliases: ['Golang'], category: 'language' },
  { term: 'Rust', category: 'language' },
  { term: 'C++', category: 'language' },
  { term: 'C#', aliases: ['CSharp', 'dotnet', '.NET'], category: 'language' },
  { term: 'Ruby', category: 'language' },
  { term: 'PHP', category: 'language' },
  { term: 'Scala', category: 'language' },
  { term: 'R', category: 'language' },
  { term: 'SQL', category: 'data' },
  { term: 'HTML', category: 'language' },
  { term: 'CSS', category: 'language' },
  { term: 'Sass', aliases: ['SCSS'], category: 'language' },
  { term: 'Bash', aliases: ['Shell scripting'], category: 'language' },
  { term: 'GraphQL', category: 'data' },

  // Frameworks
  { term: 'React', category: 'framework' },
  { term: 'Next.js', aliases: ['NextJS', 'Next'], category: 'framework' },
  { term: 'Vue', aliases: ['Vue.js', 'VueJS'], category: 'framework' },
  { term: 'Nuxt', aliases: ['Nuxt.js'], category: 'framework' },
  { term: 'Angular', category: 'framework' },
  { term: 'Svelte', aliases: ['SvelteKit'], category: 'framework' },
  { term: 'Solid', aliases: ['SolidJS'], category: 'framework' },
  { term: 'Remix', category: 'framework' },
  { term: 'Astro', category: 'framework' },
  { term: 'Node.js', aliases: ['NodeJS', 'Node'], category: 'framework' },
  { term: 'Express', aliases: ['Express.js'], category: 'framework' },
  { term: 'NestJS', aliases: ['Nest.js'], category: 'framework' },
  { term: 'Django', category: 'framework' },
  { term: 'Flask', category: 'framework' },
  { term: 'FastAPI', category: 'framework' },
  { term: 'Spring', aliases: ['Spring Boot'], category: 'framework' },
  { term: 'Rails', aliases: ['Ruby on Rails'], category: 'framework' },
  { term: 'Laravel', category: 'framework' },
  { term: 'Tailwind', aliases: ['Tailwind CSS'], category: 'framework' },
  { term: 'Bootstrap', category: 'framework' },
  { term: 'Material UI', aliases: ['MUI'], category: 'framework' },
  { term: 'shadcn/ui', aliases: ['shadcn'], category: 'framework' },
  { term: 'Chakra UI', category: 'framework' },
  { term: 'Storybook', category: 'tool' },
  { term: 'React Native', category: 'framework' },
  { term: 'Flutter', category: 'framework' },
  { term: 'SwiftUI', category: 'framework' },
  { term: 'Jetpack Compose', category: 'framework' },

  // Data / DB
  { term: 'PostgreSQL', aliases: ['Postgres'], category: 'data' },
  { term: 'MySQL', category: 'data' },
  { term: 'SQLite', category: 'data' },
  { term: 'MongoDB', category: 'data' },
  { term: 'Redis', category: 'data' },
  { term: 'DynamoDB', category: 'data' },
  { term: 'Cassandra', category: 'data' },
  { term: 'BigQuery', category: 'data' },
  { term: 'Snowflake', category: 'data' },
  { term: 'Redshift', category: 'data' },
  { term: 'Elasticsearch', category: 'data' },
  { term: 'Kafka', aliases: ['Apache Kafka'], category: 'data' },
  { term: 'Spark', aliases: ['Apache Spark'], category: 'data' },
  { term: 'Airflow', aliases: ['Apache Airflow'], category: 'data' },
  { term: 'dbt', category: 'data' },
  { term: 'Pandas', category: 'data' },
  { term: 'NumPy', category: 'data' },
  { term: 'Prisma', category: 'data' },
  { term: 'Drizzle', category: 'data' },
  { term: 'TypeORM', category: 'data' },
  { term: 'REST APIs', aliases: ['REST', 'RESTful'], category: 'data' },
  { term: 'gRPC', category: 'data' },

  // Cloud / DevOps
  { term: 'AWS', aliases: ['Amazon Web Services'], category: 'platform' },
  { term: 'GCP', aliases: ['Google Cloud'], category: 'platform' },
  { term: 'Azure', aliases: ['Microsoft Azure'], category: 'platform' },
  { term: 'Vercel', category: 'platform' },
  { term: 'Netlify', category: 'platform' },
  { term: 'Cloudflare', category: 'platform' },
  { term: 'Heroku', category: 'platform' },
  { term: 'Docker', category: 'devops' },
  { term: 'Kubernetes', aliases: ['K8s'], category: 'devops' },
  { term: 'Terraform', category: 'devops' },
  { term: 'Ansible', category: 'devops' },
  { term: 'CI/CD', aliases: ['Continuous Integration', 'Continuous Deployment'], category: 'devops' },
  { term: 'GitHub Actions', category: 'devops' },
  { term: 'GitLab CI', category: 'devops' },
  { term: 'CircleCI', category: 'devops' },
  { term: 'Jenkins', category: 'devops' },
  { term: 'Datadog', category: 'devops' },
  { term: 'Grafana', category: 'devops' },
  { term: 'Prometheus', category: 'devops' },
  { term: 'Sentry', category: 'devops' },
  { term: 'New Relic', category: 'devops' },

  // Tools
  { term: 'Git', category: 'tool' },
  { term: 'GitHub', category: 'tool' },
  { term: 'GitLab', category: 'tool' },
  { term: 'Jira', category: 'tool' },
  { term: 'Linear', category: 'tool' },
  { term: 'Notion', category: 'tool' },
  { term: 'Slack', category: 'tool' },
  { term: 'Confluence', category: 'tool' },
  { term: 'Figma', category: 'design' },
  { term: 'Sketch', category: 'design' },
  { term: 'Framer', category: 'design' },
  { term: 'Adobe XD', category: 'design' },
  { term: 'Photoshop', category: 'design' },
  { term: 'Illustrator', category: 'design' },
  { term: 'After Effects', category: 'design' },
  { term: 'Webflow', category: 'design' },

  // Test / Quality
  { term: 'Jest', category: 'tool' },
  { term: 'Vitest', category: 'tool' },
  { term: 'Playwright', category: 'tool' },
  { term: 'Cypress', category: 'tool' },
  { term: 'Selenium', category: 'tool' },
  { term: 'Testing Library', category: 'tool' },
  { term: 'Mocha', category: 'tool' },
  { term: 'Pytest', category: 'tool' },

  // ML / AI
  { term: 'Machine Learning', aliases: ['ML'], category: 'data' },
  { term: 'Deep Learning', category: 'data' },
  { term: 'PyTorch', category: 'data' },
  { term: 'TensorFlow', category: 'data' },
  { term: 'Hugging Face', aliases: ['HuggingFace'], category: 'data' },
  { term: 'LangChain', category: 'data' },
  { term: 'OpenAI', category: 'data' },
  { term: 'LLM', aliases: ['Large Language Models'], category: 'data' },
  { term: 'RAG', aliases: ['Retrieval Augmented Generation'], category: 'data' },
  { term: 'Computer Vision', category: 'data' },
  { term: 'NLP', aliases: ['Natural Language Processing'], category: 'data' },

  // Methods
  { term: 'Agile', category: 'method' },
  { term: 'Scrum', category: 'method' },
  { term: 'Kanban', category: 'method' },
  { term: 'TDD', aliases: ['Test Driven Development'], category: 'method' },
  { term: 'Microservices', category: 'method' },
  { term: 'Event-driven', aliases: ['Event Driven'], category: 'method' },
  { term: 'OOP', aliases: ['Object Oriented Programming'], category: 'method' },
  { term: 'A/B Testing', aliases: ['A/B testing', 'Split testing'], category: 'method' },
  { term: 'OKRs', category: 'method' },
  { term: 'User Research', category: 'method' },
  { term: 'Design Systems', category: 'design' },
  { term: 'Prototyping', category: 'design' },
  { term: 'Wireframing', category: 'design' },
  { term: 'Usability Testing', category: 'method' },

  // Soft / leadership
  { term: 'Mentoring', aliases: ['Mentorship'], category: 'soft' },
  { term: 'Cross-functional collaboration', aliases: ['Cross functional', 'Cross-functional'], category: 'soft' },
  { term: 'Stakeholder management', category: 'soft' },
  { term: 'Public speaking', category: 'soft' },
  { term: 'Hiring', aliases: ['Recruiting'], category: 'soft' },
  { term: 'Coaching', category: 'soft' },
  { term: 'Roadmapping', aliases: ['Roadmap planning'], category: 'soft' },
];

// Pre-compute lookup map for fast matching.
const TERM_PATTERNS: { entry: KbEntry; patterns: RegExp[] }[] = SKILLS_KB.map((e) => {
  const all = [e.term, ...(e.aliases ?? [])];
  return {
    entry: e,
    patterns: all.map(
      (t) =>
        // \b doesn't work for terms with punctuation (.NET, C++, A/B), so use non-letter boundaries.
        new RegExp(`(?:^|[^A-Za-z0-9+#./])(${escapeRe(t)})(?=$|[^A-Za-z0-9+#./])`, 'i'),
    ),
  };
});

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findMatchedTerms(text: string): KbEntry[] {
  if (!text) return [];
  const found = new Set<string>();
  const out: KbEntry[] = [];
  for (const { entry, patterns } of TERM_PATTERNS) {
    if (found.has(entry.term)) continue;
    if (patterns.some((p) => p.test(text))) {
      found.add(entry.term);
      out.push(entry);
    }
  }
  return out;
}

// Pull resume content into a single searchable text blob.
export function flattenResumeText(data: import('./types').ResumeData): string {
  const parts: string[] = [];
  parts.push(data.profile.title, data.profile.summary);
  for (const e of data.experience) {
    parts.push(e.role, e.company, ...e.bullets);
  }
  for (const p of data.projects) {
    parts.push(p.name, p.description, ...p.tech);
  }
  for (const g of data.skills) {
    parts.push(g.category, ...g.items.map((i) => i.name));
  }
  for (const ed of data.education) {
    parts.push(ed.school, ed.degree, ed.field, ed.notes);
  }
  for (const c of data.certifications) {
    parts.push(c.name, c.issuer);
  }
  for (const a of data.awards) {
    parts.push(a.name, a.issuer, a.description);
  }
  for (const s of Object.values(data.customSections)) {
    parts.push(s.body);
  }
  return parts.filter(Boolean).join(' \n ');
}
