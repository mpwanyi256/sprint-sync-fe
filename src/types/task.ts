import { APIResponse } from './api';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Assignee {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  totalMinutes: number;
  totalTimeSpent: number;
  assignedTo: Assignee | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  totalMinutes: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  totalMinutes?: number;
  assignedTo?: Assignee | null;
  status?: TaskStatus;
}

export interface ColumnTasks {
  tasks: Task[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface TaskState {
  columns: {
    TODO: ColumnTasks;
    IN_PROGRESS: ColumnTasks;
    DONE: ColumnTasks;
  };
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  searchResults: Task[];
  searchLoading: boolean;
  searchTerm: string;
}

export interface TasksResponseData {
  tasks: Task[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface TasksResponse extends APIResponse<TasksResponseData> {
  // Extends APIResponse with TasksResponseData
}

export interface TaskResponse extends APIResponse<Task> {
  // Extends APIResponse with Task
}
