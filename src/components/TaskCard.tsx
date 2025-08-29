'use client'

import { Task, TaskStatus } from '@/types/task'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onClick?: () => void
  className?: string
}

const TaskCard = ({ task, onClick, className }: TaskCardProps) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DONE':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'To Do'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'DONE':
        return 'Done'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow",
        "hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      {/* Header with status badge */}
      <div className="flex items-start justify-between mb-3">
        <Badge 
          variant="outline" 
          className={cn("text-xs font-medium", getStatusColor(task.status))}
        >
          {getStatusLabel(task.status)}
        </Badge>
      </div>

      {/* Task title */}
      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Task description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task metadata */}
      <div className="space-y-2">
        {/* Time estimate */}
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>{task.totalMinutes} min</span>
        </div>

        {/* Created date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
