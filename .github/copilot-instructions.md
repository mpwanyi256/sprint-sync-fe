# AI Coding Agent Instructions: SprintSync Frontend

This document guides AI agents in contributing to the SprintSync frontend codebase. It captures essential architectural decisions, patterns, and workflows.

## Architecture Overview

**SprintSync** is a Next.js 15 App Router frontend for an agile task management and time tracking system. The stack uses **Redux Toolkit** for state management, **Axios** for API communication, **Tailwind CSS** for styling, and **TypeScript** (strict mode) throughout.

### Core Data Flow

1. **API Layer** (`src/services/api.ts`): Axios instance with automatic Bearer token attachment and 401 handling
2. **Redux Slices** (`src/store/slices/`): Async thunks fetch data, reducers update typed state
3. **Components** (`src/components/`): Mostly client components using `useAppDispatch` and `useAppSelector` hooks
4. **UI Layer**: Headless UI (Radix) primitives in `src/components/ui/` composed into feature components

### Critical Architectural Decisions

- **SSR Compatibility**: Store is created with `makeStore()` factory; Redux persistence only applied on client (`typeof window !== 'undefined'`)
- **Auth Persistence**: Only `auth` slice is persisted; all other state derives from API
- **Optimistic Updates**: `useOptimisticTaskUpdates` hook provides snapshot/restore pattern for drag-drop UI interactions
- **Streaming AI**: AI suggestions use `fetch()` + custom `streamHandler` (not Axios) for streaming responses

## Project Structure & Key Files

```
src/
├── app/[locale]/(protected)/{dashboard,analytics,team}/  # Protected routes
├── store/
│   ├── slices/
│   │   ├── auth/         # Login, user state, token management
│   │   ├── task/         # Task CRUD, columns (BACKLOG→TODO→IN_PROGRESS→IN_REVIEW→DONE)
│   │   ├── ui/           # Sidebar, view format toggle (kanban/list)
│   │   ├── ai/           # Task description generation with streaming
│   │   ├── analytics/    # Time logs, metrics
│   │   ├── users/        # User list with pagination
│   │   └── admin/        # Role toggles, bulk user creation
│   ├── hooks.ts          # useAppDispatch, useAppSelector typed wrappers
│   └── index.ts          # makeStore factory with SSR/client branching
├── components/
│   ├── Dashboard.tsx     # Main task board (kanban/list views)
│   ├── TaskColumn.tsx    # Kanban column with drag-drop
│   ├── TaskCard.tsx      # Individual task display
│   ├── Navbar.tsx        # Search, view toggle, auth menu
│   ├── ui/               # Primitive UI (button, input, dialog, select, etc.)
│   └── ...feature components
├── services/api.ts       # Axios configuration & interceptors
├── types/                # Centralized DTO definitions (task, auth, analytics, etc.)
├── lib/utils.ts          # Task search/navigation helpers, cn() for Tailwind merging
└── hooks/useOptimisticTaskUpdates.ts  # Snapshot pattern for optimistic drag-drop
```

## Redux Patterns & Conventions

### Creating Async Thunks

Use `createAsyncThunk` for API calls. Always provide generic types `<SuccessPayload, InputParams, ThunkAPI>`:

```typescript
// src/store/slices/task/taskThunks.ts
export const updateTaskById = createAsyncThunk<
  TaskResponse,                          // Return type
  { id: string; data: UpdateTaskData }   // Input params
>('tasks/updateTaskById', async ({ id, data }) => {
  const response = await api.patch<TaskResponse>(`/tasks/${id}`, data);
  return response.data;
});
```

### Reducers vs Extra Reducers

- **Reducers**: Synchronous state mutations (e.g., `setViewFormat`, `clearSearchResults`)
- **Extra Reducers**: Handle pending/fulfilled/rejected async thunk states

```typescript
extraReducers: builder => {
  builder
    .addCase(fetchTasks.pending, state => {
      state.loading = true;
    })
    .addCase(fetchTasks.fulfilled, (state, { payload }) => {
      // Merge/replace column tasks
      state.columns[status].tasks = payload.tasks;
      state.columns[status].pagination = payload.pagination;
    });
}
```

### Selector Patterns

Create selector files (e.g., `taskSelectors.ts`) for derived state:

```typescript
export const selectSearchResults = (state: RootState) => state.task.searchResults;
export const selectSearchLoading = (state: RootState) => state.task.searchLoading;
```

## Client Components & Hooks

### Use Client Boundary

All interactive components must have `'use client'` directive. **Layouts are always server components**.

```typescript
'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
```

### useAppDispatch & useAppSelector

Always use typed wrappers from `src/store/hooks.ts`:

```typescript
const dispatch = useAppDispatch();
const tasks = useAppSelector(selectTasksByStatus('TODO'));
```

### Optimistic Task Updates Pattern

For drag-drop or immediate UI feedback, use the snapshot/restore pattern:

