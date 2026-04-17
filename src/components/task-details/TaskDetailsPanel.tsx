'use client';

import { formatDate } from '@/lib/utils';
import { Assignee, Task } from '@/types/task';
import { ChevronDown, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskAssignee } from './TaskAssignee';
import { TaskMetadataField } from './TaskMetadataField';
import { TaskStatusSelector } from './TaskStatusSelector';

interface TaskDetailsPanelProps {
  task: Task;
  onStatusChange: (status: string) => Promise<void>;
  onAssigneeChange: (assignee: Assignee | null) => void;
  isStatusUpdating: boolean;
  isAdmin: boolean;
}

export const TaskDetailsPanel = ({
  task,
  onStatusChange,
  onAssigneeChange,
  isStatusUpdating,
  isAdmin,
}: TaskDetailsPanelProps) => {
  return (
    <div className='w-full space-y-4'>
      {/* Action Buttons Top Bar */}
      <div className='flex items-center gap-2 mb-4'>
        <TaskStatusSelector
          status={task.status}
          onStatusChange={onStatusChange}
          isLoading={isStatusUpdating}
        />
        <Button
          variant='outline'
          size='sm'
          className='px-2.5 h-[32px] border-gray-200 bg-gray-50 hover:bg-gray-100/80'
        >
          <Zap className='h-4 w-4 text-gray-500' />
        </Button>
      </div>

      {/* Details Box */}
      <div className='border border-gray-200 rounded-md bg-white'>
        <div className='flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer'>
          <div className='flex items-center gap-2'>
            <ChevronDown className='w-4 h-4 text-gray-500' />
            <span className='font-semibold text-gray-900 text-[14px]'>
              Details
            </span>
          </div>
          <Settings className='w-4 h-4 text-gray-500' />
        </div>

        <div className='p-4'>
          <div className='grid grid-cols-[130px_1fr] items-start gap-y-3'>
            <TaskAssignee
              taskId={task.id}
              assignedTo={task.assignedTo}
              onAssigneeChange={onAssigneeChange}
              isAdmin={isAdmin}
            />

            <TaskMetadataField label='Priority' value='None' />
            <TaskMetadataField label='Parent' value='None' />
            <TaskMetadataField label='Due Date' value='None' />
            <TaskMetadataField label='Labels' value='None' />
            <TaskMetadataField label='Team' value='None' />
            <TaskMetadataField label='Start date' value='None' />
            <TaskMetadataField
              label='Sprint'
              value={
                <span className='text-primary hover:underline cursor-pointer'>
                  SCRUM Sprint 0
                </span>
              }
            />
            <TaskMetadataField label='Story point estimate' value='None' />

            {/* Reporter uses TaskAssignee format roughly, or just text */}
            <div className='text-[13px] font-medium text-gray-600'>
              Reporter
            </div>
            <div className='flex items-center gap-2 text-[14px]'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#5E6C84] text-white'>
                <span className='text-[10px] font-bold'>SM</span>
              </div>
              <span className='text-gray-900'>Samuel Mpwanyi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Development and Automation Sections */}
      <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer'>
        <div className='flex items-center gap-2'>
          <ChevronDown className='w-4 h-4 text-gray-500 -rotate-90' />
          <span className='font-semibold text-gray-900 text-[14px]'>
            Development
          </span>
        </div>
      </div>

      <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer'>
        <div className='flex items-center gap-2'>
          <ChevronDown className='w-4 h-4 text-gray-500 -rotate-90' />
          <span className='font-semibold text-gray-900 text-[14px]'>
            Automation
          </span>
        </div>
      </div>

      {/* Timestamps */}
      <div className='pt-2 space-y-1 text-xs text-gray-500'>
        <p>Created {formatDate(task.createdAt)}</p>
        <p>Updated {formatDate(task.updatedAt)}</p>
      </div>
    </div>
  );
};
