'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  cn,
  getStatusColor,
  getStatusLabel,
  STATUS_OPTIONS,
} from '@/lib/utils';
import { TaskStatus } from '@/types/task';
import { Loader2 } from 'lucide-react';

interface TaskStatusSelectorProps {
  status: TaskStatus;
  onStatusChange: (status: string) => void;
  isLoading?: boolean;
}

export const TaskStatusSelector = ({
  status,
  onStatusChange,
  isLoading,
}: TaskStatusSelectorProps) => {
  return (
    <Select value={status} onValueChange={onStatusChange} disabled={isLoading}>
      <SelectTrigger
        className={cn(
          'h-[32px] px-3 font-medium text-[13px] border-0 outline-none w-auto focus:ring-0 rounded transition-colors',
          getStatusColor(status)
        )}
      >
        <div className='flex items-center gap-1.5'>
          <span>{getStatusLabel(status)}</span>
          {isLoading && (
            <Loader2 className='ml-1 h-3 w-3 animate-spin opacity-70' />
          )}
        </div>
      </SelectTrigger>
      <SelectContent className='bg-white'>
        {STATUS_OPTIONS.map(statusOption => (
          <SelectItem key={statusOption} value={statusOption}>
            {getStatusLabel(statusOption)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
