import api from '@/services/api';
import {
  APIResponse,
  CommentsResponseData,
  CreateCommentPayload,
  GetTaskCommentsPayload,
  TaskComment,
} from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTaskComments = createAsyncThunk<
  CommentsResponseData,
  GetTaskCommentsPayload
>(
  'selectedTask/fetchTaskComments',
  async ({ taskId, page = 1, limit = 10 }) => {
    const response = await api.get<APIResponse<CommentsResponseData>>(
      `/tasks/${taskId}/comments`,
      {
        params: { page, limit },
      }
    );
    return response.data.data;
  }
);

export const createComment = createAsyncThunk<
  TaskComment,
  CreateCommentPayload
>('selectedTask/createComment', async ({ taskId, message }) => {
  const response = await api.post<APIResponse<TaskComment>>(
    `/tasks/${taskId}/comments`,
    { message }
  );
  return response.data.data;
});

export const deleteComment = createAsyncThunk<
  void,
  { taskId: string; commentId: string }
>('selectedTask/deleteComment', async ({ taskId, commentId }) => {
  await api.delete(`/tasks/${taskId}/comments/${commentId}`);
});
