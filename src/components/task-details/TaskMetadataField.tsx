'use client';

import { cn } from '@/lib/utils';

interface TaskMetadataFieldProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  secondary?: boolean;
}

export const TaskMetadataField = ({
  label,
  value,
  icon,
  secondary,
}: TaskMetadataFieldProps) => {
  return (
    <>
      <div
        className={cn(
          'text-[13px] font-medium text-gray-600',
          secondary && 'opacity-75'
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          'flex items-center gap-2 text-[14px]',
          secondary && 'opacity-75'
        )}
      >
        {icon && <div className='text-gray-500'>{icon}</div>}
        <div className='text-gray-900'>{value}</div>
      </div>
    </>
  );
};
