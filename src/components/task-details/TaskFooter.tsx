'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';

interface TaskFooterProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const TaskFooter = ({ onSave, onCancel, isSaving }: TaskFooterProps) => {
  return (
    <div className='flex justify-end gap-2 border-t border-gray-200 px-6 py-4'>
      <Button
        variant='outline'
        onClick={onCancel}
        disabled={isSaving}
        className='hover:bg-gray-50'
      >
        <X className='mr-2 h-4 w-4' />
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving}
        className='bg-blue-600 text-white hover:bg-blue-700'
      >
        {isSaving ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Save className='mr-2 h-4 w-4' />
        )}
        Save Changes
      </Button>
    </div>
  );
};
