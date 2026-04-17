'use client';

import { EditableTitle } from '@/components/common/EditableTitle';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Button } from '@/components/ui/button';
import { useOptimisticTaskUpdates } from '@/hooks/useOptimisticTaskUpdates';
import { extractTaskTextContent, normalizeTaskContentLinks } from '@/lib/utils';
import { Assignee, Task, TaskStatus } from '@/types/task';
import { apiError, apiSuccess } from '@/util/toast';
import {
  Book,
  Eye,
  Link as LinkIcon,
  Maximize2,
  MoreHorizontal,
  Share2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { TaskComments } from './TaskComments';
import { TaskDetailsPanel } from './TaskDetailsPanel';

interface TaskDetailsContentProps {
  task: Task;
  isAdmin: boolean;
  onClose: () => void;
}

export const TaskDetailsContent = ({
  task,
  isAdmin,
  onClose,
}: TaskDetailsContentProps) => {
  const { moveTask, updateTitle, updateDescription } =
    useOptimisticTaskUpdates();
  const [localTask, setLocalTask] = useState<Task>(() => ({ ...task }));
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleTitleChange = (html: string) => {
    const normalized = normalizeTaskContentLinks(html);
    if (extractTaskTextContent(normalized)) {
      setLocalTask(prev => ({ ...prev, title: normalized }));
    }
  };

  const handleTitleSave = async (html: string) => {
    const normalized = normalizeTaskContentLinks(html);

    if (!extractTaskTextContent(normalized)) {
      apiError('Task title is required');
      return;
    }

    try {
      const updatedTask = await updateTitle(localTask.id, normalized);

      setLocalTask(updatedTask);
      apiSuccess('Task title updated');
    } catch (error) {
      console.error('Failed to update title:', error);
      apiError('Failed to update title');
    }
  };

  const handleDescriptionSave = async (html: string) => {
    const normalized = normalizeTaskContentLinks(html);

    if (!extractTaskTextContent(normalized)) {
      apiError('Task description is required');
      return;
    }

    try {
      const updatedTask = await updateDescription(localTask.id, normalized);

      setLocalTask(updatedTask);
      apiSuccess('Task description updated');
    } catch (error) {
      console.error('Failed to update description:', error);
      apiError('Failed to update description');
    }
  };

  const handleStatusChange = async (status: string) => {
    const nextStatus = status as TaskStatus;

    if (nextStatus === localTask.status) {
      return;
    }

    const previousTask = localTask;
    setLocalTask(prev => ({
      ...prev,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    }));
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

  const handleAssigneeChange = (user: Assignee | null) => {
    setLocalTask(prev => ({
      ...prev,
      assignedTo: user,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className='flex flex-col h-full max-h-[95vh] bg-white'>
      {/* Header matching Jira */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <button className='flex items-center gap-1 hover:underline hover:bg-gray-100 px-2 py-1 rounded transition-colors'>
            <Book className='w-4 h-4' />
            <span>Add topic</span>
          </button>
          <span>/</span>
          <button className='flex items-center gap-1 hover:underline hover:bg-gray-100 px-2 py-1 rounded transition-colors'>
            <LinkIcon className='w-4 h-4 text-green-600' />
            <span>{task.id.slice(0, 8).toUpperCase()}</span>
          </button>
        </div>

        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2 text-gray-600 gap-1'
          >
            <Eye className='w-4 h-4' />
            <span>1</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-gray-600'
          >
            <Share2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-gray-600'
          >
            <MoreHorizontal className='w-4 h-4' />
          </Button>
          <div className='w-[1px] h-4 bg-gray-200 mx-1'></div>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-gray-600'
          >
            <Maximize2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-gray-600'
            onClick={onClose}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row flex-1 overflow-hidden'>
        {/* Main Content */}
        <div className='flex-1 overflow-y-auto'>
          {/* Content */}
          <div className='space-y-6 px-6 py-4'>
            {/* Title Editor */}
            <EditableTitle
              value={localTask.title}
              onChange={handleTitleChange}
              onSave={handleTitleSave}
            />

            {/* Action Buttons Row */}
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='h-8 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100'
              >
                <LinkIcon className='w-3 h-3 mr-2' />
                Add linked issue
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-gray-600 hover:bg-gray-100'
              >
                <MoreHorizontal className='w-4 h-4' />
              </Button>
            </div>

            {/* Description Editor */}
            <div className='space-y-2 mt-4'>
              <div className='flex items-center justify-between'>
                <p className='text-[15px] font-semibold text-gray-900'>
                  Description
                </p>
              </div>
              <RichTextEditor
                value={localTask.description}
                onChange={html =>
                  setLocalTask(prev => ({ ...prev, description: html }))
                }
                onSave={handleDescriptionSave}
                showToolbar
                minHeight='150px'
                className='text-sm'
              />
            </div>

            {/* Child Issues placeholder */}
            <div className='space-y-3 pt-2'>
              <p className='text-[15px] font-semibold text-gray-900'>
                Subtasks
              </p>
              {/* placeholder space */}
            </div>

            {/* Activity Section */}
            <div className='space-y-4 pt-6'>
              <div className='flex items-center justify-between'>
                <p className='text-[15px] font-semibold text-gray-900'>
                  Activity
                </p>
              </div>

              <div className='flex items-center gap-4 text-sm font-medium border-b border-gray-200'>
                <button className='py-2 px-1 text-gray-500 hover:text-gray-900'>
                  All
                </button>
                <button className='py-2 px-1 text-blue-600 border-b-2 border-blue-600'>
                  Comments
                </button>
                <button className='py-2 px-1 text-gray-500 hover:text-gray-900'>
                  History
                </button>
                <button className='py-2 px-1 text-gray-500 hover:text-gray-900'>
                  Work log
                </button>
              </div>

              <TaskComments
                comments={[]}
                onAddComment={() => {}}
                onDeleteComment={() => {}}
                onLikeComment={() => {}}
                currentUserName='Current User'
              />
            </div>
          </div>
        </div>

        {/* Sidebar Details Panel */}
        <div className='w-full sm:w-[360px] bg-white overflow-y-auto px-6 py-6'>
          <TaskDetailsPanel
            task={localTask}
            onStatusChange={handleStatusChange}
            onAssigneeChange={handleAssigneeChange}
            isStatusUpdating={isUpdatingStatus}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
};
