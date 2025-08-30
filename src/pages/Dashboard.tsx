import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateTaskStatusById, deleteTaskById } from '@/store/slices/task';
import { Task, TaskStatus } from '@/types/task';
import TaskColumn from '@/components/TaskColumn';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskDetailsModal from '@/components/TaskDetailsModal';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await dispatch(
        updateTaskStatusById({ id: taskId, status: newStatus })
      ).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleTaskCreated = () => {
    // Refresh all columns
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 100);
  };

  const handleEditTask = (task: Task) => {
    // TODO: Implement edit functionality
    console.log('Edit task:', task);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTaskById(taskId)).unwrap();
      setIsDetailsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const columns = [
    { status: 'TODO' as TaskStatus, title: 'To Do' },
    { status: 'IN_PROGRESS' as TaskStatus, title: 'In Progress' },
    { status: 'DONE' as TaskStatus, title: 'Done' },
  ];

  return (
    <div className='pt-20 pb-8 px-4 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Task Dashboard</h1>
            <p className='mt-2 text-gray-600'>
              Manage your tasks and track progress across different stages
            </p>
          </div>

          <div className='mt-4 sm:mt-0 flex space-x-3'>
            <Button
              variant='outline'
              onClick={() => setRefreshing(true)}
              disabled={refreshing}
            >
              <RefreshCw
                className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')}
              />
              Refresh
            </Button>
            <Button onClick={handleCreateTask}>
              <Plus className='h-4 w-4 mr-2' />
              Create Task
            </Button>
          </div>
        </div>

        {/* Task Columns */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]'>
          {columns.map(column => (
            <TaskColumn
              key={column.status}
              status={column.status}
              title={column.title}
              onViewTaskDetails={handleViewTaskDetails}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTaskCreated}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
