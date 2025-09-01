'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { assignTaskToUser, unAssignTask } from '@/store/slices/task';
import {
  fetchUsers,
  selectUsers,
  selectUsersPagination,
  selectUsersLoading,
} from '@/store/slices/users';
import { apiSuccess, apiError } from '@/util/toast';
import { User as UserType } from '@/types/auth';

interface AssigneeDropdownProps {
  taskId: string;
  currentAssignee?: any;
  onClose: () => void;
  onAssigneeChange: (user: any) => void;
}

export const AssigneeDropdown = ({
  taskId,
  currentAssignee,
  onClose,
  onAssigneeChange,
}: AssigneeDropdownProps) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const pagination = useAppSelector(selectUsersPagination);
  const loading = useAppSelector(selectUsersLoading);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const fetchUsersData = useCallback(
    async (search = '', pageNum = 1) => {
      try {
        await dispatch(
          fetchUsers({ page: pageNum, limit: 10, search: search.trim() })
        ).unwrap();
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchUsersData('', 1);
    setPage(1);
  }, [fetchUsersData]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        user =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery]);

  // Debounced search with API call
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchUsersData(value, 1);
    }, 500);
  };

  const loadMore = useCallback(() => {
    if (!loading && pagination?.hasNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsersData(searchQuery, nextPage);
    }
  }, [loading, pagination?.hasNextPage, page, searchQuery, fetchUsersData]);

  const handleUserSelect = async (user: UserType) => {
    try {
      await dispatch(assignTaskToUser({ taskId, user })).unwrap();
      onAssigneeChange(user);
      apiSuccess('Task assigned successfully');
      onClose();
    } catch (error) {
      console.error('Failed to assign task:', error);
      apiError('Failed to assign task');
    }
  };

  const handleRemoveAssignee = async () => {
    try {
      await dispatch(unAssignTask({ taskId })).unwrap();
      onAssigneeChange(null);
      apiSuccess('Assignee removed successfully');
      onClose();
    } catch (error) {
      console.error('Failed to remove assignee:', error);
      apiError('Failed to remove assignee');
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='font-semibold text-gray-900'>Select Assignee</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='h-6 w-6 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search users...'
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Current Assignee */}
      {currentAssignee && (
        <div className='p-4 border-b border-gray-200'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Current Assignee
          </h4>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center'>
                <span className='text-sm font-semibold text-blue-700'>
                  {getInitials(
                    currentAssignee.firstName,
                    currentAssignee.lastName
                  )}
                </span>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  {currentAssignee.firstName} {currentAssignee.lastName}
                </p>
                <p className='text-xs text-gray-500'>{currentAssignee.email}</p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemoveAssignee}
              className='h-6 w-6 p-0 text-red-600 hover:bg-red-50'
              title='Remove assignee'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Users List - Fixed height for better UX */}
      <div className='h-64 overflow-y-auto'>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className='p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0'
              onClick={() => handleUserSelect(user)}
            >
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center'>
                  <span className='text-sm font-semibold text-gray-700'>
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : searchQuery.trim() !== '' ? (
          <div className='p-4 text-center text-gray-500'>
            <p className='text-sm'>
              No users found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className='p-4 text-center text-gray-500'>
            <p className='text-sm'>No users available</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className='flex justify-center py-4'>
            <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
          </div>
        )}

        {/* Load more button - only show if not searching */}
        {pagination?.hasNextPage && !loading && searchQuery.trim() === '' && (
          <div className='p-3 border-t border-gray-100'>
            <Button
              onClick={loadMore}
              variant='outline'
              size='sm'
              className='w-full'
            >
              Load More Users
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
