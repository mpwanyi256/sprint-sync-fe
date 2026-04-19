'use client';

import { useOptimisticTaskUpdates } from '@/hooks/useOptimisticTaskUpdates';
import { cn, getStatusColor } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/slices/task';
import {
  selectColumnPagination,
  selectTasks,
  selectTasksByStatus,
} from '@/store/slices/task/taskSelectors';
import { Task, TaskStatus } from '@/types/task';
import { apiError } from '@/util/toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  onViewTaskDetails: (task: Task) => void;
}

const TaskColumn = ({ status, title, onViewTaskDetails }: TaskColumnProps) => {
  const dispatch = useAppDispatch();
  const { moveTask } = useOptimisticTaskUpdates();
  const tasks = useAppSelector(state => selectTasksByStatus(state, status));
  const allTasks = useAppSelector(selectTasks);
  const pagination = useAppSelector(state =>
    selectColumnPagination(state, status)
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const tasksCount = useMemo(() => pagination.totalItems, [pagination]);

  // Always load tasks from API
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(fetchTasks({ status, page })).unwrap();
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, status, page]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchTasks({ status, page: nextPage }));
    }
  }, [dispatch, loading, pagination.hasNextPage, page, status]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && pagination.hasNextPage && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, pagination.hasNextPage, loading]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    // Find the task being dropped to check its current status
    const draggedTask = allTasks.find(task => task.id === taskId);

    // If task is already in this column, don't make API call
    if (draggedTask && draggedTask.status === status) {
      return; // Just return without doing anything
    }

    try {
      await moveTask(taskId, status);
    } catch (error) {
      console.error('Failed to move task:', error);
      apiError('Failed to move task. The card has been restored.');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col h-[calc(100vh-112px)] border-2 rounded-lg transition-all duration-200 w-[320px] bg-[#f8f8f8]',
        isDragOver && 'border-blue-400 bg-blue-50/50 shadow-lg'
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'p-4 rounded-t-lg flex-shrink-0 transition-colors duration-200 bg-[#f8f8f8]',
          isDragOver && 'bg-primary border-primary'
        )}
      >
        <div className='flex items-center justify-between mb-2'>
          <h3
            className={cn(
              'text-lg font-semibold text-gray-900',
              isDragOver && 'text-white'
            )}
          >
            {title}
          </h3>
          {tasksCount > 0 && (
            <span
              className={cn(
                'text-sm font-medium rounded-full  px-2 py-1',
                getStatusColor(status)
              )}
            >
              {tasksCount} tasks
            </span>
          )}
        </div>
      </div>

      {/* Task Cards - Fixed height with scroll */}
      <div className='flex-1 p-1 space-y-1 overflow-y-auto min-h-0 bg-[#f8f8f8]'>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onViewTaskDetails(task)}
          />
        ))}

        {loading && (
          <div className='flex justify-center py-4'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
          </div>
        )}

        {pagination.hasNextPage && <div ref={observerRef} className='h-4' />}

        {!loading && tasks.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <div className='w-14 h-14 mx-auto mb-3 flex items-center justify-center'>
              <Image
                src='/assets/empty.svg'
                alt='Empty Task'
                width={100}
                height={100}
              />
            </div>
            <p className='text-sm font-medium text-gray-900 mb-1'>
              No tasks yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
