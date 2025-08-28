import { RootState } from '@/store'

export const selectUI = (state: RootState) => state.ui
export const selectIsTaskModalOpen = (state: RootState) => state.ui.isTaskModalOpen
export const selectIsAIPanelOpen = (state: RootState) => state.ui.isAIPanelOpen
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectTheme = (state: RootState) => state.ui.theme
