import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User, AuthResponse } from '@/types/auth'
import { APIResponse } from '@/types/api'
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from './authThunks'

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
    }
  }
  
  // Don't automatically authenticate based on localStorage tokens
  // Let the AuthProvider handle validation
  return {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false, // Start as false, let validation determine true state
    loading: false,
  }
}

const initialState: AuthState = getInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
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
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.tokens.accessToken)
            localStorage.setItem('refreshToken', data.tokens.refreshToken)
          }
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
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
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.tokens.accessToken)
            localStorage.setItem('refreshToken', data.tokens.refreshToken)
          }
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      })

    // Logout User
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      })

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<APIResponse<User>>) => {
        state.user = action.payload.data
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      })
  },
})

export const { setUser, clearAuth, setAuthenticated } = authSlice.actions
export default authSlice.reducer
