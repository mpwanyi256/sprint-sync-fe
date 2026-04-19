import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchTaskComments,
  selectSelectedTaskCommentsPagination,
  selectSelectedTaskLoading,
} from '@/store/slices/selectedTask';
import { apiError } from '@/util/toast';
import { useMemo } from 'react';
import { Button } from '../ui';

export const TaskCommentsPagination = () => {
  const dispatch = useAppDispatch();
  const commentsPagination = useAppSelector(
    selectSelectedTaskCommentsPagination
  );
  const commentsPage = commentsPagination ? commentsPagination.page : 1;
  const commentsLoading = useAppSelector(selectSelectedTaskLoading);
  const taskId = useAppSelector(state => state.selectedTask.task?.id);
  const hasMore = useMemo(
    () => commentsPage < commentsPagination.totalPages && !commentsLoading,
    [commentsPage, commentsPagination, commentsLoading]
  );

  if (!commentsPagination || commentsPagination.totalPages <= 1 || !taskId) {
    return null;
  }

  const onLoadMoreComments = async (page: number) => {
    try {
      await dispatch(fetchTaskComments({ taskId, page, limit: 10 })).unwrap();
    } catch (error) {
      apiError(
        error instanceof Error ? error.message : 'Failed to load comments'
      );
    }
  };

  if (!hasMore) {
    return (
      <div className='flex items-center justify-center'>
        <p className='p-0 m-0 text-gray-400'>🥳 You&apos;re all caught up!</p>
      </div>
    );
  }

  return (
    <div className='mt-4 flex items-center justify-center pt-4 text-sm text-gray-600'>
      <Button
        disabled={
          commentsPage >= commentsPagination.totalPages || commentsLoading
        }
        onClick={() => onLoadMoreComments(commentsPage + 1)}
        variant='ghost'
      >
        Load more
      </Button>
    </div>
  );
};
