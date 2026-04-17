'use client';

import {
  extractTaskTextContent,
  normalizeTaskContentLinks,
  renderTaskContentHtml,
} from '@/lib/utils';
import { useRef } from 'react';

interface TaskDescriptionEditorProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  onContentClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const TaskDescriptionEditor = ({
  description,
  onDescriptionChange,
  onContentClick,
}: TaskDescriptionEditorProps) => {
  const descriptionRef = useRef<HTMLDivElement>(null);

  return (
    <div className='space-y-3'>
      <h3 className='text-sm font-semibold text-gray-900'>Description</h3>
      <div
        ref={descriptionRef}
        contentEditable
        suppressContentEditableWarning={true}
        onClick={onContentClick}
        onBlur={e => {
          const content = normalizeTaskContentLinks(e.currentTarget.innerHTML);
          if (extractTaskTextContent(content)) {
            onDescriptionChange(content);
          }
        }}
        className='min-h-[200px] max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 p-4 text-sm leading-relaxed text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 hover:border-gray-300'
        dangerouslySetInnerHTML={{
          __html: renderTaskContentHtml(description),
        }}
      />
    </div>
  );
};
