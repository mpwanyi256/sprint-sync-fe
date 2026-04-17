'use client';

import { Button } from '@/components/ui/button';
import { $createCodeNode } from '@lexical/code';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (headingSize === 1) {
          $setBlocksType(selection, () => $createHeadingNode('h1'));
        } else if (headingSize === 2) {
          $setBlocksType(selection, () => $createHeadingNode('h2'));
        } else if (headingSize === 3) {
          $setBlocksType(selection, () => $createHeadingNode('h3'));
        }
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  return (
    <div className='flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2'>
      {/* Undo/Redo */}
      <div className='flex items-center gap-1 mr-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className='h-8 w-8 p-0'
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className='h-8 w-8 p-0'
        >
          <Redo className='h-4 w-4' />
        </Button>
      </div>

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* Headings */}
      <div className='flex items-center gap-1 mr-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => formatHeading(1)}
          className='h-8 px-2'
        >
          <Heading1 className='h-4 w-4 mr-1' />
          H1
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => formatHeading(2)}
          className='h-8 px-2'
        >
          <Heading2 className='h-4 w-4 mr-1' />
          H2
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => formatHeading(3)}
          className='h-8 px-2'
        >
          <Heading3 className='h-4 w-4 mr-1' />
          H3
        </Button>
      </div>

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* Text Formatting */}
      <div className='flex items-center gap-1 mr-2'>
        <Button
          variant={isBold ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className='h-8 w-8 p-0'
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          variant={isItalic ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className='h-8 w-8 p-0'
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          variant={isUnderline ? 'default' : 'ghost'}
          size='sm'
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
          }
          className='h-8 w-8 p-0'
        >
          <Underline className='h-4 w-4' />
        </Button>
        <Button
          variant={isStrikethrough ? 'default' : 'ghost'}
          size='sm'
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }
          className='h-8 w-8 p-0'
        >
          <Strikethrough className='h-4 w-4' />
        </Button>
      </div>

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* Block Formatting */}
      <div className='flex items-center gap-1 mr-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={formatQuote}
          className='h-8 w-8 p-0'
        >
          <Quote className='h-4 w-4' />
        </Button>
        <Button
          variant={isCode ? 'default' : 'ghost'}
          size='sm'
          onClick={formatCode}
          className='h-8 w-8 p-0'
        >
          <Code className='h-4 w-4' />
        </Button>
      </div>

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* Lists */}
      <div className='flex items-center gap-1 mr-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }
          className='h-8 w-8 p-0'
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }
          className='h-8 w-8 p-0'
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
      </div>

      <div className='w-px h-6 bg-gray-300 mx-1' />

      {/* Links */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')}
        className='h-8 w-8 p-0'
      >
        <Link className='h-4 w-4' />
      </Button>
    </div>
  );
}
