'use client';

import { useAppSelector } from '@/store/hooks';
import {
  selectTasksByStatus,
  selectColumnPagination,
} from '@/store/slices/task/taskSelectors';
import TaskListRow from './TaskListRow';
import { Loader2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { fetchTasks } from '@/store/slices/task';
import { useAppDispatch } from '@/store/hooks';
import { TaskStatus } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { useOptimisticTaskUpdates } from '@/hooks/useOptimisticTaskUpdates';
import { apiError } from '@/util/toast';
import {
  getStatusColor,
  getStatusLabel as getStatusDisplayName,
} from '@/lib/utils';

interface TaskListViewProps {
  onViewTaskDetails: (task: any) => void;
}

const TaskListView = ({ onViewTaskDetails }: TaskListViewProps) => {
  const dispatch = useAppDispatch();
  const { moveTask } = useOptimisticTaskUpdates();
  const [loading, setLoading] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<TaskStatus, boolean>
  >({
    BACKLOG: false,
    TODO: false,
    IN_PROGRESS: false,
    DONE: false,
    IN_REVIEW: false,
  });
  const [dragOverSection, setDragOverSection] = useState<TaskStatus | null>(
    null
  );

  // Get tasks and pagination for each status
  const inReviewTasks = useAppSelector(state =>
    selectTasksByStatus(state, 'IN_REVIEW')
  );
  const inReviewPagination = useAppSelector(state =>
    selectColumnPagination(state, 'IN_REVIEW')
  );

  const backlogTasks = useAppSelector(state =>
    selectTasksByStatus(state, 'BACKLOG')
  );
  const backlogPagination = useAppSelector(state =>
    selectColumnPagination(state, 'BACKLOG')
  );

  const todoTasks = useAppSelector(state => selectTasksByStatus(state, 'TODO'));
  const inProgressTasks = useAppSelector(state =>
    selectTasksByStatus(state, 'IN_PROGRESS')
  );
  const doneTasks = useAppSelector(state => selectTasksByStatus(state, 'DONE'));

  const todoPagination = useAppSelector(state =>
    selectColumnPagination(state, 'TODO')
  );
  const inProgressPagination = useAppSelector(state =>
    selectColumnPagination(state, 'IN_PROGRESS')
  );
  const donePagination = useAppSelector(state =>
    selectColumnPagination(state, 'DONE')
  );

  const toggleSection = (status: TaskStatus) => {
    setCollapsedSections(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const loadMore = useCallback(
    async (status: TaskStatus) => {
      if (loading) return;

      setLoading(true);
      try {
        const pagination =
          status === 'TODO'
            ? todoPagination
            : status === 'IN_PROGRESS'
              ? inProgressPagination
              : donePagination;

        if (pagination.hasNextPage) {
          await dispatch(
            fetchTasks({ status, page: pagination.currentPage + 1 })
          );
        }
      } catch (error) {
        console.error('Failed to load more tasks:', error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, loading, todoPagination, inProgressPagination, donePagination]
  );

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSection(null);
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverSection(null);

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    try {
      await moveTask(taskId, status);
    } catch (error) {
      console.error('Failed to move task:', error);
      apiError('Failed to move task. The task has been restored.');
    }
  };

  const renderSection = (status: TaskStatus, tasks: any[], pagination: any) => {
    const isCollapsed = collapsedSections[status];
    const hasMoreTasks = pagination.hasNextPage;
    const taskCount = pagination.totalItems;
    const isDragOver = dragOverSection === status;

    return (
      <div
        key={status}
        className={cn(
          'bg-white rounded-lg border-2 transition-all duration-200',
          isDragOver
            ? 'border-blue-400 bg-blue-50/50 shadow-lg'
            : 'border-gray-200 shadow-sm'
        )}
        onDragOver={e => handleDragOver(e, status)}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(e, status)}
      >
        {/* Section Header */}
        <div
          className={cn(
            'px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors',
            isDragOver ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
          )}
          onClick={() => toggleSection(status)}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {isCollapsed ? (
                <ChevronRight className='h-5 w-5 text-gray-500' />
              ) : (
                <ChevronDown className='h-5 w-5 text-gray-500' />
              )}
              <h3 className='text-lg font-semibold text-gray-900'>
                {getStatusDisplayName(status)}
              </h3>
              <Badge className={cn('text-sm', getStatusColor(status))}>
                {taskCount} tasks
              </Badge>
            </div>
          </div>
        </div>

        {/* Section Content */}
        {!isCollapsed && (
          <>
            {/* Column Headers */}
            <div className='px-6 py-3 border-b border-gray-200 bg-gray-50'>
              <div className='grid grid-cols-5 gap-4 text-sm font-medium text-gray-700'>
                <div>Title</div>
                <div>Description</div>
                <div>Assignee</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
              </div>
            </div>

            {/* Task Rows - Fixed height with scroll */}
            <div className='h-64 overflow-y-auto'>
              <div className='divide-y divide-gray-100'>
                {tasks.map(task => (
                  <TaskListRow
                    key={task.id}
                    task={task}
                    onClick={() => onViewTaskDetails(task)}
                  />
                ))}

                {tasks.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    <div className='w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center'>
                      <Plus className='h-6 w-6 text-gray-400' />
                    </div>
                    <p className='text-sm font-medium text-gray-900 mb-1'>
                      No tasks yet
                    </p>
                  </div>
                )}

                {/* Load More Button */}
                {hasMoreTasks && (
                  <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
                    <Button
                      onClick={() => loadMore(status)}
                      variant='outline'
                      className='w-full'
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                          Loading...
                        </>
                      ) : (
                        'Load More Tasks'
                      )}
                    </Button>
                  </div>
                )}

                {!hasMoreTasks && tasks.length > 0 && (
                  <div className='px-6 py-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-500'>
                    No more tasks to load
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className='h-[calc(100vh-112px)] overflow-y-auto max-w-7xl mx-auto flex flex-col gap-4'>
      {renderSection('BACKLOG', backlogTasks, backlogPagination)}
      {renderSection('TODO', todoTasks, todoPagination)}
      {renderSection('IN_PROGRESS', inProgressTasks, inProgressPagination)}
      {renderSection('IN_REVIEW', inReviewTasks, inReviewPagination)}
      {renderSection('DONE', doneTasks, donePagination)}
    </div>
  );
};

export default TaskListView;
