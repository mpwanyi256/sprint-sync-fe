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
import { AssigneeDropdown } from './AssigneeDropdown'

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
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
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

  const handleInputChange = (field: keyof Task, value: string | number | any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Input
                value={editedTask.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-2xl font-bold border-0 p-0 h-auto bg-transparent focus:ring-0 focus:border-0 focus:bg-transparent text-gray-900"
                placeholder="Enter task title"
              />
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Description Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Description</h4>
            <Textarea
              value={editedTask.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description"
              className="min-h-[120px] bg-gray-50 border-gray-200 text-gray-700 resize-none"
            />
          </div>
          
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Status */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Status</h4>
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

              {/* Estimated Time */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Estimated Time</h4>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <Input
                    type="number"
                    value={editedTask.totalMinutes}
                    onChange={(e) => handleInputChange('totalMinutes', parseInt(e.target.value) || 0)}
                    className="w-24 bg-white border-gray-200"
                    min="0"
                  />
                  <span className="text-gray-600 font-medium">minutes</span>
                </div>
              </div>

              {/* Created Date */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Created</h4>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Last Updated */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Last Updated</h4>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">{new Date(task.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Priority/Tags Placeholder */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Priority</h4>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full border border-yellow-200">
                    Medium
                  </span>
                </div>
              </div>

              {/* Due Date Placeholder */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Due Date</h4>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Not set</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assignee Section */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Assignee</h4>
            <div className="relative">
              {editedTask.assignedTo ? (
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  >
                    <span className="text-lg font-bold text-blue-700">
                      {editedTask.assignedTo.firstName.charAt(0)}{editedTask.assignedTo.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={`${editedTask.assignedTo.firstName} ${editedTask.assignedTo.lastName}`.trim()}
                      onChange={(e) => {
                        const names = e.target.value.split(' ')
                        const firstName = names[0] || ''
                        const lastName = names.slice(1).join(' ') || ''
                        handleInputChange('assignedTo', { 
                          ...editedTask.assignedTo, 
                          firstName, 
                          lastName 
                        })
                      }}
                      placeholder="Enter assignee name"
                      className="bg-white border-gray-200 text-lg font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  >
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value=""
                      onChange={(e) => {
                        const names = e.target.value.split(' ')
                        const firstName = names[0] || ''
                        const lastName = names.slice(1).join(' ') || ''
                        if (firstName || lastName) {
                          handleInputChange('assignedTo', { 
                            firstName, 
                            lastName,
                            email: '',
                            id: ''
                          })
                        }
                      }}
                      placeholder="Enter assignee name"
                      className="bg-white border-gray-200 text-lg font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Assignee Dropdown */}
              {showAssigneeDropdown && (
                <AssigneeDropdown
                  taskId={editedTask.id}
                  currentAssignee={editedTask.assignedTo}
                  onClose={() => setShowAssigneeDropdown(false)}
                  onAssigneeChange={(user) => {
                    if (user) {
                      handleInputChange('assignedTo', user)
                    } else {
                      handleInputChange('assignedTo', null)
                    }
                    setShowAssigneeDropdown(false)
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <Button onClick={onClose} variant="outline" className="flex-1 py-3">
              Cancel
            </Button>
            <Button onClick={handleSaveTask} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700">
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
