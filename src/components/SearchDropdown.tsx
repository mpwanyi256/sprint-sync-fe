import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchDropdownProps {
  searchResults: Task[];
  searchLoading: boolean;
  searchTerm: string;
  onTaskClick: (task: Task) => void;
  onClose: () => void;
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'TODO':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DONE':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
};

const SearchDropdown = ({
  searchResults,
  searchLoading,
  searchTerm,
  onTaskClick,
  onClose,
}: SearchDropdownProps) => {
  if (!searchTerm && !searchLoading) return null;

  return (
    <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
      {searchLoading ? (
        <div className='p-4 text-center text-gray-500'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-2 text-sm'>Searching tasks...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className='py-2'>
          <div className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100'>
            Search Results ({searchResults.length} tasks)
          </div>
          {searchResults.map(task => (
            <div
              key={task.id}
              className='px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0'
              onClick={() => {
                onTaskClick(task);
                onClose();
              }}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1 min-w-0'>
                  <h4 className='text-sm font-medium text-gray-900 truncate'>
                    {task.title}
                  </h4>
                  <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                    {task.description}
                  </p>
                  <div className='flex items-center space-x-4 mt-2'>
                    <Badge
                      className={cn('text-xs', getStatusColor(task.status))}
                    >
                      {getStatusLabel(task.status)}
                    </Badge>
                    <div className='flex items-center text-xs text-gray-500'>
                      <Clock className='h-3 w-3 mr-1' />
                      {task.totalMinutes}m
                    </div>
                    {task.assignedTo && (
                      <div className='flex items-center text-xs text-gray-500'>
                        <User className='h-3 w-3 mr-1' />
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchTerm ? (
        <div className='p-4 text-center text-gray-500'>
          <p className='text-sm'>No tasks found for &quot;{searchTerm}&quot;</p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchDropdown;
