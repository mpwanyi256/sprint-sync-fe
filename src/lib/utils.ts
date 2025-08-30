import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Task, TaskState, TaskStatus } from '@/types/task';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const findTaskInColumns = (
  columns: any,
  taskId: string
): {
  task: Task | null;
  columnStatus: TaskStatus | null;
  taskIndex: number;
} => {
  for (const columnStatus of Object.keys(columns)) {
    const statusKey = columnStatus as TaskStatus;
    const column = columns[statusKey];
    const taskIndex = column.tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    if (taskIndex !== -1) {
      return {
        task: column.tasks[taskIndex],
        columnStatus: statusKey,
        taskIndex,
      };
    }
  }
  return { task: null, columnStatus: null, taskIndex: -1 };
};

export const removeTaskFromColumn = (
  columns: TaskState['columns'],
  columnStatus: TaskStatus,
  taskIndex: number
) => {
  if (columns[columnStatus] && taskIndex !== -1) {
    columns[columnStatus].tasks.splice(taskIndex, 1);
    columns[columnStatus].pagination.totalItems -= 1;
  }
};

export const addTaskToColumn = (
  columns: TaskState['columns'],
  columnStatus: TaskStatus,
  task: Task
) => {
  if (columns[columnStatus]) {
    columns[columnStatus].tasks.unshift(task);
    columns[columnStatus].pagination.totalItems += 1;
  }
};
