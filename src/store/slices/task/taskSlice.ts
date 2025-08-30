import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TaskState, Task, TaskStatus } from '@/types/task'
import { fetchTasks, createTask, updateTaskById, deleteTaskById, updateTaskStatusById } from './taskThunks'

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
}

const initialState: TaskState = {
  columns: {
    TODO: initialColumnState,
    IN_PROGRESS: initialColumnState,
    DONE: initialColumnState,
  },
  loading: false,
  error: null,
  selectedTask: null,
}

const taskSlice = createSlice({
  name: 'task',
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
      .addCase(fetchTasks.fulfilled, (state, { payload, meta }) => {
        state.loading = false
        const { data } = payload
        const params = meta.arg as { status?: TaskStatus; page?: number; limit?: number } | undefined
        const status = params?.status
        
        if (status) {
          // Update specific column
          state.columns[status].tasks = data.pagination.currentPage === 1 ? data.tasks : [...state.columns[status].tasks, ...data.tasks]
          state.columns[status].pagination = {
            currentPage: data.pagination.currentPage,
            hasNextPage: data.pagination.hasNextPage,
            hasPreviousPage: data.pagination.currentPage > 1,
            itemsPerPage: data.pagination.itemsPerPage,
            totalItems: data.pagination.totalItems,
            totalPages: data.pagination.totalPages,
          }
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch tasks'
      })

    // Create Task
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        const newTask = action.payload.data
        console.log('newTask response', newTask)
        const status = newTask.status as TaskStatus
        if (status && state.columns['TODO']) {
          state.columns[status].tasks.unshift(newTask)
          state.columns[status].pagination.totalItems += 1
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task'
      })

    // Update Task
    builder
      .addCase(updateTaskById.fulfilled, (state, action) => {
        const updatedTask = action.payload.data
        const newStatus = updatedTask.status as TaskStatus
        
        // Find and remove the task from its current column
        let foundInColumn: TaskStatus | null = null
        
        // Search through all columns to find the task
        for (const columnStatus of Object.keys(state.columns)) {
          const statusKey = columnStatus as TaskStatus
          const column = state.columns[statusKey]
          const taskIndex = column.tasks.findIndex(task => task.id === updatedTask.id)
          
          if (taskIndex !== -1) {
            foundInColumn = statusKey
            // Remove the task from this column
            column.tasks.splice(taskIndex, 1)
            column.pagination.totalItems -= 1
            break
          }
        }
        
        // Add the updated task to the appropriate column
        if (newStatus && state.columns[newStatus]) {
          state.columns[newStatus].tasks.unshift(updatedTask)
          state.columns[newStatus].pagination.totalItems += 1
        }
      })
      .addCase(updateTaskById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task'
      })

    // Delete Task
    builder
      .addCase(deleteTaskById.fulfilled, (state, action) => {
        const taskId = action.meta.arg
        Object.keys(state.columns).forEach((columnStatus) => {
          const statusKey = columnStatus as TaskStatus
          const taskIndex = state.columns[statusKey].tasks.findIndex(task => task.id === taskId)
          if (taskIndex !== -1) {
            state.columns[statusKey].tasks.splice(taskIndex, 1)
            state.columns[statusKey].pagination.totalItems -= 1
          }
        })
      })
      .addCase(deleteTaskById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task'
      })

    // Update Task Status
    builder
      .addCase(updateTaskStatusById.fulfilled, (state, action) => {
        const { id, status } = action.meta.arg
        const newStatus = status as TaskStatus
        
        // Find and remove task from all columns
        let taskToMove: Task | undefined
        Object.keys(state.columns).forEach((columnStatus) => {
          const statusKey = columnStatus as TaskStatus
          const taskIndex = state.columns[statusKey].tasks.findIndex(task => task.id === id)
          if (taskIndex !== -1) {
            taskToMove = state.columns[statusKey].tasks[taskIndex]
            state.columns[statusKey].tasks.splice(taskIndex, 1)
            state.columns[statusKey].pagination.totalItems -= 1
          }
        })
        
        // Add to new column
        if (taskToMove && newStatus && state.columns[newStatus]) {
          taskToMove.status = newStatus
          state.columns[newStatus].tasks.unshift(taskToMove)
          state.columns[newStatus].pagination.totalItems += 1
        }
      })
      .addCase(updateTaskStatusById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task status'
      })
  },
})

export const { setSelectedTask, clearTaskError } = taskSlice.actions
export default taskSlice.reducer
