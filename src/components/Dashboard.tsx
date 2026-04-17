'use client';

import BoardView from '@/components/BoardView';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskDetailsModal from '@/components/TaskDetailsModal';
import { useAppDispatch } from '@/store/hooks';
import { setInitialTasks } from '@/store/slices/task';
import { Task } from '@/types/task';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardProps {
  initialTasks?: Task[];
  initialTaskId?: string | null;
}

const Dashboard = ({ initialTasks, initialTaskId }: DashboardProps) => {
  const dispatch = useAppDispatch();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    initialTaskId || null
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  console.log('Initial task ID', initialTaskId);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      dispatch(setInitialTasks(initialTasks));
    }
  }, [initialTasks, dispatch]);

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    router.replace(`${pathname}?task=${task.id}`, { scroll: false });
  };

  const handleCloseDetails = () => {
    setSelectedTaskId(null);
    if (searchParams.has('task')) {
      router.replace(pathname, { scroll: false });
    }
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

      {selectedTaskId && (
        <TaskDetailsModal
          taskId={selectedTaskId}
          isOpen={!!selectedTaskId}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Dashboard;
