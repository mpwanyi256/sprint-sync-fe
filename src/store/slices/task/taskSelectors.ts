import { RootState } from '@/store'
import { TaskStatus } from '@/types/task'

export const selectTasks = (state: RootState) => state.tasks.tasks
export const selectTaskLoading = (state: RootState) => state.tasks.loading
export const selectTaskError = (state: RootState) => state.tasks.error
export const selectSelectedTask = (state: RootState) => state.tasks.selectedTask

export const selectTasksByStatus = (state: RootState, status: TaskStatus) =>
  state.tasks.tasks.filter(task => task.status === status)

export const selectTasksByUser = (state: RootState, userId: string) =>
  state.tasks.tasks.filter(task => task.assignedTo === userId || task.createdBy === userId)

export const selectTotalTaskTime = (state: RootState) =>
  state.tasks.tasks.reduce((total, task) => total + task.totalMinutes, 0)

export const selectTasksByStatusCount = (state: RootState) => {
  const tasks = state.tasks.tasks
  return {
    todo: tasks.filter(task => task.status === 'TODO').length,
    inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
    done: tasks.filter(task => task.status === 'DONE').length,
  }
}
