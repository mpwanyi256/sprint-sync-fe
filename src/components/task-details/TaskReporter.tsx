import { Task } from '@/types/task';
import React, { useMemo } from 'react';

interface TaskReporterProps {
  creator: Task['createdBy'];
}

export const TaskReporter: React.FC<TaskReporterProps> = ({ creator }) => {
  const { firstName, lastName } = creator;

  const getInitials = useMemo(() => {
    return `${firstName} ${lastName}`
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }, [firstName, lastName]);

  return (
    <>
      <div className='text-[13px] font-medium text-gray-600'>Reporter</div>
      <div
        id='task-reporter-section'
        className='flex items-center gap-2 text-[14px]'
      >
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#5E6C84] text-white'>
          <span className='text-[10px] font-bold'>{getInitials}</span>
        </div>
        <span className='text-gray-900'>
          {firstName} {lastName}
        </span>
      </div>
    </>
  );
};
