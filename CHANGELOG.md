# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-09-01

### Added

- Next.js 15 App Router baseline (strict TypeScript, React 19).
- Redux Toolkit store with slices: `auth`, `task`, `analytics`, `users`, `ui`, `ai`.
- Core UI components: `TaskCard`, `TaskListView`, `BoardView`, modals, navbar, sidebar, and primitives under `components/ui`.
- Protected routes: `/(protected)/dashboard`, `/(protected)/analytics`, `/(protected)/team`.
- Analytics dashboard (Recharts) and related async logic.
- API layer (Axios) and typed DTOs in `src/types`.
- Environment configuration via `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_KEY`.
- Jest + Testing Library setup (`next/jest`, jsdom, custom `jest.setup.js`).
- Tailwind CSS with extended theme.
- Middleware scaffold in `src/middleware.ts`.
- Pre-commit quality checks (lint, type-check, tests).

### Changed

- Migrated from Vite/React to Next.js App Router with updated structure and tooling.

### Docs

- Updated `README.md` with structure, scripts, env, testing, and branching/commit guidance.

### Chore

- ESLint (Next) and Prettier configured.
- TypeScript path alias `@/* -> src/*`.

---

## Release process

1. Bump version in `package.json` (SemVer).
2. Commit using Conventional Commits (e.g., `feat(Scope): message`, `fix(Scope): message`).
3. Tag and push:
   ```bash
   git tag v$(node -p "require('./package.json').version")
   git push origin --tags
   ```
4. Create a GitHub Release from the tag and paste highlights from this changelog.

[0.1.0]: https://github.com/your-org/sprint-sync-fe/releases/tag/v0.1.0
