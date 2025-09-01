import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { toggleUserRole, bulkCreateUsers } from '../admin/adminSlice';

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
    updateUserInState: (state, action) => {
      const { userId, updates } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },
    addUsersToState: (state, action) => {
      const newUsers = action.payload;
      state.users = [...state.users, ...newUsers];
      // Update pagination if needed
      if (state.pagination) {
        state.pagination.totalItems += newUsers.length;
      }
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
      })
      // Listen to role toggle success to update user state
      .addCase(toggleUserRole.fulfilled, (state, action) => {
        const userData = action.payload.data.user;
        const userIndex = state.users.findIndex(
          user => user.id === userData._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            isAdmin: userData.isAdmin,
          };
        }
      })
      // Listen to bulk user creation success to add users to state
      .addCase(bulkCreateUsers.fulfilled, (state, action) => {
        const newUsers = action.payload.data.created.map(user => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.createdAt,
        }));

        if (newUsers.length > 0) {
          state.users = [...state.users, ...newUsers];
          // Update pagination if needed
          if (state.pagination) {
            state.pagination.totalItems += newUsers.length;
          }
        }
      });
  },
});

export const {
  clearUsers,
  clearUsersError,
  updateUserInState,
  addUsersToState,
} = usersSlice.actions;
export default usersSlice.reducer;
