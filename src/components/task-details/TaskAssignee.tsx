'use client';

import { AssigneeDropdown } from '@/components/AssigneeDropdown';
import { cn } from '@/lib/utils';
import { Assignee } from '@/types/task';
import { User } from 'lucide-react';
import { useState } from 'react';

interface TaskAssigneeProps {
  taskId: string;
  assignedTo: Assignee | null;
  onAssigneeChange: (user: Assignee | null) => void;
  isAdmin: boolean;
}

export const TaskAssignee = ({
  taskId,
  assignedTo,
  onAssigneeChange,
  isAdmin,
}: TaskAssigneeProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <div className='text-[13px] font-medium text-gray-600'>Assignee</div>
      <div className='relative z-50'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
              assignedTo
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 hover:bg-gray-200',
              isAdmin
                ? 'cursor-pointer hover:border-opacity-80'
                : 'cursor-not-allowed opacity-60'
            )}
            onClick={() => isAdmin && setShowDropdown(prev => !prev)}
          >
            {assignedTo ? (
              <span className='text-[10px] font-bold'>
                {assignedTo.firstName.charAt(0)}
                {assignedTo.lastName.charAt(0)}
              </span>
            ) : (
              <User className='h-4 w-4 text-gray-500' />
            )}
          </div>

          <div className='flex flex-col'>
            {assignedTo ? (
              <p className='text-[14px] text-gray-900'>
                {assignedTo.firstName} {assignedTo.lastName}
              </p>
            ) : (
              <>
                <p className='text-[14px] text-gray-900'>
                  {isAdmin ? 'Unassigned' : 'Unassigned (Admin only)'}
                </p>
                {isAdmin && (
                  <p
                    className='text-[13px] text-primary hover:underline cursor-pointer -mt-0.5'
                    onClick={() => setShowDropdown(prev => !prev)}
                  >
                    Assign to me
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {showDropdown && isAdmin && (
          <div className='absolute left-0 top-full z-50 mt-1'>
            <AssigneeDropdown
              taskId={taskId}
              currentAssignee={assignedTo}
              onClose={() => setShowDropdown(false)}
              onAssigneeChange={user => {
                onAssigneeChange(user);
                setShowDropdown(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
