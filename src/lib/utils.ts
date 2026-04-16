import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Task, TaskState, TaskStatus } from '@/types/task';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const findTaskInColumns = (
  columns: any,
  taskId: string
): {
  task: Task | null;
  columnStatus: TaskStatus | null;
  taskIndex: number;
} => {
  for (const columnStatus of Object.keys(columns)) {
    const statusKey = columnStatus as TaskStatus;
    const column = columns[statusKey];
    const taskIndex = column.tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    if (taskIndex !== -1) {
      return {
        task: column.tasks[taskIndex],
        columnStatus: statusKey,
        taskIndex,
      };
    }
  }
  return { task: null, columnStatus: null, taskIndex: -1 };
};

export const removeTaskFromColumn = (
  columns: TaskState['columns'],
  columnStatus: TaskStatus,
  taskIndex: number
) => {
  if (columns[columnStatus] && taskIndex !== -1) {
    columns[columnStatus].tasks.splice(taskIndex, 1);
    columns[columnStatus].pagination.totalItems -= 1;
  }
};

export const addTaskToColumn = (
  columns: TaskState['columns'],
  columnStatus: TaskStatus,
  task: Task
) => {
  insertTaskIntoColumn(columns, columnStatus, task);
};

export const insertTaskIntoColumn = (
  columns: TaskState['columns'],
  columnStatus: TaskStatus,
  task: Task,
  index = 0
) => {
  if (columns[columnStatus]) {
    columns[columnStatus].tasks.splice(index, 0, task);
    columns[columnStatus].pagination.totalItems += 1;
  }
};

export const upsertTaskInColumns = (
  columns: TaskState['columns'],
  task: Task,
  index?: number
) => {
  const { columnStatus, taskIndex } = findTaskInColumns(columns, task.id);

  if (columnStatus && taskIndex !== -1) {
    removeTaskFromColumn(columns, columnStatus, taskIndex);
  }

  insertTaskIntoColumn(columns, task.status, task, index ?? 0);
};

const URL_OR_MARKDOWN_LINK_REGEX =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/gi;

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const trimTrailingUrlPunctuation = (value: string) => {
  let url = value;
  let trailing = '';

  while (/[),.!?:;]$/.test(url)) {
    const lastChar = url.slice(-1);
    const openParens = (url.match(/\(/g) || []).length;
    const closeParens = (url.match(/\)/g) || []).length;

    if (lastChar === ')' && closeParens <= openParens) {
      break;
    }

    trailing = `${lastChar}${trailing}`;
    url = url.slice(0, -1);
  }

  return { url, trailing };
};

const getUrlLabel = (value: string) => {
  try {
    const parsed = new URL(value);
    const label = `${parsed.host}${parsed.pathname}`.replace(/\/$/, '');
    return label || parsed.host;
  } catch {
    return value.replace(/^https?:\/\//, '');
  }
};

const normalizeHtmlContent = (value: string) =>
  value
    .replace(
      /<a\b[^>]*href=(['"])(https?:\/\/[^'"]+)\1[^>]*>(.*?)<\/a>/gi,
      (_, __, url: string, label: string) =>
        `[${decodeHtmlEntities(label.replace(/<[^>]+>/g, '').trim() || getUrlLabel(url))}](${url})`
    )
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|h[1-6])>/gi, '\n')
    .replace(/<(div|p|li|h[1-6])[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '');

export const normalizeTaskContentLinks = (value: string) => {
  const normalizedHtml = normalizeHtmlContent(value);
  const decoded = decodeHtmlEntities(normalizedHtml)
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ');

  return decoded.replace(
    URL_OR_MARKDOWN_LINK_REGEX,
    (
      match,
      label: string | undefined,
      markdownUrl: string | undefined,
      rawUrl: string | undefined
    ) => {
      if (label && markdownUrl) {
        return `[${label.trim()}](${markdownUrl})`;
      }

      if (!rawUrl) {
        return match;
      }

      const { url, trailing } = trimTrailingUrlPunctuation(rawUrl);
      return `[${getUrlLabel(url)}](${url})${trailing}`;
    }
  );
};

export const extractTaskTextContent = (value: string) =>
  normalizeTaskContentLinks(value)
    .replace(MARKDOWN_LINK_REGEX, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const renderMarkdownLinks = (value: string) => {
  let result = '';
  let lastIndex = 0;

  for (const match of value.matchAll(MARKDOWN_LINK_REGEX)) {
    const [fullMatch, label, url] = match;
    const matchIndex = match.index ?? 0;

    result += escapeHtml(value.slice(lastIndex, matchIndex));
    result += `<a href="${escapeHtml(
      url
    )}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline underline-offset-2 hover:text-blue-700 break-all">${escapeHtml(
      label
    )}</a>`;
    lastIndex = matchIndex + fullMatch.length;
  }

  result += escapeHtml(value.slice(lastIndex));

  return result;
};

export const renderTaskContentHtml = (
  value: string,
  options?: { preserveLineBreaks?: boolean }
) => {
  const preserveLineBreaks = options?.preserveLineBreaks ?? true;
  const normalized = normalizeTaskContentLinks(value);
  const text = preserveLineBreaks
    ? normalized
    : normalized.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

  const lines = text.split('\n');
  return lines
    .map(renderMarkdownLinks)
    .join(preserveLineBreaks ? '<br />' : ' ');
};

export const STATUS_OPTIONS: TaskStatus[] = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
];

export const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'BACKLOG':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'TODO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'IN_REVIEW':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'DONE':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case 'BACKLOG':
      return 'Backlog';
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'IN_REVIEW':
      return 'In Review';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
};
