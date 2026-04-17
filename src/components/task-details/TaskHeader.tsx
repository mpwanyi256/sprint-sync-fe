'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TaskHeaderProps {
  onClose: () => void;
}

export const TaskHeader = ({ onClose }: TaskHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <div />
      <Button
        variant='ghost'
        size='sm'
        onClick={onClose}
        className='h-8 w-8 p-0 shrink-0 hover:bg-gray-100'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
};
