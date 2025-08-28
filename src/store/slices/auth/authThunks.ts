import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'
import { APIResponse } from '@/types/api'
import api from '@/services/api'

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/loginUser',
  async (credentials) => {
    const response = await api.post<AuthResponse>('/auth/signin', credentials)
    return response.data
  }
)

export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/registerUser',
  async (userData) => {
    const response = await api.post<AuthResponse>('/auth/register', userData)
    return response.data
  }
)

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async () => {
    await api.post('/auth/logout')
  }
)

export const fetchCurrentUser = createAsyncThunk<APIResponse<any>, void>(
  'auth/fetchCurrentUser',
  async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
)
