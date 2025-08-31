import { APIResponse } from './api';

export interface TimeLogSession {
  taskId: string;
  taskTitle: string;
  minutes: number;
  sessions: number;
}

export interface DailyTimeLog {
  date: string;
  userId: string;
  userName: string;
  totalMinutes: number;
  taskCount: number;
  timeLogs: TimeLogSession[];
}

export interface TimeLogMetrics {
  totalMinutes: number;
  totalUsers: number;
  totalTasks: number;
  totalSessions: number;
  averageMinutesPerUser: number;
  averageMinutesPerTask: number;
}

export interface TimeLogPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TimeLogData {
  data: DailyTimeLog[];
  metrics: TimeLogMetrics;
  pagination: TimeLogPagination;
}

export interface TimeLogResponse extends APIResponse<TimeLogData> {
  // Extends APIResponse with TimeLogData
}

export interface TimeLogFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
