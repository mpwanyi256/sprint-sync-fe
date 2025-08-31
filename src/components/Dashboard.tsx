'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import BoardView from '@/components/BoardView';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskDetailsModal from '@/components/TaskDetailsModal';

const Dashboard = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
