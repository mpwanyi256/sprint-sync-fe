import { RootState } from '@/store'

export const selectUiState = (state: RootState) => state.ui
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectViewFormat = (state: RootState) => state.ui.viewFormat
