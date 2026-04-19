'use client';

import { useAppSelector } from '@/store/hooks';
import {
  selectSelectedTaskComments,
  selectSelectedTaskLoading,
} from '@/store/slices/selectedTask';
import { AddCommentWrapper } from './AddCommentWrapper';
import { TaskCommentsPagination } from './TaskCommentsPagination';
import { TaskCommentsWrapper } from './TaskCommentsWrapper';

export const TaskComments = () => {
  const comments = useAppSelector(selectSelectedTaskComments);
  const commentsLoading = useAppSelector(selectSelectedTaskLoading);

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold text-gray-900'>Comments</h3>
      </div>
      <AddCommentWrapper />

      {/* Comments List */}
      <div className='space-y-3 h-[240px] overflow-y-auto'>
        {commentsLoading && comments.length === 0 ? (
          <p className='text-center text-sm text-gray-500'>
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className='text-center text-sm text-gray-500'>No comments yet</p>
        ) : (
          <TaskCommentsWrapper />
        )}
        <TaskCommentsPagination />
      </div>
    </div>
  );
};
