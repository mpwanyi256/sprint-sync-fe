'use client';

import { Task } from '@/types/task';
import { Clock, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

const TaskCard = ({ task, onClick, className }: TaskCardProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50', 'scale-105', 'shadow-lg');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-105', 'shadow-lg');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative group',
        'hover:border-gray-300',
        className
      )}
    >
      {/* Drag Indicator */}
      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
        <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
      </div>

      {/* Task Title */}
      <h3 className='font-semibold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight'>
        {task.title}
      </h3>

      {/* Task Description */}
      <div className='mb-4'>
        <p className='text-gray-600 line-clamp-3 leading-relaxed'>
          {task.description}
        </p>
      </div>

      {/* Task Metadata */}
      <div className='space-y-3 pt-2 border-t border-gray-100'>
        <div className='flex items-center text-sm text-gray-500'>
          <Clock className='h-4 w-4 mr-2' />
          <span className='font-medium'>{task.totalMinutes} minutes</span>
        </div>

        <div className='flex items-center text-sm text-gray-500'>
          <Calendar className='h-4 w-4 mr-2' />
          <span className='font-medium'>
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Assignee Section */}
      <div className='mt-4 pt-3 border-t border-gray-100'>
        {task.assignedTo ? (
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shadow-sm'>
              <span className='text-sm font-semibold text-blue-700'>
                {getInitials(
                  task.assignedTo.firstName,
                  task.assignedTo.lastName
                )}
              </span>
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {task.assignedTo.firstName} {task.assignedTo.lastName}
            </span>
          </div>
        ) : (
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shadow-sm'>
              <User className='h-4 w-4 text-gray-400' />
            </div>
            <span className='text-sm font-medium text-gray-500'>
              Unassigned
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
