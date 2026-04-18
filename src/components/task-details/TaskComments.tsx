'use client';

import { formatDate } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import {
  selectSelectedTaskComments,
  selectSelectedTaskCommentsPagination,
  selectSelectedTaskLoading,
} from '@/store/slices/selectedTask';
import { Trash2 } from 'lucide-react';
import { AddCommentWrapper } from './AddCommentWrapper';

interface TaskCommentsProps {
  onDeleteComment?: (commentId: string) => void;
  onLoadComments?: (page: number) => void;
  currentUserName?: string;
}

export const TaskComments = ({
  onDeleteComment,
  onLoadComments,
  currentUserName,
}: TaskCommentsProps) => {
  const comments = useAppSelector(selectSelectedTaskComments);
  const commentsPagination = useAppSelector(
    selectSelectedTaskCommentsPagination
  );
  const commentsPage = commentsPagination ? commentsPagination.page : 1;
  const commentsLoading = useAppSelector(selectSelectedTaskLoading);

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold text-gray-900'>Comments</h3>
      </div>
      <AddCommentWrapper />

      {/* Comments List */}
      <div className='space-y-3 border-t border-gray-200 pt-4 h-[300px] overflow-y-auto'>
        {commentsLoading ? (
          <p className='text-center text-sm text-gray-500'>
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className='text-center text-sm text-gray-500'>No comments yet</p>
        ) : (
          comments.map(comment => {
            const authorName =
              `${comment.user?.firstName ?? ''} ${comment.user?.lastName ?? ''}`.trim() ||
              'Unknown User';

            return (
              <div key={comment.id} className='flex gap-3'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100'>
                  <span className='text-xs font-bold text-gray-600'>
                    {authorName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </span>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        {authorName}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {currentUserName === authorName && (
                      <button
                        onClick={() => onDeleteComment?.(comment.id)}
                        className='rounded-md p-1 hover:bg-red-50'
                      >
                        <Trash2 className='h-4 w-4 text-red-500' />
                      </button>
                    )}
                  </div>
                  <div
                    className='mt-1 text-sm text-gray-700 prose prose-sm max-w-none'
                    dangerouslySetInnerHTML={{ __html: comment.message }}
                  />
                  {/* <div className='mt-2 flex items-center gap-4'>
                    <button
                      onClick={() => onLikeComment?.(comment.id)}
                      className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500'
                    >
                      <Heart
                        className={`h-4 w-4 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                      />
                      {comment.likes || 0}
                    </button>
                    <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500'>
                      <MessageCircle className='h-4 w-4' />
                      Reply
                    </button>
                  </div> */}
                </div>
              </div>
            );
          })
        )}
        {commentsPagination && commentsPagination.totalPages > 1 && (
          <div className='mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-600'>
            <button
              type='button'
              disabled={commentsPage <= 1 || commentsLoading}
              onClick={() => onLoadComments?.(commentsPage - 1)}
              className='rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Previous
            </button>
            <span>
              Page {commentsPage} of {commentsPagination.totalPages}
            </span>
            <button
              type='button'
              disabled={
                commentsPage >= commentsPagination.totalPages || commentsLoading
              }
              onClick={() => onLoadComments?.(commentsPage + 1)}
              className='rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
