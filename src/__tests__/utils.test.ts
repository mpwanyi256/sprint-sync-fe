import { cn, formatDate, formatTime, findTaskInColumns } from '@/lib/utils';
import { TaskState } from '@/types/task';
import { mockTask } from './test-utils';

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('merges classnames correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500', 'hover:text-green-500');
      expect(result).toBe('text-red-500 bg-blue-500 hover:text-green-500');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });
  });

  describe('formatDate function', () => {
    it('formats date correctly', () => {
      const testDate = '2023-12-25T10:30:00Z';
      const result = formatDate(testDate);
      expect(result).toMatch(/December 25, 2023/);
    });
  });

  describe('formatTime function', () => {
    it('formats time correctly', () => {
      const testDate = '2023-12-25T10:30:00Z';
      const result = formatTime(testDate);
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });
  });

  describe('findTaskInColumns function', () => {
    const mockColumns: TaskState['columns'] = {
      TODO: {
        tasks: [mockTask],
        pagination: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
      },
      IN_PROGRESS: {
        tasks: [],
        pagination: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          itemsPerPage: 10,
          totalItems: 0,
          totalPages: 1,
        },
      },
      DONE: {
        tasks: [],
        pagination: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          itemsPerPage: 10,
          totalItems: 0,
          totalPages: 1,
        },
      },
    };

    it('finds task in correct column', () => {
      const result = findTaskInColumns(mockColumns, mockTask.id);
      expect(result.task).toEqual(mockTask);
      expect(result.columnStatus).toBe('TODO');
      expect(result.taskIndex).toBe(0);
    });

    it('returns null for non-existent task', () => {
      const result = findTaskInColumns(mockColumns, 'non-existent-id');
      expect(result.task).toBeNull();
      expect(result.columnStatus).toBeNull();
      expect(result.taskIndex).toBe(-1);
    });
  });
});
