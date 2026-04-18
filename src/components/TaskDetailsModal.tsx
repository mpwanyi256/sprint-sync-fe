import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import {
  createComment,
  deleteComment,
  fetchTaskComments,
  selectSelectedTaskComments,
  selectSelectedTaskCommentsPagination,
} from '@/store/slices/selectedTask';
import { selectSelectedTask } from '@/store/slices/task';
import { fetchTaskById } from '@/store/slices/task/taskThunks';
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
  const comments = useAppSelector(selectSelectedTaskComments);
  const commentsPagination = useAppSelector(
    selectSelectedTaskCommentsPagination
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    if (taskId && isOpen) {
      const getTaskDetails = async () => {
        try {
          await Promise.all([
            dispatch(fetchTaskById(taskId)).unwrap(),
            dispatch(
              fetchTaskComments({ taskId, page: 1, limit: 10 })
            ).unwrap(),
          ]);
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
      dispatch(fetchTaskComments({ taskId, page, limit: 10 })).unwrap();
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
      dispatch(createComment({ taskId, message })).unwrap();
    } catch (error) {
      apiError(
        error instanceof Error ? error.message : 'Failed to post comment'
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!taskId) return;
    try {
      dispatch(deleteComment({ taskId, commentId })).unwrap();
    } catch (error) {
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
      <DialogContent className='max-h-[95vh] overflow-y-auto overflow-hidden p-0 sm:max-w-[1040px]'>
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
          <div className='flex flex-col h-full max-h-[95vh] bg-white p-2'>
            <TaskDetailsContent
              key={`${taskId}-${task.updatedAt}`}
              task={task}
              isAdmin={isAdmin}
              onClose={onClose}
              comments={comments}
              commentsPagination={commentsPagination}
              commentsLoading={isLoadingComments}
              commentsPage={commentsPagination.page}
              onLoadComments={handleLoadComments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              currentUserName={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
