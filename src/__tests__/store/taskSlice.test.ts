import { configureStore } from '@reduxjs/toolkit';
import taskReducer, {
  setSelectedTask,
  clearSearchResults,
} from '@/store/slices/task/taskSlice';
import { TaskState, Task } from '@/types/task';

describe('Task Slice', () => {
  let store: ReturnType<typeof configureStore<{ task: any }>>;

  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    totalMinutes: 60,
    totalTimeSpent: 3,
    assignedTo: null,
    createdAt: '2023-12-25T10:30:00Z',
    updatedAt: '2023-12-25T10:30:00Z',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        task: taskReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().task as TaskState;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.selectedTask).toBeNull();
      expect(state.searchResults).toEqual([]);
      expect(state.searchLoading).toBe(false);
      expect(state.searchTerm).toBe('');
      expect(state.columns.TODO.tasks).toEqual([]);
      expect(state.columns.IN_PROGRESS.tasks).toEqual([]);
      expect(state.columns.DONE.tasks).toEqual([]);
    });
  });

  describe('reducers', () => {
    it('should handle setSelectedTask', () => {
      store.dispatch(setSelectedTask(mockTask));
      const state = store.getState().task as TaskState;
      expect(state.selectedTask).toEqual(mockTask);
    });

    it('should handle clearSearchResults', () => {
      // First set some search data
      const initialState: TaskState = {
        ...(store.getState().task as TaskState),
        searchResults: [mockTask],
        searchTerm: 'test search',
      };

      store = configureStore({
        reducer: {
          task: taskReducer,
        },
        preloadedState: {
          task: initialState,
        },
      });

      store.dispatch(clearSearchResults());
      const state = store.getState().task as TaskState;
      expect(state.searchResults).toEqual([]);
      expect(state.searchTerm).toBe('');
    });
  });

  describe('column structure', () => {
    it('should have correct column structure', () => {
      const state = store.getState().task as TaskState;
      const columns = state.columns;

      expect(columns).toHaveProperty('TODO');
      expect(columns).toHaveProperty('IN_PROGRESS');
      expect(columns).toHaveProperty('DONE');

      Object.values(columns).forEach((column: any) => {
        expect(column).toHaveProperty('tasks');
        expect(column).toHaveProperty('pagination');
        expect(column.pagination).toHaveProperty('currentPage');
        expect(column.pagination).toHaveProperty('hasNextPage');
        expect(column.pagination).toHaveProperty('hasPreviousPage');
        expect(column.pagination).toHaveProperty('itemsPerPage');
        expect(column.pagination).toHaveProperty('totalItems');
        expect(column.pagination).toHaveProperty('totalPages');
      });
    });
  });
});
