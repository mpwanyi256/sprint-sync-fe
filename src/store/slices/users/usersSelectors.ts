import { RootState } from '@/store'

export const selectUsersState = (state: RootState) => state.users
export const selectUsers = (state: RootState) => state.users.users
export const selectUsersPagination = (state: RootState) => state.users.pagination
export const selectUsersLoading = (state: RootState) => state.users.loading
export const selectUsersError = (state: RootState) => state.users.error
