'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Heart, MessageCircle, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

interface TaskCommentsProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  currentUserName?: string;
}

export const TaskComments = ({
  comments,
  onAddComment,
  onDeleteComment,
  onLikeComment,
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
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder='Add a comment...'
              className='w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
              rows={3}
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
        {comments.length === 0 ? (
          <p className='text-center text-sm text-gray-500'>No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className='flex gap-3'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100'>
                <span className='text-xs font-bold text-gray-600'>
                  {comment.author.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </span>
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {comment.author.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  {currentUserName === comment.author.name && (
                    <button
                      onClick={() => onDeleteComment?.(comment.id)}
                      className='rounded-md p-1 hover:bg-red-50'
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </button>
                  )}
                </div>
                <p className='mt-1 text-sm text-gray-700'>{comment.content}</p>
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
          ))
        )}
      </div>
    </div>
  );
};
