import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UIState, Theme } from '@/types/ui'

const initialState: UIState = {
  isTaskModalOpen: false,
  isAIPanelOpen: false,
  sidebarOpen: false,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTaskModal: (state) => {
      state.isTaskModalOpen = !state.isTaskModalOpen
    },
    toggleAIPanel: (state) => {
      state.isAIPanelOpen = !state.isAIPanelOpen
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
  },
})

export const { toggleTaskModal, toggleAIPanel, toggleSidebar, setTheme } = uiSlice.actions
export default uiSlice.reducer
