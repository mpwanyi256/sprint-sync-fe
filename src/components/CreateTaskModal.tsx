import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTask } from '@/store/slices/task';
import {
  clearStreamingContent,
  generateTaskDescription,
} from '@/store/slices/ai';
import { CreateTaskData } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiError, apiSuccess } from '@/util/toast';
import { Sparkles, Loader2 } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateTaskModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateTaskModalProps) => {
  const dispatch = useAppDispatch();
  const { generatingDescription, streamingContent } = useAppSelector(
    state => state.ai
  );
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    totalMinutes: 0,
  });

  // Update description when streaming content changes
  useEffect(() => {
    if (streamingContent) {
      setFormData(prev => ({
        ...prev,
        description: streamingContent,
      }));
    }
  }, [streamingContent]);

  useEffect(() => {
    if (!isOpen) {
      // Clear streaming content when modal closes
      dispatch(clearStreamingContent());
    }
  }, [isOpen, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      formData.totalMinutes <= 0
    ) {
      return;
    }

    try {
      setFormLoading(true);
      await dispatch(createTask(formData)).unwrap();

      // Reset form
      setFormData({
        title: '',
        description: '',
        totalMinutes: 0,
      });

      onSuccess?.();
      apiSuccess('Task created successfully');
      onClose();
    } catch (error) {
      apiError('Failed to create task');
      console.error('Failed to create task:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateTaskData,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'totalMinutes' ? Number(value) : value,
    }));
  };

  const handleAiSuggest = async () => {
    if (!formData.title.trim()) {
      apiError('Please enter a task title first');
      return;
    }

    try {
      const result = await dispatch(
        generateTaskDescription({ title: formData.title })
      ).unwrap();

      // The description is already updated via streaming, but we can set it here as a fallback
      if (result.description) {
        setFormData(prev => ({
          ...prev,
          description: result.description,
        }));
      }

      apiSuccess('AI suggestion generated successfully');
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      if (error instanceof Error) {
        apiError(`Failed to get AI suggestion: ${error.message}`);
      } else {
        apiError('Failed to get AI suggestion');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title *</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder='Enter task title'
              required
            />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='description'>Description *</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAiSuggest}
                disabled={generatingDescription || !formData.title.trim()}
                className='flex items-center gap-2'
              >
                {generatingDescription ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Sparkles className='h-4 w-4' />
                )}
                {generatingDescription ? 'Generating...' : 'AI Suggest'}
              </Button>
            </div>
            <Textarea
              id='description'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder='Enter task description or use AI to generate one'
              rows={3}
              required
              className={
                generatingDescription ? 'border-blue-300 bg-blue-50' : ''
              }
            />
            {generatingDescription && streamingContent && (
              <div className='text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200'>
                <div className='flex items-center gap-2 mb-1'>
                  <Loader2 className='h-3 w-3 animate-spin' />
                  <span className='font-medium'>
                    AI is generating description...
                  </span>
                </div>
                <div className='text-gray-700'>
                  {streamingContent}
                  <span className='animate-pulse'>|</span>
                </div>
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='totalMinutes'>Estimated Time (minutes) *</Label>
              <Input
                id='totalMinutes'
                type='number'
                min='1'
                value={formData.totalMinutes}
                onChange={e =>
                  handleInputChange('totalMinutes', e.target.value)
                }
                placeholder='30'
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                formLoading ||
                !formData.title.trim() ||
                !formData.description.trim() ||
                formData.totalMinutes <= 0
              }
            >
              {formLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