```typescript
const { moveTask, restoreTask, getTaskSnapshot } = useOptimisticTaskUpdates();
const snapshot = getTaskSnapshot(taskId);
try {
  await moveTask(taskId, newStatus);
} catch (error) {
  restoreTask(snapshot);  // Revert if API fails
}
```

## API & Error Handling

### Request Interceptor

The Axios instance (`api.ts`) automatically:
- Adds `Authorization: Bearer <token>` from `localStorage`
- Includes `x-api-key` header

### Response Interceptor

- **401 responses**: Clear tokens and redirect to `/`
- **Non-success statusCode**: Throw error (API returns `{ statusCode, message, data }`)

### Making API Calls

Prefer async thunks over direct API calls in components. If direct calls are needed:

```typescript
import api from '@/services/api';
const response = await api.get('/tasks', { params: { status: 'TODO' } });
```

## Testing Patterns

### Setup

Tests use `jest` + `@testing-library/react`. Custom `renderWithStore()` helper in `src/__tests__/test-utils.tsx` wraps components with Redux provider.

```typescript
import { renderWithStore, setupStore } from '@/__tests__/test-utils';

it('should display task', () => {
  const store = setupStore({ task: { selectedTask: mockTask } });
  const { getByText } = renderWithStore(<TaskCard task={mockTask} />, { store });
  expect(getByText(mockTask.title)).toBeInTheDocument();
});
```

### Coverage Thresholds

Global minimums: 25% lines, 25% statements, 6% branches, 11% functions. See `jest.config.js`.

## Development Workflows

### Running Commands

```bash
npm run dev          # Dev server with Turbopack (--port 3001)
npm run build        # Build for production
npm run lint         # ESLint with max 100 warnings
npm run lint:fix     # Auto-fix linting
npm run type-check   # TypeScript strict check
npm run test         # Jest tests
npm test:coverage    # Coverage report
```

### Pre-commit Hooks

Husky automatically runs on commit:
1. ESLint (`npm run lint`)
2. TypeScript check (`npm run type-check`)
3. Jest tests
4. Build verification

If tests fail, commit is blocked. Fix issues and retry.

### Environment Variables

Create `.env.local` in project root (see `env.example`):

```env
NEXT_PUBLIC_API_URL=https://sprint-sync-be.onrender.com
NEXT_PUBLIC_API_KEY=your_key
```

## Type Safety & Conventions

### DTOs Are Centralized

Never define API response types inline. Use `src/types/`:

- `task.ts`: Task, TaskStatus, CreateTaskData, UpdateTaskData, ColumnTasks
- `auth.ts`: User, LoginCredentials, RegisterData, AuthResponse
- `analytics.ts`: TimeLogMetrics, DailyTimeLog
- `api.ts`: APIResponse<T> wrapper

```typescript
// ✓ Good
import { Task, TaskStatus } from '@/types/task';

// ✗ Avoid
interface Task { id: string; ... }
```

### Task Columns State Structure

Task state organizes tasks by column status. Always use the pattern:

```typescript
state.columns: {
  BACKLOG: ColumnTasks,
  TODO: ColumnTasks,
  IN_PROGRESS: ColumnTasks,
  IN_REVIEW: ColumnTasks,
  DONE: ColumnTasks
}
```

Use helper: `findTaskInColumns(columns, taskId)` to locate a task.

## Streaming & Long-Running Operations

### AI Task Description Streaming

The `generateTaskDescription` thunk in `aiThunks.ts` uses `fetch()` + custom `streamHandler` to handle streaming responses:

```typescript
// Uses fetch for streaming, not Axios
const response = await fetch(apiUrl, {
  headers: { Authorization: ... },
  body: JSON.stringify({ title, description })
});

// Custom handler parses Server-Sent Events
const finalContent = await streamHandler.handleClientStream(response, {
  onChunk: chunk => dispatch(updateStreamingContent(chunk.content)),
});
```

Dispatch streaming updates to `ai/updateStreamingContent` for real-time UI feedback.

## Common Pitfalls to Avoid

1. **Window Access**: Always guard with `typeof window !== 'undefined'` before accessing `localStorage` or `location`
2. **Missing 'use client'**: Components using hooks must have `'use client'` at the top
3. **Type Mismatch**: Ensure task reducer handles TaskStatus enum correctly (TypeScript strict mode catches this)
4. **Non-serializable State**: Redux persistence ignores actions listed in `serializableCheck.ignoredActions`
5. **Direct localStorage**: Use Redux for state; only read tokens from `localStorage` during boot (auth thunks handle this)
6. **API Base URL**: Always use `api` service, not constructing URLs manually

## When to Add New Features

1. **New API entity**: Create slice in `src/store/slices/`, add thunks for CRUD, add types in `src/types/`
2. **New UI component**: Create in `src/components/`, add `'use client'`, use Redux hooks for state
3. **New API endpoint**: Update `src/services/api.ts` or create `analytics.ts` pattern if separate concern
4. **New page/route**: Create in `src/app/[locale]/(protected)/yourfeature/page.tsx`

---

**For questions about patterns not covered here, inspect similar features in the codebase. This project values consistency and explicit patterns over flexibility.**
