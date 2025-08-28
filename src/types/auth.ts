import { APIResponse } from "./api"

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  isAdmin?: boolean
  resumeSnippet?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthData {
  user: User
  tokens: AuthTokens
}

export interface AuthResponse extends APIResponse<AuthData> {}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
}
