'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOptimisticTaskUpdates } from '@/hooks/useOptimisticTaskUpdates';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
  selectUsersPagination,
} from '@/store/slices/users';
import { User as UserType } from '@/types/auth';
import { apiError, apiSuccess } from '@/util/toast';
import { Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const { assignTask, unassignTask } = useOptimisticTaskUpdates();
  const users = useAppSelector(selectUsers);
  const pagination = useAppSelector(selectUsersPagination);
  const loading = useAppSelector(selectUsersLoading);
  const currentUser = useAppSelector(selectUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
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
  }, [fetchUsersData]);

  const filteredUsers = useMemo(() => {
    if (searchQuery.trim() === '') {
      return users;
    }

    const query = searchQuery.toLowerCase();
    return users.filter(
      user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Debounced search with API call
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
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
      const updatedTask = await assignTask(taskId, user);
      onAssigneeChange(updatedTask.assignedTo);
      apiSuccess('Task assigned successfully');
      onClose();
    } catch (error) {
      console.error('Failed to assign task:', error);
      apiError('Failed to assign task');
    }
  };

  const handleRemoveAssignee = async () => {
    try {
      await unassignTask(taskId);
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
    <div className='w-fit bg-white border border-gray-200 rounded-md shadow-md'>
      {/* Search */}
      <div className='p-1.5 border-b border-gray-100'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400' />
          <Input
            placeholder='Unassigned'
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className='h-[32px] pl-8 text-[13px] focus-visible:ring-1 focus-visible:ring-blue-500 rounded border-gray-200 bg-gray-50 focus:bg-white'
            autoFocus
          />
        </div>
      </div>

      {/* Users List */}
      <div className='max-h-[240px] overflow-y-auto py-1'>
        {/* Unassigned Option */}
        <div
          className='px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center space-x-3'
          onClick={handleRemoveAssignee}
        >
          <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-300'>
            <span className='text-[10px] text-gray-400'>?</span>
          </div>
          <div className='flex-1'>
            <p className='text-[13px] text-gray-900'>Unassigned</p>
          </div>
        </div>

        {/* Assign to me */}
        {currentUser &&
          currentAssignee?.id !== currentUser.id &&
          searchQuery.trim() === '' && (
            <div
              className='px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center space-x-3'
              onClick={() => handleUserSelect(currentUser)}
            >
              <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                <span className='text-[10px] font-semibold text-blue-700'>
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </span>
              </div>
              <div className='flex-1'>
                <p className='text-[13px] text-primary'>
                  <span className='text-gray-500'>Assign to me</span>
                </p>
              </div>
            </div>
          )}

        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className='px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center space-x-3'
              onClick={() => handleUserSelect(user)}
            >
              <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                <span className='text-[10px] font-semibold text-gray-600'>
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              <div className='flex-1 truncate'>
                <p className='text-[13px] text-gray-900 truncate'>
                  {user.firstName} {user.lastName}
                </p>
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
