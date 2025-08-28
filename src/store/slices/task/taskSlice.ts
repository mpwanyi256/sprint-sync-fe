import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TaskState, Task } from '@/types/task'
import { fetchTasks, createTask, updateTaskById, deleteTaskById, updateTaskStatusById } from './taskThunks'

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  pagination: {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload
    },
    clearTaskError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false
        const { data } = payload;
        state.tasks = data.tasks;
        state.pagination = data.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch tasks'
      })

    // Create Task
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload.data)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task'
      })

    // Update Task
    builder
      .addCase(updateTaskById.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.data.id)
        if (index !== -1) {
          state.tasks[index] = action.payload.data
        }
      })
      .addCase(updateTaskById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task'
      })

    // Delete Task
    builder
      .addCase(deleteTaskById.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.meta.arg)
      })
      .addCase(deleteTaskById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task'
      })

    // Update Task Status
    builder
      .addCase(updateTaskStatusById.fulfilled, (state, action) => {
        const task = state.tasks.find(t => t.id === action.meta.arg.id)
        if (task) {
          task.status = action.meta.arg.status
        }
      })
      .addCase(updateTaskStatusById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task status'
      })
  },
})

export const { setSelectedTask, clearTaskError } = taskSlice.actions
export default taskSlice.reducer
