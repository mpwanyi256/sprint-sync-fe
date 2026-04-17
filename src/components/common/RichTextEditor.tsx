'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Lexical imports
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { $getRoot, $insertNodes, EditorState } from 'lexical';
import { ToolbarPlugin } from './lexical/ToolbarPlugin';

function HtmlPlugin({ initialHtml }: { initialHtml: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (!initialHtml || !isFirstRender) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFirstRender(false);

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();
      root.select();
      $insertNodes(nodes);
    });
  }, [editor, initialHtml, isFirstRender]);

  return null;
}

interface RichTextEditorProps {
  value: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  mode?: 'view' | 'edit';
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
  hideActionButtons?: boolean;
}

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
  },
  heading: {
    h1: 'text-2xl font-bold mb-2',
    h2: 'text-xl font-bold mb-2',
    h3: 'text-lg font-bold mb-2',
  },
  quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
  list: {
    nested: {
      listitem: 'nested-list-item',
    },
    ol: 'list-decimal list-inside',
    ul: 'list-disc list-inside',
    listitem: 'list-item',
  },
  code: 'bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto',
  codeHighlight: {
    atrule: 'text-purple-600',
    attr: 'text-blue-600',
    boolean: 'text-red-600',
    builtin: 'text-purple-600',
    cdata: 'text-gray-600',
    char: 'text-green-600',
    class: 'text-blue-600',
    'class-name': 'text-blue-600',
    comment: 'text-gray-600',
    constant: 'text-red-600',
    deleted: 'text-red-600',
    doctype: 'text-gray-600',
    entity: 'text-yellow-600',
    function: 'text-purple-600',
    important: 'text-red-600',
    inserted: 'text-green-600',
    keyword: 'text-purple-600',
    namespace: 'text-blue-600',
    number: 'text-red-600',
    operator: 'text-gray-800',
    prolog: 'text-gray-600',
    property: 'text-blue-600',
    punctuation: 'text-gray-800',
    regex: 'text-green-600',
    selector: 'text-blue-600',
    string: 'text-green-600',
    symbol: 'text-red-600',
    tag: 'text-red-600',
    url: 'text-blue-600',
    variable: 'text-red-600',
  },
  link: 'text-blue-600 underline hover:text-blue-800',
  table: 'table-auto w-full border-collapse border border-gray-300',
  tableCell: 'border border-gray-300 px-2 py-1',
  tableCellHeader: 'border border-gray-300 px-2 py-1 bg-gray-100 font-bold',
};

const editorConfig = {
  namespace: 'RichTextEditor',
  theme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    LinkNode,
    AutoLinkNode,
  ],
};

export const RichTextEditor = ({
  value,
  onChange,
  onSave,
  readOnly = false,
  placeholder = 'Enter text here...',
  mode: initialMode = 'view',
  className,
  minHeight = '400px',
  showToolbar = true,
  hideActionButtons = false,
}: RichTextEditorProps) => {
  const [isEditing, setIsEditing] = useState(initialMode === 'edit');
  const [htmlContent, setHtmlContent] = useState<string>(value);

  // Sync htmlContent with value prop changes
  useEffect(() => {
    setHtmlContent(value);
  }, [value]);

  const handleEditorChange = useCallback(
    (editorState: EditorState, editor: any) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        setHtmlContent(html);
        onChange?.(html);
      });
    },
    [onChange]
  );

  const handleSave = useCallback(() => {
    onSave?.(htmlContent);
    setIsEditing(false);
  }, [htmlContent, onSave]);

  const handleCancel = useCallback(() => {
    setHtmlContent(value);
    setIsEditing(false);
  }, [value]);

  const handleViewModeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (link) {
      e.stopPropagation();
      e.preventDefault();
      window.open(link.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!readOnly) {
      setIsEditing(true);
    }
  };

  const convertLegacyMarkdownLinks = (text: string) => {
    if (!text) return '';
    return text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>'
    );
  };

  if (!isEditing && readOnly) {
    return (
      <div
        className={cn(
          'prose prose-sm max-w-none rounded-lg bg-white p-4 text-gray-900',
          className
        )}
        onClick={handleViewModeClick}
        dangerouslySetInnerHTML={{ __html: convertLegacyMarkdownLinks(value) }}
      />
    );
  }

  if (!isEditing) {
    return (
      <div
        className={cn(
          'group relative bg-white hover:bg-gray-100/50 hover:cursor-pointer rounded-lg py-2',
          className
        )}
        onClick={handleViewModeClick}
      >
        <div
          className='prose prose-sm max-w-none text-gray-900'
          dangerouslySetInnerHTML={{
            __html: htmlContent
              ? convertLegacyMarkdownLinks(htmlContent)
              : `<p class="text-gray-400">${placeholder}</p>`,
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className='rounded-lg border bg-white'>
        <LexicalComposer
          initialConfig={{
            ...editorConfig,
          }}
        >
          <HtmlPlugin initialHtml={convertLegacyMarkdownLinks(htmlContent)} />
          {showToolbar && <ToolbarPlugin />}
          <div className='relative'>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className='min-h-[200px] p-4 outline-none'
                  style={{ minHeight }}
                />
              }
              placeholder={
                <div className='absolute top-4 left-4 text-gray-400 pointer-events-none'>
                  {placeholder}
                </div>
              }
              ErrorBoundary={() => <div>Something went wrong!</div>}
            />
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleEditorChange} />
        </LexicalComposer>
      </div>
      {!hideActionButtons && (
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleCancel}
            className='hover:bg-gray-50'
          >
            <X className='mr-1 h-4 w-4' />
            Cancel
          </Button>
          <Button
            type='button'
            size='sm'
            onClick={handleSave}
            className='text-white'
          >
            <Check className='mr-1 h-4 w-4' />
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
