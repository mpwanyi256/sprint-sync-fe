import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User, AuthResponse } from '@/types/auth'
import { APIResponse } from '@/types/api'
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from './authThunks'

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        const { data } = payload;

        if (data) {
          state.isAuthenticated = true
          state.user = data.user
          state.accessToken = data.tokens.accessToken
          state.refreshToken = data.tokens.refreshToken
          localStorage.setItem('accessToken', data.tokens.accessToken)
          localStorage.setItem('refreshToken', data.tokens.refreshToken)
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
      })

    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state, { payload }: PayloadAction<AuthResponse>) => {
        state.loading = false
        const { data } = payload;

        if (data) {
          state.isAuthenticated = true;
          state.user = data.user
          state.accessToken = data.tokens.accessToken
          state.refreshToken = data.tokens.refreshToken
          localStorage.setItem('accessToken', data.tokens.accessToken)
          localStorage.setItem('refreshToken', data.tokens.refreshToken)
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
      })

    // Logout User
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<APIResponse<User>>) => {
        state.user = action.payload.data
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
  },
})

export const { setUser, clearAuth } = authSlice.actions
export default authSlice.reducer
