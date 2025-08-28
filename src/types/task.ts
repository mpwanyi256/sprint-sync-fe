import { APIResponse, Pagination } from './api'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  totalMinutes: number
  createdBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface CreateTaskData {
  title: string
  description: string
  totalMinutes: number
  assignedTo?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  totalMinutes?: number
  assignedTo?: string
}

export interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  selectedTask: Task | null
  pagination: Pagination
}

export interface TasksResponseData {
  pagination: Pagination,
  tasks: Task[]
}

export interface TasksResponse extends APIResponse<TasksResponseData> {}
export interface TaskResponse extends APIResponse<Task> {}
