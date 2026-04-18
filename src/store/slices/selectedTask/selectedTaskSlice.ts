import { fetchTaskById } from '@/store/slices/task/taskThunks';
import { SelectedTaskState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createComment,
  deleteComment,
  fetchTaskComments,
} from './selectedTaskThunks';

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
  addingComment: false,
  deletingCommentIds: [],
  loading: false,
  error: null,
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
        state.comments.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchTaskComments.rejected, state => {
        state.loading = false;
      })
      .addCase(fetchTaskComments.pending, state => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.comments.unshift(action.payload);
        // increase count
        state.comments.pagination.totalCount += 1;
        state.addingComment = false;
      })
      .addCase(createComment.pending, state => {
        state.addingComment = true;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.addingComment = false;
        state.error = action.error.message || 'Failed to add comment';
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.task = action.payload.data.task;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId } = action.meta.arg;
        state.comments.comments = state.comments.comments.filter(
          comment => comment.id !== commentId
        );
        // decrease count
        state.comments.pagination.totalCount -= 1;
      })
      .addCase(deleteComment.pending, (state, action) => {
        const { commentId } = action.meta.arg;
        state.deletingCommentIds.push(commentId);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        state.deletingCommentIds = state.deletingCommentIds.filter(
          id => id !== commentId
        );
        state.loading = false;
        state.error = action.error.message || 'Failed to delete comment';
      });
  },
});

export const { setSelectedTask, clearSelectedTask } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
