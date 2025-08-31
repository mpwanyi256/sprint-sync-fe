# SprintSync Frontend

A React-based frontend application for the SprintSync productivity tool, built with modern web technologies and clean architecture principles.

[Project Url](sprint-sync-fe.vercel.app)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices organized by feature
│   │   ├── auth/       # Authentication slice
│   │   │   ├── authSlice.ts
│   │   │   ├── authSelectors.ts
│   │   │   ├── authThunks.ts
│   │   │   └── index.ts
│   │   ├── task/       # Task management slice
│   │   │   ├── taskSlice.ts
│   │   │   ├── taskSelectors.ts
│   │   │   ├── taskThunks.ts
│   │   │   └── index.ts
│   │   └── ui/         # UI state slice
│   │       ├── uiSlice.ts
│   │       ├── uiSelectors.ts
│   │       └── index.ts
│   ├── hooks.ts        # Typed Redux hooks
│   └── index.ts        # Store configuration
├── services/            # API services
├── types/               # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── task.ts         # Task-related types
│   ├── ui.ts           # UI state types
│   ├── ai.ts           # AI service types
│   └── index.ts        # Type exports
├── utils/               # Utility functions
└── hooks/               # Custom React hooks
```

## Path Aliases

The project uses TypeScript path aliases for clean imports:

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/pages/*` → `src/pages/*`
- `@/store/*` → `src/store/*`
- `@/services/*` → `src/services/*`
- `@/types/*` → `src/types/*`
- `@/utils/*` → `src/utils/*`
- `@/hooks/*` → `src/hooks/*`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development

- **Redux Slices**: Each feature has its own folder with slice, selectors, and thunks
- **Type Safety**: All types are centralized in the `types/` folder
- **API Integration**: Services use Axios with interceptors for authentication
- **Component Architecture**: Small, focused components with clear separation of concerns

## Features

- User authentication (login/register)
- Task management (CRUD operations)
- Task status tracking
- AI assistance integration
- Responsive design with Tailwind CSS
- Type-safe state management
