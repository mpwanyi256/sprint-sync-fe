'use client';

import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { TaskComment } from '@/types/task';
import { Heart, MessageCircle, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface TaskCommentsProps {
  comments: TaskComment[];
  commentsLoading?: boolean;
  commentsPage?: number;
  commentsPagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  } | null;
  onAddComment?: (content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onLoadComments?: (page: number) => void;
  currentUserName?: string;
}

export const TaskComments = ({
  comments,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  commentsLoading = false,
  commentsPage = 1,
  commentsPagination,
  onLoadComments,
  currentUserName,
}: TaskCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      onAddComment?.(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold text-gray-900'>Comments</h3>
      </div>

      {/* Add Comment Section */}
      <div className='space-y-2'>
        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100'>
            <User className='h-4 w-4 text-blue-600' />
          </div>
          <div className='flex-1'>
            <RichTextEditor
              value={newComment}
              onChange={setNewComment}
              mode='edit'
              showToolbar={false}
              hideActionButtons={true}
              placeholder='Add a comment...'
              minHeight='120px'
              className='rounded-lg border border-gray-200 bg-white'
            />
            <div className='mt-2 flex justify-end gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setNewComment('')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className='bg-blue-600 text-white hover:bg-blue-700'
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className='space-y-3 border-t border-gray-200 pt-4'>
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
                  <div className='mt-2 flex items-center gap-4'>
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
                  </div>
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
