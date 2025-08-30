import { RootState } from '@/store';
import { TaskStatus, ColumnTasks } from '@/types/task';

export const selectTasks = (state: RootState) => {
  const allTasks: import('@/types/task').Task[] = [];
  Object.values(state.task.columns).forEach((column: ColumnTasks) => {
    allTasks.push(...column.tasks);
  });
  return allTasks;
};

export const selectTaskLoading = (state: RootState) => state.task.loading;
export const selectTaskError = (state: RootState) => state.task.error;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;

export const selectTasksByStatus = (state: RootState, status: TaskStatus) =>
  state.task.columns[status]?.tasks || [];

export const selectColumnPagination = (state: RootState, status: TaskStatus) =>
  state.task.columns[status]?.pagination || {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  };

export const selectTasksByUser = (state: RootState, userId: string) => {
  const allTasks = selectTasks(state);
  return allTasks.filter(task => task.assignedTo?.id === userId);
};

export const selectTotalTaskTime = (state: RootState) => {
  const allTasks = selectTasks(state);
  return allTasks.reduce((total, task) => total + task.totalMinutes, 0);
};

export const selectTasksByStatusCount = (state: RootState) => {
  return {
    todo: state.task.columns.TODO?.tasks.length || 0,
    inProgress: state.task.columns.IN_PROGRESS?.tasks.length || 0,
    done: state.task.columns.DONE?.tasks.length || 0,
  };
};
