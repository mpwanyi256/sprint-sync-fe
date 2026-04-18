import { CommentsResponseData } from '@/types/task';
import api from './api';

export const commentsApi = {
  getComments: async (
    taskId: string,
    page = 1,
    limit = 10
  ): Promise<CommentsResponseData> => {
    const response = await api.get<{ data: CommentsResponseData }>(
      `/tasks/${taskId}/comments`,
      { params: { page, limit } }
    );
    return response.data.data;
  },

  createComment: async (
    taskId: string,
    message: string
  ): Promise<{
    comment: {
      id: string;
      taskId: string;
      user: any;
      message: string;
      createdAt: string;
      updatedAt: string;
    };
  }> => {
    const response = await api.post(`/tasks/${taskId}/comments`, {
      message,
    });
    return response.data.data;
  },

  deleteComment: async (taskId: string, commentId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};
