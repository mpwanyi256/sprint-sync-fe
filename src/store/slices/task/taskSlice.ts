import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState, Task, TaskStatus } from '@/types/task';
import {
  fetchTasks,
  createTask,
  updateTaskById,
  deleteTaskById,
  updateTaskStatusById,
  assignTaskToUser,
  unAssignTask,
  searchTasks,
} from './taskThunks';
import {
  findTaskInColumns,
  removeTaskFromColumn,
  addTaskToColumn,
} from '@/lib/utils';

const initialColumnState = {
  tasks: [],
  pagination: {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

const initialState: TaskState = {
  columns: {
    TODO: initialColumnState,
    IN_PROGRESS: initialColumnState,
    DONE: initialColumnState,
  },
  loading: false,
  error: null,
  selectedTask: null,
  searchResults: [],
  searchLoading: false,
  searchTerm: '',
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    clearTaskError: state => {
      state.error = null;
    },
    clearSearchResults: state => {
      state.searchResults = [];
      state.searchTerm = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        const { data } = payload;
        const params = meta.arg as
          | { status?: TaskStatus; page?: number; limit?: number }
          | undefined;
        const status = params?.status;

        if (status) {
          state.columns[status].tasks =
            data.pagination.currentPage === 1
              ? data.tasks
              : [...state.columns[status].tasks, ...data.tasks];
          state.columns[status].pagination = {
            currentPage: data.pagination.currentPage,
            hasNextPage: data.pagination.hasNextPage,
            hasPreviousPage: data.pagination.currentPage > 1,
            itemsPerPage: data.pagination.itemsPerPage,
            totalItems: data.pagination.totalItems,
            totalPages: data.pagination.totalPages,
          };
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })

      .addCase(createTask.fulfilled, (state, action) => {
        const newTask = action.payload.data;
        const status = newTask.status as TaskStatus;
        if (status && state.columns['TODO']) {
          state.columns[status].tasks.unshift(newTask);
          state.columns[status].pagination.totalItems += 1;
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task';
      })

      .addCase(updateTaskById.fulfilled, (state, action) => {
        const updatedTask = action.payload.data;
        const newStatus = updatedTask.status as TaskStatus;

        const { columnStatus, taskIndex } = findTaskInColumns(
          state.columns,
          updatedTask.id
        );

        if (columnStatus && taskIndex !== -1) {
          removeTaskFromColumn(state.columns, columnStatus, taskIndex);
        }

        if (newStatus && state.columns[newStatus]) {
          addTaskToColumn(state.columns, newStatus, updatedTask);
        }
      })
      .addCase(updateTaskById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      })

      .addCase(deleteTaskById.fulfilled, (state, action) => {
        const taskId = action.meta.arg;
        Object.keys(state.columns).forEach(columnStatus => {
          const statusKey = columnStatus as TaskStatus;
          const taskIndex = state.columns[statusKey].tasks.findIndex(
            task => task.id === taskId
          );
          if (taskIndex !== -1) {
            state.columns[statusKey].tasks.splice(taskIndex, 1);
            state.columns[statusKey].pagination.totalItems -= 1;
          }
        });
      })
      .addCase(deleteTaskById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task';
      })

      .addCase(updateTaskStatusById.fulfilled, (state, action) => {
        const { id, status } = action.meta.arg;
        const newStatus = status as TaskStatus;

        const { columnStatus, taskIndex } = findTaskInColumns(
          state.columns,
          id
        );

        if (columnStatus && taskIndex !== -1) {
          const taskToMove = state.columns[columnStatus].tasks[taskIndex];
          removeTaskFromColumn(state.columns, columnStatus, taskIndex);

          if (newStatus && state.columns[newStatus]) {
            taskToMove.status = newStatus;
            addTaskToColumn(state.columns, newStatus, taskToMove);
          }
        }
      })
      .addCase(updateTaskStatusById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task status';
      })

      .addCase(assignTaskToUser.fulfilled, (state, action) => {
        const { taskId } = action.meta.arg;
        const { user } = action.payload;

        const { columnStatus, taskIndex } = findTaskInColumns(
          state.columns,
          taskId
        );

        if (columnStatus && taskIndex !== -1) {
          state.columns[columnStatus].tasks[taskIndex].assignedTo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
        }

        if (state.selectedTask && state.selectedTask.id === taskId) {
          state.selectedTask.assignedTo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
        }
      })
      .addCase(assignTaskToUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to assign task';
      })

      .addCase(unAssignTask.fulfilled, (state, action) => {
        const { taskId } = action.meta.arg;

        const { columnStatus, taskIndex } = findTaskInColumns(
          state.columns,
          taskId
        );

        if (columnStatus && taskIndex !== -1) {
          state.columns[columnStatus].tasks[taskIndex].assignedTo = null;
        }

        if (state.selectedTask && state.selectedTask.id === taskId) {
          state.selectedTask.assignedTo = null;
        }
      })
      .addCase(unAssignTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to unassign task';
      })

      .addCase(searchTasks.pending, state => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.tasks;
        state.searchTerm = action.payload.searchTerm;
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Failed to search tasks';
        state.searchResults = [];
      });
  },
});

export const { setSelectedTask, clearTaskError, clearSearchResults } =
  taskSlice.actions;
export default taskSlice.reducer;
