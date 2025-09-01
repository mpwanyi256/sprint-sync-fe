import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface BulkUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface RoleToggleResponse {
  statusCode: string;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      isAdmin: boolean;
    };
    action: string;
    updatedBy: {
      id: string;
      email: string;
    };
  };
}

interface BulkUserResponse {
  statusCode: string;
  message: string;
  data: {
    message: string;
    created: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      isAdmin: boolean;
      createdAt: string;
    }>;
    failed: Array<{
      email: string;
      error: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}

interface AdminState {
  roleToggleLoading: boolean;
  bulkUserLoading: boolean;
  error: string | null;
  lastRoleToggle: RoleToggleResponse | null;
  lastBulkUserResult: BulkUserResponse | null;
}

const initialState: AdminState = {
  roleToggleLoading: false,
  bulkUserLoading: false,
  error: null,
  lastRoleToggle: null,
  lastBulkUserResult: null,
};

export const toggleUserRole = createAsyncThunk<
  RoleToggleResponse,
  { userId: string; isAdmin: boolean }
>('admin/toggleUserRole', async ({ userId, isAdmin }) => {
  const response = await api.patch(`/admin/users/${userId}/role`, {
    isAdmin,
  });
  return response.data;
});

export const bulkCreateUsers = createAsyncThunk<
  BulkUserResponse,
  { users: BulkUserRequest[] }
>('admin/bulkCreateUsers', async ({ users }) => {
  const response = await api.post('/admin/users', {
    users,
  });
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: state => {
      state.error = null;
    },
    clearLastResults: state => {
      state.lastRoleToggle = null;
      state.lastBulkUserResult = null;
    },
  },
  extraReducers: builder => {
    builder
      // Role toggle
      .addCase(toggleUserRole.pending, state => {
        state.roleToggleLoading = true;
        state.error = null;
      })
      .addCase(toggleUserRole.fulfilled, (state, action) => {
        state.roleToggleLoading = false;
        state.lastRoleToggle = action.payload;
      })
      .addCase(toggleUserRole.rejected, (state, action) => {
        state.roleToggleLoading = false;
        state.error = action.error.message || 'Failed to toggle user role';
      })
      // Bulk user creation
      .addCase(bulkCreateUsers.pending, state => {
        state.bulkUserLoading = true;
        state.error = null;
      })
      .addCase(bulkCreateUsers.fulfilled, (state, action) => {
        state.bulkUserLoading = false;
        state.lastBulkUserResult = action.payload;
      })
      .addCase(bulkCreateUsers.rejected, (state, action) => {
        state.bulkUserLoading = false;
        state.error = action.error.message || 'Failed to create users';
      });
  },
});

export const { clearAdminError, clearLastResults } = adminSlice.actions;
export default adminSlice.reducer;
