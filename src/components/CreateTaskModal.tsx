import { useState, useEffect, useRef } from 'react';
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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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
    totalMinutes: 5,
    status: 'BACKLOG',
  });

  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

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

    console.log('Creating task');

    // Get latest from refs in case onBlur hasn't fired yet
    const finalTitle = titleRef.current?.innerHTML || formData.title;
    const finalDesc = descRef.current?.innerHTML || formData.description;

    const plainTitle = finalTitle.replace(/<[^>]*>?/gm, '').trim();
    const plainDesc = finalDesc.replace(/<[^>]*>?/gm, '').trim();

    if (!plainTitle || !plainDesc) {
      console.log('Missing input...');
      apiError('Please enter a task title and description');
      return;
    }

    try {
      setFormLoading(true);
      await dispatch(
        createTask({
          ...formData,
          title: finalTitle,
          description: finalDesc,
        })
      ).unwrap();

      // Reset form
      if (titleRef.current) titleRef.current.innerHTML = '';
      if (descRef.current) descRef.current.innerHTML = '';

      setFormData({
        title: '',
        description: '',
        totalMinutes: 5,
        status: 'BACKLOG',
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
    const plainTitle =
      titleRef.current?.innerText || formData.title.replace(/<[^>]*>?/gm, '');
    const plainDesc =
      descRef.current?.innerText ||
      formData.description.replace(/<[^>]*>?/gm, '');

    if (!plainTitle.trim()) {
      apiError('Please enter a task title first');
      return;
    }

    try {
      const result = await dispatch(
        generateTaskDescription({
          title: plainTitle.trim(),
          description: plainDesc.trim(),
        })
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
            <div
              id='title'
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={e =>
                handleInputChange('title', e.currentTarget.innerHTML)
              }
              className='flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400'
              data-placeholder='Enter task title'
              dangerouslySetInnerHTML={{ __html: formData.title }}
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
            <div
              id='description'
              ref={descRef}
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={e =>
                handleInputChange('description', e.currentTarget.innerHTML)
              }
              data-placeholder='Enter task description or use AI to generate one'
              className={cn(
                'flex flex-col min-h-[120px] max-h-[500px] overflow-y-auto w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400',
                generatingDescription ? 'border-blue-300 bg-blue-50' : ''
              )}
              dangerouslySetInnerHTML={{ __html: formData.description }}
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

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
