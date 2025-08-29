import { useState, useEffect } from 'react'
import { Task } from '@/types/task'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, User, Calendar, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateTaskById } from '@/store/slices/task'
import { useAppDispatch } from '@/store/hooks'
import { apiError, apiSuccess } from '@/util/toast'

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave?: (task: Task) => void
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
  onSave 
}: TaskDetailsModalProps) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task })
    }
  }, [task])

  if (!task || !editedTask) return null

  const handleSaveTask = async () => {
    try {
      const updateData = {
        title: editedTask.title,
        description: editedTask.description,
        totalMinutes: editedTask.totalMinutes,
        assignedTo: editedTask.assignedTo,
        status: editedTask.status,
      }
      await dispatch(updateTaskById({ id: editedTask.id, data: updateData })).unwrap()
      apiSuccess('Task updated successfully')
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
      apiError('Failed to update task')
    }
  }

  const handleInputChange = (field: keyof Task, value: string | number) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Input
                value={editedTask.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-xl font-semibold border-0 p-0 h-auto bg-transparent focus:ring-0 focus:border-0 focus:bg-transparent"
                placeholder="Enter task title"
              />
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <Textarea
              value={editedTask.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[100px] bg-white border-gray-200"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Estimated Time</h4>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <Input
                  type="number"
                  value={editedTask.totalMinutes}
                  onChange={(e) => handleInputChange('totalMinutes', parseInt(e.target.value) || 0)}
                  className="w-20 bg-white border-gray-200"
                  min="0"
                />
                <span className="text-gray-600">minutes</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Status</h4>
              <Select
                value={editedTask.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="bg-white border-gray-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="TODO" className="hover:bg-gray-100">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS" className="hover:bg-gray-100">In Progress</SelectItem>
                  <SelectItem value="DONE" className="hover:bg-gray-100">Done</SelectItem>
                </SelectContent>
              </Select>
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
              <Input
                value={editedTask.assignedTo || ''}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="Enter assignee name"
                className="bg-white border-gray-200"
              />
            </div>
          )}
          
          <div className="flex space-x-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveTask} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDetailsModal
