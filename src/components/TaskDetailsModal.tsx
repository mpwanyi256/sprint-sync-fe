import { Dialog, DialogContent } from '@/components/ui/dialog';
import { commentsApi } from '@/services/comments';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import { selectSelectedTask } from '@/store/slices/task';
import { fetchTaskById } from '@/store/slices/task/taskThunks';
import { CommentsPagination, TaskComment } from '@/types/task';
import { apiError } from '@/util/toast';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TaskDetailsContent } from './task-details/TaskDetailsContent';

interface TaskDetailsModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal = ({
  taskId,
  isOpen,
  onClose,
}: TaskDetailsModalProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const isAdmin = currentUser?.isAdmin || false;
  const task = useAppSelector(selectSelectedTask);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [commentsPagination, setCommentsPagination] =
    useState<CommentsPagination | null>(null);
  const [commentsPage, setCommentsPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    if (taskId && isOpen) {
      const getTaskDetails = async () => {
        try {
          const [, commentsResponse] = await Promise.all([
            dispatch(fetchTaskById(taskId)).unwrap(),
            commentsApi.getComments(taskId, 1, 10),
          ]);
          setComments(commentsResponse.comments);
          setCommentsPagination(commentsResponse.pagination);
          setCommentsPage(1);
        } catch (error) {
          apiError(
            error instanceof Error
              ? error.message
              : 'Failed to fetch task details'
          );
        } finally {
          setIsLoading(false);
          setIsLoadingComments(false);
        }
      };
      getTaskDetails();
    }
  }, [taskId, isOpen, dispatch]);

  const handleLoadComments = async (page: number) => {
    if (!taskId) return;
    setIsLoadingComments(true);
    try {
      const commentsResponse = await commentsApi.getComments(taskId, page, 10);
      setComments(commentsResponse.comments);
      setCommentsPagination(commentsResponse.pagination);
      setCommentsPage(page);
    } catch (error) {
      apiError(
        error instanceof Error ? error.message : 'Failed to load comments'
      );
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async (message: string) => {
    if (!taskId || !message.trim()) return;
    try {
      const { comment } = await commentsApi.createComment(taskId, message);
      if (commentsPage !== 1) {
        await handleLoadComments(1);
        return;
      }
      setComments(prev => [comment, ...prev]);
      setCommentsPagination(prev =>
        prev ? { ...prev, totalCount: prev.totalCount + 1 } : prev
      );
    } catch (error) {
      apiError(
        error instanceof Error ? error.message : 'Failed to post comment'
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!taskId) return;
    const previousComments = comments;
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    try {
      await commentsApi.deleteComment(taskId, commentId);
      setCommentsPagination(prev =>
        prev ? { ...prev, totalCount: Math.max(prev.totalCount - 1, 0) } : prev
      );
    } catch (error) {
      setComments(previousComments);
      apiError(
        error instanceof Error ? error.message : 'Failed to delete comment'
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[95vh] overflow-y-auto overflow-x-visible p-0 sm:max-w-[1040px]'>
        <DialogTitle className='sr-only'>Task Details</DialogTitle>

        {isLoading ? (
          <div className='flex items-center justify-center min-h-[400px]'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
          </div>
        ) : !task ? (
          <div className='flex items-center justify-center min-h-[400px]'>
            <p className='text-gray-500'>Task not found</p>
          </div>
        ) : (
          <TaskDetailsContent
            key={`${taskId}-${task.updatedAt}`}
            task={task}
            isAdmin={isAdmin}
            onClose={onClose}
            comments={comments}
            commentsPagination={commentsPagination}
            commentsLoading={isLoadingComments}
            commentsPage={commentsPage}
            onLoadComments={handleLoadComments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            currentUserName={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
