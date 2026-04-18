import { RootState } from '@/store';

export const selectSelectedTask = (state: RootState) => state.selectedTask.task;
export const selectSelectedTaskComments = (state: RootState) =>
  state.selectedTask.comments.comments;
export const selectSelectedTaskCommentsPagination = (state: RootState) =>
  state.selectedTask.comments.pagination;

export const selectIsAddingComment = (state: RootState) =>
  state.selectedTask.addingComment;
export const selectDeletingCommentIds = (state: RootState) =>
  state.selectedTask.deletingCommentIds;
export const selectSelectedTaskLoading = (state: RootState) =>
  state.selectedTask.loading;
export const selectSelectedTaskError = (state: RootState) =>
  state.selectedTask.error;
export const selectAddingCommentStatus = (state: RootState) =>
  state.selectedTask.addingComment;
export const selectSelectedTaskID = (state: RootState) =>
  state.selectedTask.task?.id || null;
