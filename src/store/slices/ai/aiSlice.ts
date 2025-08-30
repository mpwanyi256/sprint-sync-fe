import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateTaskDescription } from './aiThunks';

interface AiState {
  loading: boolean;
  error: string | null;
  generatingDescription: boolean;
  streamingContent: string;
}

const initialState: AiState = {
  loading: false,
  error: null,
  generatingDescription: false,
  streamingContent: '',
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiError: state => {
      state.error = null;
    },
    setGeneratingDescription: (state, action: PayloadAction<boolean>) => {
      state.generatingDescription = action.payload;
    },
    updateStreamingContent: (state, action: PayloadAction<string>) => {
      state.streamingContent = action.payload;
    },
    clearStreamingContent: state => {
      state.streamingContent = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateTaskDescription.pending, state => {
        state.loading = true;
        state.error = null;
        state.generatingDescription = true;
        state.streamingContent = '';
      })
      .addCase(generateTaskDescription.fulfilled, state => {
        state.loading = false;
        state.generatingDescription = false;
        // Keep the streaming content for the final result
      })
      .addCase(generateTaskDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to generate task description';
        state.generatingDescription = false;
        state.streamingContent = '';
      });
  },
});

export const {
  clearAiError,
  setGeneratingDescription,
  updateStreamingContent,
  clearStreamingContent,
} = aiSlice.actions;
export default aiSlice.reducer;
