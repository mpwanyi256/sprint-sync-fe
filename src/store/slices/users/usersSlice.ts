import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsersResponse {
  users: User[];
  pagination: UsersPagination;
}

interface UsersState {
  users: User[];
  pagination: UsersPagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<
  UsersResponse,
  { page: number; limit: number; search?: string }
>('users/fetchUsers', async ({ page, limit, search = '' }) => {
  const searchParam = search.trim()
    ? `&search=${encodeURIComponent(search)}`
    : '';
  const response = await api.get(
    `/users/?page=${page}&limit=${limit}${searchParam}`
  );
  return response.data.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: state => {
      state.users = [];
      state.pagination = null;
    },
    clearUsersError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // If it's the first page or a search, replace users
        // If it's a subsequent page, append users
        if (action.meta.arg.page === 1) {
          state.users = action.payload.users;
        } else {
          state.users = [...state.users, ...action.payload.users];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { clearUsers, clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
