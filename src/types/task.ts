import { APIResponse } from './api';

export type TaskStatus =
  | 'BACKLOG'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'IN_REVIEW';

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
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskCommentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  user: TaskCommentUser;
  message: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  isLiked?: boolean;
}

export interface CommentsPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface CommentsResponseData {
  comments: TaskComment[];
  pagination: CommentsPagination;
}

export interface CommentsResponse extends APIResponse<CommentsResponseData> {}

export interface CreateTaskData {
  title: string;
  description: string;
  totalMinutes: number;
  status?: TaskStatus;
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
    BACKLOG: ColumnTasks;
    TODO: ColumnTasks;
    IN_PROGRESS: ColumnTasks;
    DONE: ColumnTasks;
    IN_REVIEW: ColumnTasks;
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

export interface TaskDetailsResponse extends APIResponse<{ task: Task }> {}

// Selected task
export interface SelectedTaskState {
  task: Task | null;
  comments: CommentsResponseData;
  addingComment: boolean;
  deletingCommentIds: string[]; // Track IDs of comments being deleted
  loading: boolean;
  error: string | null;
}

export interface GetTaskCommentsPayload {
  taskId: string;
  page: number;
  limit: number;
}

export interface CreateCommentPayload {
  taskId: string;
  message: string;
}
