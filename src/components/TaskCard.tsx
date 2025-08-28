import { Task, TaskStatus } from '@/types/task'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  onViewDetails: (task: Task) => void
}

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

const TaskCard = ({ task, onStatusChange, onViewDetails }: TaskCardProps) => {
  const nextStatus = (currentStatus: TaskStatus): TaskStatus => {
    switch (currentStatus) {
      case 'TODO':
        return 'IN_PROGRESS'
      case 'IN_PROGRESS':
        return 'DONE'
      case 'DONE':
        return 'TODO'
      default:
        return 'TODO'
    }
  }

  const handleStatusChange = () => {
    const newStatus = nextStatus(task.status)
    onStatusChange(task.id, newStatus)
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium line-clamp-2">
            {task.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn("ml-2 flex-shrink-0", getStatusColor(task.status))}
          >
            {getStatusLabel(task.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{task.totalMinutes} min</span>
            </div>
            {task.assignedTo && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Assigned</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(task)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            size="sm"
            onClick={handleStatusChange}
            className="flex-1"
          >
            {task.status === 'DONE' ? 'Reset' : 'Next Status'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
