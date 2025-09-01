# SprintSync Frontend

Next.js-based frontend for the SprintSync productivity tool using the App Router, TypeScript, Redux Toolkit, and Tailwind CSS.

FrontEnd
- [Project URL](https://sprint-sync-fe.vercel.app)

Backend
- [API Production URL](https://sprint-sync-be.onrender.com/api)
- [API Documentation](https://sprint-sync-be.onrender.com/api-docs)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **UI**: React 19, Tailwind CSS
- **State Management**: Redux Toolkit (+ Redux Persist)
- **HTTP Client**: Axios
- **Testing**: Jest, Testing Library
- **Linting/Formatting**: ESLint (Next config), Prettier

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (protected)/
│   │   ├── dashboard/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── team/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/               # Reusable UI & feature components
│   ├── ui/                   # Primitive UI components
│   └── ...
├── store/                    # Redux store
│   ├── index.ts              # Configure store
│   └── slices/
│       ├── auth/
│       ├── task/
│       ├── analytics/
│       ├── users/
│       ├── ui/
│       └── ai/
├── services/                 # API services (Axios)
├── types/                    # Centralized TypeScript types
├── lib/                      # Utilities shared across app
├── util/                     # Helper functions
├── __tests__/                # Unit/Component tests
└── middleware.ts             # Next.js middleware (auth hooks, etc.)
```

## Path Aliases

- **`@/*`** → `src/*` (see `tsconfig.json`)

## Environment Variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_KEY=your_api_key
```

## Scripts

- **Dev**: `npm run dev` (Turbopack)
- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint` | `npm run lint:fix`
- **Types**: `npm run type-check`
- **Format**: `npm run format` | `npm run format:check`
- **Test**: `npm test` | `npm run test:watch` | `npm run test:coverage` | `npm run test:ci`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env.local # if provided, otherwise create as above
   ```
3. Run the app in development:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start production server:
   ```bash
   npm start
   ```

## Linting & Formatting

- ESLint (Next.js): `npm run lint` / `npm run lint:fix`
- Prettier: `npm run format` / `npm run format:check`

## Testing

- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`

Jest is configured via `jest.config.js` with `jest.setup.js` (jsdom, Next router mocks, DOM APIs). Test files live under `src/__tests__/`.

## Branching & Commits (Pre-commit Hooks)

- Create a branch:
  ```bash
  git checkout -b feature/short-description   # or fix/..., chore/...
  ```
- Make changes, then commit:
  ```bash
  git add -A
  git commit -m "feat(Auth): A concise message"
  ```
- A pre-commit hook runs quality checks (lint, type-check, tests). If any fail, the commit is blocked. Fix issues and commit again.
- Push and open a PR:
  ```bash
  git push -u origin feature/short-description
  ```
- Tip: run locally before committing:
  ```bash
  npm run lint && npm run type-check && npm test
  ```

## Development Notes

- Types live in `src/types` and strict mode is enabled.
- API access is via Axios in `src/services`.
- UI is built with small, reusable components under `src/components`.
