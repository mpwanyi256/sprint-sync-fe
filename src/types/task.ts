import { APIResponse } from './api'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  totalMinutes: number
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskData {
  title: string
  description: string
  totalMinutes: number
  assignedTo?: string
  status: TaskStatus
}

export interface UpdateTaskData {
  title?: string
  description?: string
  totalMinutes?: number
  assignedTo?: string
  status?: TaskStatus
}

export interface ColumnTasks {
  tasks: Task[]
  pagination: {
    currentPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export interface TaskState {
  columns: {
    TODO: ColumnTasks
    IN_PROGRESS: ColumnTasks
    DONE: ColumnTasks
  }
  loading: boolean
  error: string | null
  selectedTask: Task | null
}

export interface TasksResponseData {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TasksResponse extends APIResponse<TasksResponseData> {}

export interface TaskResponse extends APIResponse<Task> {}
