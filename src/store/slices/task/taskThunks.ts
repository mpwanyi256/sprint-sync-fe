import { createAsyncThunk } from '@reduxjs/toolkit'
import { CreateTaskData, UpdateTaskData, TaskStatus, TasksResponse, TaskResponse } from '@/types/task'
import api from '@/services/api'

export const fetchTasks = createAsyncThunk<TasksResponse, { status?: TaskStatus; page?: number; limit?: number } | void>(
  'tasks/fetchTasks',
  async (params = {}) => {
    const { status, page = 1, limit = 10 } = typeof params === 'object' ? params : {}
    
    const response = await api.get<TasksResponse>('/tasks', {
      params: {
        page,
        limit,
        ...(status && { status }),
      },
    })
    return response.data
  }
)

export const createTask = createAsyncThunk<TaskResponse, CreateTaskData>(
  'tasks/createTask',
  async (taskData) => {
    const response = await api.post<TaskResponse>('/tasks', taskData)
    return response.data
  }
)

export const updateTaskById = createAsyncThunk<TaskResponse, { id: string; data: UpdateTaskData }>(
  'tasks/updateTaskById',
  async ({ id, data }) => {
    const response = await api.patch<TaskResponse>(`/tasks/${id}`, data)
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
