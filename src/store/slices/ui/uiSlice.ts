import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Theme } from '@/types/ui';

export type ViewFormat = 'kanban' | 'list';

interface UiState {
  sidebarOpen: boolean;
  viewFormat: ViewFormat;
}

const initialState: UiState = {
  sidebarOpen: false,
  viewFormat: 'kanban',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setViewFormat: (state, action: PayloadAction<ViewFormat>) => {
      state.viewFormat = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setViewFormat } = uiSlice.actions;
export default uiSlice.reducer;
