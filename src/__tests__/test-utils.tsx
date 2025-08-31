import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/store/slices/auth';
import { taskReducer } from '@/store/slices/task';
import { uiReducer } from '@/store/slices/ui';
import { usersReducer } from '@/store/slices/users';
import { aiReducer } from '@/store/slices/ai';
import { RootState } from '@/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: any;
  store?: any;
}

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      task: taskReducer,
      ui: uiReducer,
      users: usersReducer,
      ai: aiReducer,
    },
    preloadedState,
  } as any);
}

// Default states for common scenarios
export const defaultAuthState = {
  user: null,
  token: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const defaultAiState = {
  generatingDescription: false,
  streamingContent: '',
  error: null,
  loading: false,
};

export const defaultTaskState = {
  loading: false,
  error: null,
  selectedTask: null,
  searchResults: [],
  searchLoading: false,
  searchTerm: '',
  columns: {
    TODO: {
      tasks: [],
      pagination: {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1,
      },
    },
    IN_PROGRESS: {
      tasks: [],
      pagination: {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1,
      },
    },
    DONE: {
      tasks: [],
      pagination: {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1,
      },
    },
  },
};

export const defaultUiState = {
  viewFormat: 'kanban' as const,
  theme: 'light' as const,
  sidebarOpen: false,
};

export const defaultUsersState = {
  users: [],
  loading: false,
  error: null,
};

// Helper to create authenticated state
export const createAuthenticatedState = (user = mockUser) => ({
  auth: {
    ...defaultAuthState,
    user,
    token: 'mock-token',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    isAuthenticated: true,
  },
  ai: defaultAiState,
  task: defaultTaskState,
  ui: defaultUiState,
  users: defaultUsersState,
});

// Helper to create unauthenticated state
export const createUnauthenticatedState = () => ({
  auth: defaultAuthState,
  ai: defaultAiState,
  task: defaultTaskState,
  ui: defaultUiState,
  users: defaultUsersState,
});

// Enhanced render function with sensible defaults
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = createUnauthenticatedState(),
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Convenience function for authenticated renders
export function renderWithAuth(
  ui: ReactElement,
  user = mockUser,
  options: ExtendedRenderOptions = {}
) {
  return renderWithProviders(ui, {
    preloadedState: createAuthenticatedState(user),
    ...options,
  });
}

// Mock user data for testing
export const mockUser = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isAdmin: false,
};

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-1',
  isAdmin: true,
  email: 'admin@example.com',
};

// Mock task data for testing
export const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO' as const,
  totalMinutes: 60,
  assignedTo: null,
  createdAt: '2023-12-25T10:30:00Z',
  updatedAt: '2023-12-25T10:30:00Z',
};

export const mockTaskWithAssignee = {
  ...mockTask,
  id: 'task-2',
  title: 'Assigned Task',
  assignedTo: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
};

// Helper to create task state with tasks
export const createTaskStateWithTasks = (
  tasks: any[],
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO'
) => ({
  ...defaultTaskState,
  columns: {
    ...defaultTaskState.columns,
    [status]: {
      ...defaultTaskState.columns[status],
      tasks,
      pagination: {
        ...defaultTaskState.columns[status].pagination,
        totalItems: tasks.length,
      },
    },
  },
});

// Mock API responses
export const mockApiResponses = {
  tasks: {
    success: {
      data: [mockTask, mockTaskWithAssignee],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    error: {
      error: 'Failed to fetch tasks',
      message: 'Network error',
    },
  },
  users: {
    success: {
      data: [mockUser, mockAdminUser],
    },
    error: {
      error: 'Failed to fetch users',
      message: 'Unauthorized',
    },
  },
};

// Helper to mock fetch responses
export const mockFetchResponse = (data: any, ok = true, status = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
};

// Helper to mock fetch error
export const mockFetchError = (error = 'Network error') => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(error));
};

// re-export everything
export * from '@testing-library/react';
export { screen, fireEvent, waitFor, act } from '@testing-library/react';

// This file is a utility file, not a test file
// It doesn't need any tests itself
