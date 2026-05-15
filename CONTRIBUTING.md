# Contributing to easycv

Thanks for thinking about contributing. This is a small project — fixes, templates, and small features are all welcome.

## Ground rules

- **Local-first stays local-first.** No backend, no accounts, no analytics, no telemetry. The pitch is "your resume never leaves your browser." PRs that break this get closed with a friendly note.
- **No paid tiers in the OSS repo.** If a hosted version with paid features happens, it lives separately.
- **Keep the dependency footprint small.** Anything that pulls in a serious chunk of bundle weight needs justification in the PR description.

## Setup

```bash
git clone https://github.com/<owner>/easycv
cd easycv
npm install
npm run dev
```

Open `http://localhost:3000` (or whatever port Next picks if 3000 is busy).

There is no server, no database, no `.env` to fill in.

## Before you open a PR

```bash
npx tsc --noEmit   # type-check
npm run lint
npm run build      # catch any prod-only breakage
```

All three should pass. If your change touches the UI, also load it in the browser and confirm the relevant flow still works — the tests don't cover everything.

## What's easy to contribute

- **New resume templates.** Drop a new file in `src/components/templates/professional/` or `src/components/templates/handwriting/`, register it in `src/lib/design-tokens.ts` (`TEMPLATE_REGISTRY`) and `src/lib/types.ts` (`TemplateId`). Templates are pure functions of `ResumeData` — don't read from the store, just take `data` as a prop.
- **New cover-letter templates.** Same shape, under `src/components/templates/letter/`.
- **Color palettes.** Add to `COLOR_THEMES` in `src/lib/design-tokens.ts`.
- **Writing checks.** Append to `lintResume` in `src/lib/writing-checks.ts`.
- **Skills database.** Append to `src/lib/skills-kb.ts` for better JD-match coverage.
- **Bug fixes.** Always welcome.

## What's a harder lift

- AI features (we use Bring-Your-Own-Key for Anthropic; talk through any expansion before building).
- Anything that touches the persisted store shape — needs a migration in `src/lib/store.ts`'s `persist` config.
- Service worker / PWA caching — easy to break in dev.

## Code style

- TypeScript everywhere. No `any` unless you really mean it.
- Functional components. Hooks only.
- No comments explaining what the code does — let the names do the work. Use comments for the **why** (a workaround, a non-obvious constraint, an avoided footgun).
- Follow the existing file structure. New components go where their neighbours already live.

## Reporting bugs

Open an issue with: the template you were using, what you did, what happened, what you expected. Browser + OS is helpful. If you can share a redacted `easycv.json` export that reproduces the bug, even better.

## Security

If you find a security issue (e.g. a way to exfiltrate someone's local data, an XSS in a template), please email the maintainer privately instead of opening a public issue. The repo has no backend so the attack surface is small, but XSS through user-controlled markdown or imported JSON is the realistic risk.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
