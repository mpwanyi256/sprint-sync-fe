'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateTaskById } from '@/store/slices/task'
import { Task } from '@/types/task'
import TaskColumn from '@/components/TaskColumn'
import CreateTaskModal from '@/components/CreateTaskModal'
import TaskDetailsModal from '@/components/TaskDetailsModal'

const Dashboard = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const dispatch = useAppDispatch()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDetailsModalOpen(true)
  }

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      const updateData = {
        title: updatedTask.title,
        description: updatedTask.description,
        totalMinutes: updatedTask.totalMinutes,
        assignedTo: updatedTask.assignedTo,
        status: updatedTask.status,
      }
      await dispatch(updateTaskById({ id: updatedTask.id, data: updateData })).unwrap()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Task Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
          <TaskColumn
            title="To Do"
            status="TODO"
            onViewTaskDetails={handleTaskClick}
          />
          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            onViewTaskDetails={handleTaskClick}
          />
          <TaskColumn
            title="Done"
            status="DONE"
            onViewTaskDetails={handleTaskClick}
          />
        </div>
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
            setIsDetailsModalOpen(false)
            setSelectedTask(null)
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  )
}

export default Dashboard
