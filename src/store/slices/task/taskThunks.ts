import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CreateTaskData,
  UpdateTaskData,
  TaskStatus,
  TasksResponse,
  TaskResponse,
  TasksResponseData,
  Task,
} from '@/types/task';
import { User } from '@/types/auth';
import api from '@/services/api';
import { APIResponse } from '@/types';

export const fetchTasks = createAsyncThunk<
  TasksResponse,
  { status?: TaskStatus; page?: number; limit?: number } | void
>('tasks/fetchTasks', async (params = {}) => {
  const {
    status,
    page = 1,
    limit = 10,
  } = typeof params === 'object' ? params : {};
  const response = await api.get<APIResponse<TasksResponseData>>('/tasks', {
    params: {
      page,
      limit,
      status,
    },
  });
  return response.data;
});

export const createTask = createAsyncThunk<TaskResponse, CreateTaskData>(
  'tasks/createTask',
  async taskData => {
    const { data } = await api.post<TaskResponse>('/tasks', taskData);
    return data;
  }
);

export const updateTaskById = createAsyncThunk<
  TaskResponse,
  { id: string; data: UpdateTaskData }
>('tasks/updateTaskById', async ({ id, data }, { dispatch }) => {
  const response = await api.patch<TaskResponse>(`/tasks/${id}`, data);
  dispatch(fetchTasks({ status: data.status }));
  return response.data;
});

export const deleteTaskById = createAsyncThunk<void, string>(
  'tasks/deleteTaskById',
  async id => {
    await api.delete(`/tasks/${id}`);
  }
);

export const updateTaskStatusById = createAsyncThunk<
  void,
  { id: string; status: TaskStatus }
>('tasks/updateTaskStatusById', async ({ id, status }) => {
  await api.patch(`/tasks/${id}/status`, { status });
});

export const assignTaskToUser = createAsyncThunk<
  { user: User },
  { taskId: string; user: User }
>('tasks/assignTaskToUser', async ({ taskId, user }) => {
  await api.post(`/tasks/${taskId}/assign`, { assignedTo: user.id });
  return { user };
});

export const unAssignTask = createAsyncThunk<void, { taskId: string }>(
  'tasks/unAssignTask',
  async ({ taskId }) => {
    await api.delete(`/tasks/${taskId}/assign`);
  }
);

export const searchTasks = createAsyncThunk<
  { tasks: Task[]; count: number; searchTerm: string },
  { keyword: string }
>('tasks/searchTasks', async ({ keyword }) => {
  const response = await api.get<
    APIResponse<{ tasks: Task[]; count: number; searchTerm: string }>
  >(`/tasks/search/?keyword=${encodeURIComponent(keyword)}`);
  return response.data.data;
});
