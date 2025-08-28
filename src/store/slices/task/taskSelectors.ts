import { RootState } from '@/store'
import { TaskStatus } from '@/types/task'

export const selectTasks = (state: RootState) => {
  const allTasks: any[] = []
  Object.values(state.tasks.columns).forEach(column => {
    allTasks.push(...column.tasks)
  })
  return allTasks
}

export const selectTaskLoading = (state: RootState) => state.tasks.loading
export const selectTaskError = (state: RootState) => state.tasks.error
export const selectSelectedTask = (state: RootState) => state.tasks.selectedTask

export const selectTasksByStatus = (state: RootState, status: TaskStatus) =>
  state.tasks.columns[status]?.tasks || []

export const selectColumnPagination = (state: RootState, status: TaskStatus) =>
  state.tasks.columns[status]?.pagination || {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  }

export const selectTasksByUser = (state: RootState, userId: string) => {
  const allTasks = selectTasks(state)
  return allTasks.filter(task => task.assignedTo === userId)
}

export const selectTotalTaskTime = (state: RootState) => {
  const allTasks = selectTasks(state)
  return allTasks.reduce((total, task) => total + task.totalMinutes, 0)
}

export const selectTasksByStatusCount = (state: RootState) => {
  return {
    todo: state.tasks.columns.TODO?.tasks.length || 0,
    inProgress: state.tasks.columns.IN_PROGRESS?.tasks.length || 0,
    done: state.tasks.columns.DONE?.tasks.length || 0,
  }
}
