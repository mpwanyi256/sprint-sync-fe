'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  assignTaskToUser,
  upsertTaskSnapshot,
  unAssignTask,
  updateTaskDetails,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskStatusById,
} from '@/store/slices/task';
import { User } from '@/types/auth';
import { Task, TaskStatus, UpdateTaskData } from '@/types/task';
import { findTaskInColumns } from '@/lib/utils';

const OPTIMISTIC_TIMESTAMP = () => new Date().toISOString();

export const useOptimisticTaskUpdates = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(state => state.task.columns);

  const getTaskSnapshot = useCallback(
    (taskId: string) => {
      const { task, taskIndex } = findTaskInColumns(columns, taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      return {
        task: { ...task },
        index: taskIndex,
      };
    },
    [columns]
  );

  const restoreTask = useCallback(
    (snapshot: { task: Task; index: number }) => {
      dispatch(upsertTaskSnapshot(snapshot));
    },
    [dispatch]
  );

  const moveTask = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const snapshot = getTaskSnapshot(taskId);

      if (snapshot.task.status === status) {
        return snapshot.task;
      }

      const optimisticTask: Task = {
        ...snapshot.task,
        status,
        updatedAt: OPTIMISTIC_TIMESTAMP(),
      };

      dispatch(upsertTaskSnapshot({ task: optimisticTask }));

      try {
        await dispatch(updateTaskStatusById({ id: taskId, status })).unwrap();
        return optimisticTask;
      } catch (error) {
        restoreTask(snapshot);
        throw error;
      }
    },
    [dispatch, getTaskSnapshot, restoreTask]
  );

  const updateDetails = useCallback(
    async (taskId: string, data: UpdateTaskData) => {
      const snapshot = getTaskSnapshot(taskId);
      const originalStatus = snapshot.task.status;
      const newStatus = (data.status ?? originalStatus) as TaskStatus;

      const optimisticTask: Task = {
        ...snapshot.task,
        ...data,
        status: newStatus,
        updatedAt: OPTIMISTIC_TIMESTAMP(),
      };

      if (newStatus !== originalStatus) {
        dispatch(
          upsertTaskSnapshot({
            task: optimisticTask,
            index: undefined,
          })
        );
      }

      try {
        const response = await dispatch(
          updateTaskDetails({ id: taskId, data })
        ).unwrap();

        return response.data;
      } catch (error) {
        restoreTask(snapshot);
        throw error;
      }
    },
    [dispatch, getTaskSnapshot, restoreTask]
  );

  const updateTitle = useCallback(
    async (taskId: string, title: string) => {
      const snapshot = getTaskSnapshot(taskId);
      const optimisticTask: Task = {
        ...snapshot.task,
        title,
        updatedAt: OPTIMISTIC_TIMESTAMP(),
      };

      dispatch(
        upsertTaskSnapshot({
          task: optimisticTask,
          index: snapshot.index,
        })
      );

      try {
        const response = await dispatch(
          updateTaskTitle({ id: taskId, title })
        ).unwrap();
        return response.data;
      } catch (error) {
        restoreTask(snapshot);
        throw error;
      }
    },
    [dispatch, getTaskSnapshot, restoreTask]
  );

  const updateDescription = useCallback(
    async (taskId: string, description: string) => {
      const snapshot = getTaskSnapshot(taskId);
      const optimisticTask: Task = {
        ...snapshot.task,
        description,
        updatedAt: OPTIMISTIC_TIMESTAMP(),
      };

      dispatch(
        upsertTaskSnapshot({
          task: optimisticTask,
          index: snapshot.index,
        })
      );

      try {
        const response = await dispatch(
          updateTaskDescription({ id: taskId, description })
        ).unwrap();
        return response.data;
      } catch (error) {
        restoreTask(snapshot);
        throw error;
      }
    },
    [dispatch, getTaskSnapshot, restoreTask]
  );

  const assignTask = useCallback(
    async (taskId: string, user: User) => {
      const snapshot = getTaskSnapshot(taskId);
      const optimisticTask: Task = {
        ...snapshot.task,
        assignedTo: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        updatedAt: OPTIMISTIC_TIMESTAMP(),
      };

      dispatch(
        upsertTaskSnapshot({
          task: optimisticTask,
          index: snapshot.index,
        })
      );

      try {
        await dispatch(assignTaskToUser({ taskId, user })).unwrap();
        return optimisticTask;
      } catch (error) {
        restoreTask(snapshot);
        throw error;
      }
    },
    [dispatch, getTaskSnapshot, restoreTask]
  );

  const unassignTask = useCallback(
    async (taskId: string) => {
      const snapshot = getTaskSnapshot(taskId);
      const optimisticTask: Task = {
        ...snapshot.task,
        assignedTo: null,
        updatedAt: OPTIMISTIC_TIMESTAMP(),
      };

      dispatch(
        upsertTaskSnapshot({
          task: optimisticTask,
          index: snapshot.index,
        })
      );

      try {
        await dispatch(unAssignTask({ taskId })).unwrap();
        return optimisticTask;
      } catch (error) {
        restoreTask(snapshot);
        throw error;
      }
    },
    [dispatch, getTaskSnapshot, restoreTask]
  );

  return {
    moveTask,
    updateDetails,
    updateTitle,
    updateDescription,
    assignTask,
    unassignTask,
  };
};
