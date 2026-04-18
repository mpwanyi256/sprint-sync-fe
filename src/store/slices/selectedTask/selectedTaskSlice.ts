import { fetchTaskById } from '@/store/slices/task/taskThunks';
import { SelectedTaskState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createComment, fetchTaskComments } from './selectedTaskThunks';

const initialState: SelectedTaskState = {
  task: null,
  comments: {
    comments: [],
    pagination: {
      page: 1,
      limit: 10,
      totalCount: 1,
      totalPages: 1,
    },
  },
};

const selectedTaskSlice = createSlice({
  name: 'selectedTask',
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<SelectedTaskState>) {
      state.task = action.payload.task;
      state.comments = action.payload.comments;
    },
    clearSelectedTask(state) {
      state.task = null;
      state.comments.comments = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTaskComments.fulfilled, (state, action) => {
        state.comments.comments = action.payload.comments;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.comments.unshift(action.payload);
        // increase count
        state.comments.pagination.totalCount += 1;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.task = action.payload.data.task;
      });
  },
});

export const { setSelectedTask, clearSelectedTask } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
