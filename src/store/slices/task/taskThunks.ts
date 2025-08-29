import { createAsyncThunk } from '@reduxjs/toolkit'
import { CreateTaskData, UpdateTaskData, TaskStatus, TasksResponse, TaskResponse, TasksResponseData, Task } from '@/types/task'
import api from '@/services/api'
import { APIResponse } from '@/types';

export const fetchTasks = createAsyncThunk<TasksResponse, { status?: TaskStatus; page?: number; limit?: number } | void>(
  'tasks/fetchTasks',
  async (params = {}) => {
    const { status, page = 1, limit = 10 } = typeof params === 'object' ? params : {}
    const response = await api.get<APIResponse<TasksResponseData>>('/tasks', {
      params: {
        page,
        limit,
        status,
      },
    })
    return response.data
  }
)

export const createTask = createAsyncThunk<TaskResponse, CreateTaskData>(
  'tasks/createTask',
  async (taskData) => {
    const { data } = await api.post<TaskResponse>('/tasks', taskData)
    console.log('createTask response', data)
    return data
  }
) 

export const updateTaskById = createAsyncThunk<TaskResponse, { id: string; data: UpdateTaskData }>(
  'tasks/updateTaskById',
  async ({ id, data }, { dispatch }) => {
    const response = await api.patch<TaskResponse>(`/tasks/${id}`, data)

    dispatch(fetchTasks({ status: data.status }))
    return response.data
  }
)

export const deleteTaskById = createAsyncThunk<void, string>(
  'tasks/deleteTaskById',
  async (id) => {
    await api.delete(`/tasks/${id}`)
  }
)

export const updateTaskStatusById = createAsyncThunk<void, { id: string; status: TaskStatus }>(
  'tasks/updateTaskStatusById',
  async ({ id, status }) => {
    await api.patch(`/tasks/${id}/status`, { status })
  }
)

export const assignTaskToUser = createAsyncThunk<void, { taskId: string; assignedTo: string }>(
  'tasks/assignTaskToUser',
  async ({ taskId, assignedTo }) => {
    await api.patch(`/tasks/${taskId}/assign`, { assignedTo })
  }
)
