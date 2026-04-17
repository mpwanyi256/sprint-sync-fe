'use client';

import { Button } from '@/components/ui/button';
import {
  extractTaskTextContent,
  normalizeTaskContentLinks,
  renderTaskContentHtml,
} from '@/lib/utils';
import { Check, Pencil, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (value: string) => void;
}

export const EditableTitle = ({
  value,
  onChange,
  onSave,
}: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const html = titleRef.current?.innerHTML || value;
    const normalized = normalizeTaskContentLinks(html);

    if (extractTaskTextContent(normalized)) {
      onSave(normalized);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (titleRef.current) {
      titleRef.current.innerHTML = renderTaskContentHtml(value, {
        preserveLineBreaks: false,
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className='group flex items-center gap-2'>
        <h1 className='flex-1 rounded-md py-1 text-2xl font-bold text-gray-900'>
          {value}
        </h1>
        <button
          onClick={() => setIsEditing(true)}
          className='rounded-md bg-blue-50 p-2 opacity-0 transition-opacity group-hover:opacity-100'
        >
          <Pencil className='h-4 w-4 text-blue-600' />
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={handleKeyDown}
        onBlur={e => onChange(e.currentTarget.innerHTML)}
        className='rounded-md border border-gray-100/50 bg-white px-3 py-2 text-2xl font-bold text-gray-900 outline-none ring-2 ring-gray-100/50'
        dangerouslySetInnerHTML={{
          __html: renderTaskContentHtml(value, { preserveLineBreaks: false }),
        }}
      />
      <div className='flex justify-end gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleCancel}
          className='hover:bg-gray-50'
        >
          <X className='mr-1 h-4 w-4' />
        </Button>
        <Button
          size='sm'
          onClick={handleSave}
          className='bg-blue-600 text-white hover:bg-blue-700'
        >
          <Check className='mr-1 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
