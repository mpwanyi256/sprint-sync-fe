import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import { Task } from '@/types/task';
import { TaskDetailsContent } from './task-details/TaskDetailsContent';
interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal = ({ task, isOpen, onClose }: TaskDetailsModalProps) => {
  const currentUser = useAppSelector(selectUser);
  const isAdmin = currentUser?.isAdmin || false;

  if (!task) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[95vh] overflow-y-auto overflow-x-visible p-0 sm:max-w-[1040px]'>
        <TaskDetailsContent
          key={`${task.id}-${task.updatedAt}`}
          task={task}
          isAdmin={isAdmin}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
