export interface UIState {
  isTaskModalOpen: boolean
  isAIPanelOpen: boolean
  sidebarOpen: boolean
  theme: Theme
}

export type Theme = 'light' | 'dark'

export interface ModalState {
  isOpen: boolean
  type: 'task' | 'ai' | 'confirm'
  data?: unknown
}
