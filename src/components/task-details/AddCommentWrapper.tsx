import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedTaskID } from '@/store/slices/selectedTask/selectedTaskSelectors';
import { createComment } from '@/store/slices/selectedTask/selectedTaskThunks';
import { apiError } from '@/util/toast';
import { useState } from 'react';

export const AddCommentWrapper = () => {
  const dispatch = useAppDispatch();
  const selectedTaskId = useAppSelector(selectSelectedTaskID);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedTaskId) return;
    try {
      //   onAddComment?.(newComment);
      setIsSubmitting(true);
      await dispatch(
        createComment({ taskId: selectedTaskId, message: newComment })
      ).unwrap();
      setNewComment('');
    } catch (error) {
      apiError(
        error instanceof Error
          ? error.message
          : 'Failed to add comment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex-1'>
        <RichTextEditor
          value={newComment}
          onChange={setNewComment}
          mode='edit'
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
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
};
