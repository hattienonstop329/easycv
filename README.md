# easycv

A local-first, no-backend resume and cover-letter builder.
Type into the editor on the left, watch it render on the right, export a PDF when you're done. Nothing leaves your browser.

Built with Next.js 16, React 19, TypeScript, Tailwind v4, Zustand. Drag-and-drop via dnd-kit. Persistence via `localStorage`.

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## What's in the box

### Editing experience
- **Split view** — fields on the left, live preview on the right. Updates are instant and refresh-safe.
- **Click-to-edit** — click any section in the preview to jump straight to its editor panel.
- **Drag to reorder** — sections, jobs, education, skills, projects, bullets — everything is sortable.
- **Undo / redo** — full history via [`zundo`](https://github.com/charkour/zundo) (`⌘Z` / `⌘⇧Z`).
- **Snapshots** — destructive operations (clear, sample-load, section-reset) auto-save a snapshot you can restore from a menu. 8-deep ring buffer.
- **Versions** — keep multiple drafts of your resume side-by-side ("designer cut", "engineering cut") and switch between them in one click.
- **Auto-save** — every keystroke lands in `localStorage`; the toolbar shows a "saved Xs ago" pill.
- **Onboarding tour** — 4 mocked screens introduce the editor on first visit. Replay any time from the `?` shortcuts overlay.

### Templates
- **12 resume templates** split across two flavours:
  - *Professional:* Onyx, Cascade, Bronzor, Enfold, Cubic, Mono, Marquee
  - *Creative / handwriting:* Notebook, Matcha, Editorial, Polaroid, Minimal Ink
- **5 cover-letter templates** that pair with the resume looks: Onyx Letter, Marquee Letter, Notebook Letter, Cascade Letter, Mono Letter.
- **Side-by-side compare** — open a modal to A/B two templates with your real data before committing.
- All templates are pure functions of the same `ResumeData` shape — your data follows you between layouts.

### Design system
- **9 color palettes** (Earth, Slate, Charcoal, Navy, Forest, Crimson, Mono, Orchid, Paper) plus per-color overrides.
- **9 fonts** across sans / serif / mono / hand families.
- **3 density presets** (Compact / Comfortable / Spacious).
- **A4 / Letter** page formats.
- **6 paper textures** (plain, cream, lined, grid, dotted, coffee).
- **Stickers** — drop hand-drawn stars, hearts, leaves, etc. anywhere on the page (creative templates).
- **Photo support** — upload a circular profile photo for templates that show one.

### Writing assistance
- **Polish panel** — scans your text for weak verbs, clichés, long bullets, leading "I", missing numbers. Each issue links back to the field.
- **Polish score** — single number rating with a colored bar.
- **Reading level** — Flesch-Kincaid grade across the whole resume corpus, with a friendly label ("easy to skim" / "reads like a college essay" / "dense — try shorter sentences").
- **Tense-mix detection** — flags jobs whose bullets mix past (`-ed`) and present (`-ing`) tenses.
- **Per-bullet ✨ polish button** — one-click rewrites: replaces weak phrases, capitalizes, removes trailing periods, rewrites leading "I X" → past-tense verb, adds an `[add a number]` placeholder if no number exists.
- **JD matcher** — paste a job description; see which keywords match your resume and which are missing. Add missing terms to your skills with one click.
- **Cover-letter from JD** — extract role + company + your top matched skills + your strongest quantified bullet → starter cover letter, ready to edit.
- **Daily writing prompt** — a fresh prompt cycles through the toolbar each day to nudge you forward.

### Resume health
- **Profile completeness score** — toolbar badge with a colored ring + percent. Click for a checklist of what's missing (no summary · 2 jobs without dates · no quantified bullets · etc).
- **Inline panel hints** — each editing panel surfaces its own "next moves" banner: missing fields + warn-level polish flags scoped to that panel.
- **Page overflow indicator** — red dashed lines + "spilling to page 2" pill when content overflows.
- **Shrink to fit** — one-click button that walks density down (spacious → comfortable → compact) until your resume fits one page.
- **Diff between versions** — pick any two saved versions; see added / removed / changed jobs, education, projects, skills with green-add / red-strikethrough styling. Bullet-level diff inside experience.

### Power-user features
- **⌘K command palette** — jump to any panel, switch templates, switch palettes, open versions, run any export, undo/redo, replay tour, all in one searchable menu.
- **Keyboard shortcuts** — `⌘K` palette · `⌘Z` undo · `⌘⇧Z` redo · `?` shortcuts overlay · click outside / `Esc` to close.
- **Persona quick-load** — five sample resumes (Designer, Engineer, Student, Founder, Career Switcher) for testing layouts.

### Export & share
- **PDF** — direct download (no print dialog), pixel-true to the preview via [`html-to-image`](https://github.com/bubkoo/html-to-image) + [`jsPDF`](https://github.com/parallax/jsPDF). Multi-page slicing.
- **PNG** — for previews / portfolio images.
- **Plain text (ATS-safe)** — bare-bones text dump for ATS systems.
- **JSON Resume** — the open [JSON Resume](https://jsonresume.org/) schema for portability.
- **easycv JSON** — full backup including customization and stickers.
- **Share link** — encode the entire resume into a URL hash (no server roundtrip) and copy to clipboard. Recipient opens it as a builder draft.
- **Import** — drop in either format and have your fields populated.

### Other
- **5 cover-letter templates** with their own editor panel (recipient, subject, salutation, body, closing, signature). Sender block can mirror the resume profile or be overridden.
- **Custom sections** — add a freeform markdown block for volunteering, publications, hobbies, references, anything.
- **Public landing page** with template gallery (all 17), feature tour, and testimonials.
- **OG images, favicons, manifest, sitemap, robots.txt** — full SEO + PWA basics wired up.
- **Mobile-friendly** — split view collapses to tabs on narrow screens; toolbar reflows.

---

## Project structure

```
src/
  app/
    layout.tsx          ─ root layout, fonts, html shell
    page.tsx            ─ landing route
    builder/            ─ split-view editor
    share/              ─ /share?d=<hash> public viewer
    templates/          ─ all-templates browse page
    opengraph-image.tsx ─ dynamic OG image
    icon.tsx, apple-icon.tsx, manifest.ts, robots.ts, sitemap.ts
  components/
    landing/            ─ landing page sections (RSC)
    builder/
      shell/            ─ Toolbar, PanelSwitcher, CommandPalette, Tour, etc.
      panels/           ─ One file per editor panel (15 total)
      controls/         ─ Field, Sortable, MonthInput, FitToPageButton, PanelHints…
      preview/          ─ PreviewPane, PreviewPaper (page-overflow-aware)
    templates/
      professional/     ─ 7 resume layouts
      handwriting/      ─ 5 creative resume layouts
      letter/           ─ 5 cover-letter layouts
  lib/
    types.ts            ─ ResumeData, Section, Customization, CoverLetter, etc.
    store.ts            ─ Zustand + persist + zundo (undo/redo)
    ui-store.ts         ─ Transient UI state (tour, focus targets, nav requests)
    toast-store.ts      ─ Toast queue with dedup
    completeness.ts     ─ scoreResume() — profile completeness
    writing-checks.ts   ─ Lint, polish, tense-mix, reading-level
    resume-diff.ts      ─ Structured diff between two ResumeData
    letter-from-jd.ts   ─ Heuristic role/company extraction → cover letter
    skills-kb.ts        ─ ~150 known skill terms for the JD matcher
    snapshots.ts        ─ Ring-buffer of restorable snapshots
    design-tokens.ts    ─ Templates registry, color themes, fonts, density
    exporters/          ─ pdf, png, text, json-resume, share
    share.ts            ─ Hash encode/decode for share URLs
    personas.ts         ─ 5 sample resumes
    prompts.ts          ─ Daily writing prompts
    markdown.tsx        ─ Tiny inline markdown renderer
```

---

## Conventions

- **No backend, no signup, no analytics.** Everything is local. `localStorage` is the source of truth.
- **Landing sections are RSC.** Anything under `src/components/landing/` is a Server Component — no `'use client'` unless it actually needs the browser.
- **Builder is fully client.** Anything under `src/components/builder/` starts with `'use client'`.
- **Templates are pure functions of `ResumeData`.** They never read from the store; they receive `data` as a prop. This keeps thumbnails, share previews, and A/B compares trivial.

---

## Scripts

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
```

---

## Privacy

Nothing leaves your browser. No accounts. No tracking. The share link encodes the resume into the URL hash (which never hits a server). If you delete your browser data, the resume is gone — export an `easycv.json` backup if you want to keep it.

---

## Contributing

PRs and issues welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, code style, and what kinds of changes are easiest to land. Templates and color palettes are particularly friendly first contributions.

## License

[MIT](./LICENSE) — do what you want, no warranty, keep the copyright notice.
