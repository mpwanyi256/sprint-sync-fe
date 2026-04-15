import { useRef, useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Clock, User, Calendar, Save, X, Loader2 } from 'lucide-react';
import {
  cn,
  extractTaskTextContent,
  formatDate,
  normalizeTaskContentLinks,
  renderTaskContentHtml,
} from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import { apiError, apiSuccess } from '@/util/toast';
import { AssigneeDropdown } from './AssigneeDropdown';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useOptimisticTaskUpdates } from '@/hooks/useOptimisticTaskUpdates';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'BACKLOG':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'TODO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'DONE':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'BACKLOG':
      return 'Backlog';
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
};

const STATUS_OPTIONS: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];

interface TaskDetailsContentProps {
  task: Task;
  isAdmin: boolean;
  onClose: () => void;
}

const TaskDetailsContent = ({
  task,
  isAdmin,
  onClose,
}: TaskDetailsContentProps) => {
  const { moveTask, saveTask } = useOptimisticTaskUpdates();
  const [localTask, setLocalTask] = useState<Task>(() => ({ ...task }));
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleContentClick = (event: React.MouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest('a');

    if (!link) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    window.open(
      link.getAttribute('href') || '',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleInputChange = (
    field: keyof Task,
    value: string | number | null
  ) => {
    setLocalTask(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = async (status: string) => {
    const nextStatus = status as TaskStatus;

    if (nextStatus === localTask.status) {
      return;
    }

    const previousTask = localTask;
    const optimisticTask = {
      ...localTask,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    setLocalTask(optimisticTask);
    setIsUpdatingStatus(true);

    try {
      await moveTask(localTask.id, nextStatus);
      apiSuccess('Task status updated successfully');
    } catch (error) {
      console.error('Failed to update task status:', error);
      setLocalTask(previousTask);
      apiError('Failed to update task status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveTask = async () => {
    const title = normalizeTaskContentLinks(
      titleRef.current?.innerHTML || localTask.title
    );
    const description = normalizeTaskContentLinks(
      descriptionRef.current?.innerHTML || localTask.description
    );

    if (
      !extractTaskTextContent(title) ||
      !extractTaskTextContent(description)
    ) {
      apiError('Task title and description are required');
      return;
    }

    const previousTask = localTask;
    const optimisticTask = {
      ...localTask,
      title,
      description,
      updatedAt: new Date().toISOString(),
    };

    setLocalTask(optimisticTask);
    setIsSaving(true);

    try {
      const updatedTask = await saveTask(localTask.id, {
        title,
        description,
        totalMinutes: localTask.totalMinutes,
        status: localTask.status,
      });

      setLocalTask(updatedTask);
      apiSuccess('Task updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
      setLocalTask(previousTask);
      apiError('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className='flex items-start gap-3 border-b border-gray-200 px-6 py-5'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onClose}
          className='mt-1 h-8 w-8 p-0 shrink-0 hover:bg-gray-100'
        >
          <X className='h-4 w-4' />
        </Button>

        <DialogTitle
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning={true}
          onClick={handleContentClick}
          onBlur={e =>
            handleInputChange(
              'title',
              normalizeTaskContentLinks(e.currentTarget.innerHTML)
            )
          }
          className='min-h-10 flex-1 rounded-md px-2 py-1 text-2xl font-bold leading-tight text-gray-900 focus:outline-none hover:bg-gray-100'
          dangerouslySetInnerHTML={{
            __html: renderTaskContentHtml(localTask.title, {
              preserveLineBreaks: false,
            }),
          }}
        />
      </div>

      <div className='space-y-6 px-6 py-5'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div className='flex items-center space-x-3'>
            <Clock className='h-5 w-5 text-gray-500' />
            <div>
              <p className='text-sm text-gray-500'>Created</p>
              <p className='text-sm font-medium text-gray-900'>
                {formatDate(localTask.createdAt)}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <div className='w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center'>
              <div className='w-2 h-2 bg-white rounded-full'></div>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Status</p>
              <Select
                value={localTask.status}
                onValueChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className='h-auto w-auto border-0 bg-transparent p-0 shadow-none focus:ring-0'>
                  <div className='flex items-center gap-2'>
                    <Badge
                      className={cn(
                        'text-sm',
                        getStatusColor(localTask.status)
                      )}
                    >
                      {getStatusLabel(localTask.status)}
                    </Badge>
                    {isUpdatingStatus && (
                      <Loader2 className='h-4 w-4 animate-spin text-gray-500' />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <Calendar className='h-5 w-5 text-gray-500' />
            <div>
              <p className='text-sm text-gray-500'>Last Updated</p>
              <p className='text-sm font-medium text-gray-900'>
                {formatDate(localTask.updatedAt)}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3 relative'>
            <div>
              <p className='text-sm text-gray-500'>Assignee</p>
              <div className='mt-1 flex items-center space-x-2'>
                {localTask.assignedTo ? (
                  <>
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100 transition-colors',
                        isAdmin
                          ? 'cursor-pointer hover:border-blue-300'
                          : 'cursor-not-allowed opacity-60'
                      )}
                      onClick={() => {
                        if (isAdmin) {
                          setShowAssigneeDropdown(prev => !prev);
                        }
                      }}
                    >
                      <span className='text-sm font-bold text-blue-700'>
                        {localTask.assignedTo.firstName.charAt(0)}
                        {localTask.assignedTo.lastName.charAt(0)}
                      </span>
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      {localTask.assignedTo.firstName}{' '}
                      {localTask.assignedTo.lastName}
                    </span>
                  </>
                ) : (
                  <>
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100 transition-colors',
                        isAdmin
                          ? 'cursor-pointer hover:border-gray-300'
                          : 'cursor-not-allowed opacity-60'
                      )}
                      onClick={() => {
                        if (isAdmin) {
                          setShowAssigneeDropdown(prev => !prev);
                        }
                      }}
                    >
                      <User className='h-4 w-4 text-gray-400' />
                    </div>
                    <span className='text-sm text-gray-500'>
                      {isAdmin ? 'Unassigned' : 'Unassigned (Admin only)'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {showAssigneeDropdown && isAdmin && (
              <div className='absolute left-0 top-full z-50 mt-2'>
                <AssigneeDropdown
                  taskId={localTask.id}
                  currentAssignee={localTask.assignedTo}
                  onClose={() => setShowAssigneeDropdown(false)}
                  onAssigneeChange={user => {
                    setLocalTask(prev => ({
                      ...prev,
                      assignedTo: user,
                      updatedAt: new Date().toISOString(),
                    }));
                    setShowAssigneeDropdown(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className='mb-3 text-lg font-semibold text-gray-900'>
            Description
          </h4>
          <div
            ref={descriptionRef}
            contentEditable
            suppressContentEditableWarning={true}
            onClick={handleContentClick}
            onBlur={e =>
              handleInputChange(
                'description',
                normalizeTaskContentLinks(e.currentTarget.innerHTML)
              )
            }
            className='min-h-[240px] rounded-md p-2 text-gray-700 focus:outline-none hover:bg-gray-100'
            dangerouslySetInnerHTML={{
              __html: renderTaskContentHtml(localTask.description),
            }}
          />
        </div>

        <div className='flex justify-end border-t border-gray-200 pt-4'>
          <Button
            onClick={handleSaveTask}
            disabled={isSaving}
            className='bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
          >
            {isSaving ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-2 h-4 w-4' />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

const TaskDetailsModal = ({ task, isOpen, onClose }: TaskDetailsModalProps) => {
  const currentUser = useAppSelector(selectUser);
  const isAdmin = currentUser?.isAdmin || false;

  if (!task) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[92vh] overflow-y-auto p-0 sm:max-w-[900px]'>
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
