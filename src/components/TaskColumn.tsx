'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, updateTaskById } from '@/store/slices/task';
import {
  selectTasksByStatus,
  selectColumnPagination,
  selectTasks,
} from '@/store/slices/task/taskSelectors';
import TaskCard from './TaskCard';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  onViewTaskDetails: (task: Task) => void;
}

const TaskColumn = ({ status, title, onViewTaskDetails }: TaskColumnProps) => {
  const dispatch = useAppDispatch();
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
      loadTasks();
    }
  }, [loading, pagination.hasNextPage, page, loadTasks]);

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
      await dispatch(
        updateTaskById({
          id: taskId,
          data: { status },
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'border-gray-200 bg-white';
      case 'IN_PROGRESS':
        return 'border-blue-200 bg-blue-50';
      case 'DONE':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getColumnHeaderColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'bg-white border-gray-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col h-[calc(100vh-112px)] border-2 rounded-lg transition-all duration-200',
        getColumnColor(status),
        isDragOver && 'border-blue-400 bg-blue-50/50 shadow-lg'
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'p-4 border-b rounded-t-lg flex-shrink-0 transition-colors duration-200',
          getColumnHeaderColor(status),
          isDragOver && 'bg-blue-100 border-blue-300'
        )}
      >
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          {tasksCount > 0 && (
            <span className='text-sm text-gray-600 font-medium rounded-full bg-blue-100 px-2 py-1'>
              {tasksCount} tasks
            </span>
          )}
        </div>
      </div>

      {/* Task Cards - Fixed height with scroll */}
      <div className='flex-1 p-4 space-y-3 overflow-y-auto min-h-0'>
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

        {!pagination.hasNextPage && tasks.length > 0 && (
          <div className='text-center py-4 text-sm text-gray-500'>
            No more tasks
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <div className='w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center'>
              <Image
                src='/assets/empty.svg'
                alt='Empty Task'
                width={150}
                height={150}
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
