import { Task } from '@/types/task'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, Calendar, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

const getStatusColor = (status: Task['status']) => {
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

const getStatusLabel = (status: Task['status']) => {
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

const TaskDetailsModal = ({ 
  task, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: TaskDetailsModalProps) => {
  if (!task) return null

  const handleEdit = () => {
    onEdit?.(task)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
              <Badge 
                variant="outline" 
                className={cn("mt-2", getStatusColor(task.status))}
              >
                {getStatusLabel(task.status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {task.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Estimated Time</h4>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{task.totalMinutes} minutes</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Status</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Created</h4>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Last Updated</h4>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {task.assignedTo && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Assigned To</h4>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>{task.assignedTo}</span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 pt-4">
            {onEdit && (
              <Button onClick={handleEdit} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDetailsModal
