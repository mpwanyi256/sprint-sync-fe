'use client';

import { Task } from '@/types/task';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TaskListRowProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

const TaskListRow = ({ task, onClick, className }: TaskListRowProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';

    // Add visual feedback
    e.currentTarget.classList.add('opacity-50', 'scale-105', 'shadow-lg');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('opacity-50', 'scale-105', 'shadow-lg');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={cn(
        'grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 relative',
        isDragging && 'opacity-50 scale-105 shadow-lg',
        className
      )}
    >
      {/* Drag Indicator */}
      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
        <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
      </div>

      {/* Title */}
      <div className='col-span-1 min-w-0'>
        <h4
          className='text-sm font-medium text-gray-900 truncate'
          title={task.title}
        >
          {task.title}
        </h4>
      </div>

      {/* Description */}
      <div className='col-span-1 min-w-0'>
        <p
          className='text-sm text-gray-600 truncate'
          title={task.description || 'No description'}
        >
          {task.description || 'No description'}
        </p>
      </div>

      {/* Assignee */}
      <div className='col-span-1'>
        {task.assignedTo ? (
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center'>
              <span className='text-sm font-semibold text-blue-700'>
                {getInitials(
                  task.assignedTo.firstName,
                  task.assignedTo.lastName
                )}
              </span>
            </div>
            <span className='text-sm font-medium text-gray-700 truncate'>
              {task.assignedTo.firstName} {task.assignedTo.lastName}
            </span>
          </div>
        ) : (
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center'>
              <User className='h-4 w-4 text-gray-400' />
            </div>
            <span className='text-sm font-medium text-gray-500'>
              Unassigned
            </span>
          </div>
        )}
      </div>

      {/* Estimate */}
      <div className='col-span-1'>
        <div className='flex items-center text-sm text-gray-500'>
          <Clock className='h-4 w-4 mr-2' />
          <span>{task.totalMinutes} min</span>
        </div>
      </div>

      {/* Last Updated */}
      <div className='col-span-1'>
        <div className='text-sm text-gray-500'>
          {formatDate(task.updatedAt || task.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default TaskListRow;
