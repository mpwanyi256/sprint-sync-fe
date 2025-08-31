import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/types/auth';
import { APIResponse } from '@/types/api';
import api from '@/services/api';
import { clearAuth } from './authSlice';

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/signin',
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/registerUser',
  async userData => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async () => {
    try {
      // Try to call logout endpoint, but don't fail if it doesn't exist
      await api.post('/auth/logout');
    } catch (error) {
      // Log the error but don't fail the logout process
      console.warn(
        'Logout endpoint failed, but continuing with local logout:',
        error
      );
    }
    // Always return success to ensure local logout happens
    return;
  }
);

export const fetchCurrentUser = createAsyncThunk<APIResponse<User>, void>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      dispatch(clearAuth());
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);
