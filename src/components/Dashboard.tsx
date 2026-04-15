'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import BoardView from '@/components/BoardView';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskDetailsModal from '@/components/TaskDetailsModal';
import { useAppDispatch } from '@/store/hooks';
import { setInitialTasks } from '@/store/slices/task';

interface DashboardProps {
  initialTasks?: Task[];
}

const Dashboard = ({ initialTasks }: DashboardProps) => {
  const dispatch = useAppDispatch();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      dispatch(setInitialTasks(initialTasks));
    }
  }, [initialTasks, dispatch]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Task Board */}
      <div className='p-6'>
        <BoardView onViewTaskDetails={handleTaskClick} />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
