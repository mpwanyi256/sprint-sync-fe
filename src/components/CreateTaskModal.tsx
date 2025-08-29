import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createTask } from '@/store/slices/task'
import { CreateTaskData } from '@/types/task'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateTaskModal = ({ isOpen, onClose, onSuccess }: CreateTaskModalProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    totalMinutes: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim() || formData.totalMinutes <= 0) {
      return
    }

    try {
      setLoading(true)
      await dispatch(createTask(formData)).unwrap()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        totalMinutes: 0,
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateTaskData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'totalMinutes' ? Number(value) : value
    }))
  }

  const handleAssignedToChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: value === '' ? undefined : value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMinutes">Estimated Time (minutes) *</Label>
              <Input
                id="totalMinutes"
                type="number"
                min="1"
                value={formData.totalMinutes}
                onChange={(e) => handleInputChange('totalMinutes', e.target.value)}
                placeholder="30"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim() || formData.totalMinutes <= 0}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTaskModal
