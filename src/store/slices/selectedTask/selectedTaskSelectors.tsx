import { RootState } from '@/store';

export const selectSelectedTask = (state: RootState) => state.selectedTask.task;
export const selectSelectedTaskComments = (state: RootState) =>
  state.selectedTask.comments.comments;
export const selectSelectedTaskCommentsPagination = (state: RootState) =>
  state.selectedTask.comments.pagination;
