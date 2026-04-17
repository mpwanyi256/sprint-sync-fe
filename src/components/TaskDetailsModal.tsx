import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (taskId && isOpen) {
      const getTaskDetails = async () => {
        try {
          await dispatch(fetchTaskById(taskId)).unwrap();
        } catch (error) {
          apiError(
            error instanceof Error
              ? error.message
              : 'Failed to fetch task details'
          );
        } finally {
          setIsLoading(false);
        }
      };
      getTaskDetails();
    }
  }, [taskId, isOpen, dispatch]);

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
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
