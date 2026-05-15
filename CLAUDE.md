@AGENTS.md

# easycv — assistant guide

A local-first, no-backend resume builder built with Next.js 16 + TypeScript + Tailwind v4.
Data lives in `localStorage` via Zustand `persist`. Drag-and-drop via `@dnd-kit`.
PDF export is `window.print()` against a hidden A4-sized layout.

## Skills to invoke

When working in this repo, invoke the relevant skill via the `Skill` tool **before** writing code:

- **next-best-practices** — for any work touching `app/`, layouts, routes, RSC/Client boundaries, fonts, metadata, or data fetching.
- **vercel-react-best-practices** — when writing or refactoring React components, especially anything touching state, effects, memoization, or bundle size.
- **web-design-guidelines** — for any UI/UX or visual change before considering it done.

## Project structure

```
src/
  app/
    layout.tsx          ─ root layout, fonts, html shell
    page.tsx            ─ landing route — composes section components, no markup of its own
    builder/
      page.tsx          ─ builder route (Suspense → BuilderClient)
      BuilderClient.tsx ─ reads searchParams, mounts BuilderShell
  components/
    landing/            ─ one file per landing section, RSC by default
      Nav.tsx
      Hero.tsx
      ...
      Doodles.tsx       ─ pure SVG components, no client deps
    builder/            ─ split-view editor + drag-and-drop
    templates/          ─ five resume renderers, all driven from one data model
  lib/
    types.ts            ─ ResumeData, Section, etc.
    store.ts            ─ Zustand store with localStorage persist
    colors.ts           ─ palette constants
```

## Conventions

- **Landing sections are RSC.** No `'use client'` unless a section truly needs browser APIs (none currently do).
- **The builder is fully client.** Anything under `components/builder/` is `'use client'`.
- **Templates are pure functions of `ResumeData`** — never read from the store directly; receive `data` as a prop.
- **No new MD files** unless explicitly asked.
- **Don't add backends, signups, or analytics.** This is a local app.
