'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateTaskStatusById, deleteTaskById, fetchTasks } from '@/store/slices/task'
import { selectTasksByStatus } from '@/store/slices/task/taskSelectors'
import { Task, TaskStatus } from '@/types/task'
import TaskColumn from '@/components/TaskColumn'
import CreateTaskModal from '@/components/CreateTaskModal'
import TaskDetailsModal from '@/components/TaskDetailsModal'

interface DashboardProps {
  isCreateModalOpen: boolean
  onCloseCreateModal: () => void
}

const Dashboard = ({ isCreateModalOpen, onCloseCreateModal }: DashboardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  
  // Get tasks from Redux store instead of hardcoded data
  const todoTasks = useAppSelector(state => selectTasksByStatus(state, 'TODO'))
  const inProgressTasks = useAppSelector(state => selectTasksByStatus(state, 'IN_PROGRESS'))
  const doneTasks = useAppSelector(state => selectTasksByStatus(state, 'DONE'))

  // Fetch tasks on component mount and when dependencies change
  useEffect(() => {
    const loadAllTasks = async () => {
      try {
        // Fetch tasks for all statuses
        await Promise.all([
          dispatch(fetchTasks({ status: 'TODO', page: 1, limit: 50 })).unwrap(),
          dispatch(fetchTasks({ status: 'IN_PROGRESS', page: 1, limit: 50 })).unwrap(),
          dispatch(fetchTasks({ status: 'DONE', page: 1, limit: 50 })).unwrap(),
        ])
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
    }

    loadAllTasks()
  }, [dispatch])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDetailsModalOpen(true)
  }

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await dispatch(updateTaskStatusById({ id: taskId, status: newStatus })).unwrap()
      // Refresh tasks after status change
      await Promise.all([
        dispatch(fetchTasks({ status: 'TODO', page: 1, limit: 50 })).unwrap(),
        dispatch(fetchTasks({ status: 'IN_PROGRESS', page: 1, limit: 50 })).unwrap(),
        dispatch(fetchTasks({ status: 'DONE', page: 1, limit: 50 })).unwrap(),
      ])
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTaskById(taskId)).unwrap()
      // Refresh tasks after deletion
      await Promise.all([
        dispatch(fetchTasks({ status: 'TODO', page: 1, limit: 50 })).unwrap(),
        dispatch(fetchTasks({ status: 'IN_PROGRESS', page: 1, limit: 50 })).unwrap(),
        dispatch(fetchTasks({ status: 'DONE', page: 1, limit: 50 })).unwrap(),
      ])
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleAddTaskToColumn = (status: TaskStatus) => {
    // TODO: Implement quick add task to specific column
    console.log('Add task to column:', status)
    onCloseCreateModal()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Task Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <TaskColumn
            title="To Do"
            status="TODO"
            onViewTaskDetails={handleTaskClick}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTaskToColumn}
          />
          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            onViewTaskDetails={handleTaskClick}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTaskToColumn}
          />
          <TaskColumn
            title="Done"
            status="DONE"
            onViewTaskDetails={handleTaskClick}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTaskToColumn}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedTask(null)
          }}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}

export default Dashboard
