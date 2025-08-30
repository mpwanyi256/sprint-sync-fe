import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  User,
  Calendar,
  Save,
  X,
  Star,
  MoreHorizontal,
  History,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { updateTaskById } from '@/store/slices/task';
import { useAppDispatch } from '@/store/hooks';
import { apiError, apiSuccess } from '@/util/toast';
import { AssigneeDropdown } from './AssigneeDropdown';
import { DialogTitle } from '@radix-ui/react-dialog';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'TODO':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DONE':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
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

const TaskDetailsModal = ({ task, isOpen, onClose }: TaskDetailsModalProps) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!task || !editedTask) return null;

  const handleSaveTask = async () => {
    try {
      const updateData = {
        title: editedTask.title,
        description: editedTask.description,
        totalMinutes: editedTask.totalMinutes,
        assignedTo: editedTask.assignedTo,
        status: editedTask.status,
      };
      await dispatch(
        updateTaskById({ id: editedTask.id, data: updateData })
      ).unwrap();
      apiSuccess('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      apiError('Failed to update task');
    }
  };

  const handleInputChange = (
    field: keyof Task,
    value: string | number | any
  ) => {
    setEditedTask(prev => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[900px] max-h-[95vh] overflow-y-auto p-0'>
        {/* Header */}
        <div className='flex p-6 items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='p-2 hover:bg-gray-100'
          >
            <X className='h-5 w-5' />
          </Button>
          <DialogTitle className='text-2xl font-bold text-gray-900'>
            Task Details
          </DialogTitle>
        </div>

        <div className='p-6 space-y-6'>
          <div
            className='text-2xl font-bold text-gray-900 focus:outline-none'
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={e => handleInputChange('title', e.target.innerText)}
          >
            {editedTask.title}
          </div>
          {/* Task Metadata Grid */}
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {/* Created Time */}
            <div className='flex items-center space-x-3'>
              <Clock className='h-5 w-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Created</p>
                <p className='text-sm font-medium text-gray-900'>
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className='flex items-center space-x-3'>
              <div className='w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Status</p>
                <Badge
                  className={cn('text-sm', getStatusColor(editedTask.status))}
                >
                  {getStatusLabel(editedTask.status)}
                </Badge>
              </div>
            </div>

            {/* Due Date */}
            <div className='flex items-center space-x-3'>
              <Calendar className='h-5 w-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Last Updated</p>
                <p className='text-sm font-medium text-gray-900'>
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>

            {/* Assignees */}
            <div className='flex items-center space-x-3 relative'>
              <div>
                <p className='text-sm text-gray-500'>Assignee</p>
                <div className='flex items-center space-x-2 mt-1'>
                  {editedTask.assignedTo ? (
                    <>
                      <div
                        className='w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors'
                        onClick={() =>
                          setShowAssigneeDropdown(!showAssigneeDropdown)
                        }
                      >
                        <span className='text-sm font-bold text-blue-700'>
                          {editedTask.assignedTo.firstName.charAt(0)}
                          {editedTask.assignedTo.lastName.charAt(0)}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {editedTask.assignedTo.firstName}{' '}
                        {editedTask.assignedTo.lastName}
                      </span>
                    </>
                  ) : (
                    <>
                      <div
                        className='w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors'
                        onClick={() =>
                          setShowAssigneeDropdown(!showAssigneeDropdown)
                        }
                      >
                        <User className='h-4 w-4 text-gray-400' />
                      </div>
                      <span className='text-sm text-gray-500'>Unassigned</span>
                    </>
                  )}
                </div>
              </div>

              {/* Assignee Dropdown - Positioned relative to this section */}
              {showAssigneeDropdown && (
                <div className='absolute top-full left-0 mt-2 z-50'>
                  <AssigneeDropdown
                    taskId={editedTask.id}
                    currentAssignee={editedTask.assignedTo}
                    onClose={() => setShowAssigneeDropdown(false)}
                    onAssigneeChange={user => {
                      if (user) {
                        handleInputChange('assignedTo', user);
                      } else {
                        handleInputChange('assignedTo', null);
                      }
                      setShowAssigneeDropdown(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className='font-semibold text-gray-900 mb-3 text-lg'>
              Description
            </h4>
            <div
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={e => handleInputChange('description', e.target.innerText)}
              className='min-h-[250px] focus:outline-none p-2 resize-none border border-gray-200 rounded-md'
            >
              {editedTask.description}
            </div>
          </div>

          {/* Additional Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Status */}
            <div className='space-y-2'>
              <h4 className='font-semibold text-gray-900'>Status</h4>
              <Select
                value={editedTask.status}
                onValueChange={value => handleInputChange('status', value)}
              >
                <SelectTrigger className='bg-white border-gray-200 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-200 shadow-lg'>
                  <SelectItem value='TODO' className='hover:bg-gray-100'>
                    To Do
                  </SelectItem>
                  <SelectItem value='IN_PROGRESS' className='hover:bg-gray-100'>
                    In Progress
                  </SelectItem>
                  <SelectItem value='DONE' className='hover:bg-gray-100'>
                    Done
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Time */}
            <div className='space-y-2'>
              <h4 className='font-semibold text-gray-900'>Estimated Time</h4>
              <div className='flex items-center space-x-3'>
                <Clock className='h-5 w-5 text-gray-600' />
                <Input
                  type='number'
                  value={editedTask.totalMinutes}
                  onChange={e =>
                    handleInputChange(
                      'totalMinutes',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className='w-24 bg-white border-gray-200'
                  min='0'
                />
                <span className='text-gray-600 font-medium'>minutes</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end pt-4 border-t border-gray-200'>
            <Button
              onClick={handleSaveTask}
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white'
            >
              <Save className='h-4 w-4 mr-2' />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
