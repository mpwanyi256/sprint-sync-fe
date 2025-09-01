'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
} from '@/store/slices/users';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Crown,
  User as UserIcon,
  Mail,
  Shield,
  ShieldOff,
} from 'lucide-react';
import api from '@/services/api';
import { apiError, apiSuccess } from '@/util/toast';
import { useRouter } from 'next/navigation';
import { selectIsAdmin } from '@/store/slices/auth/authSelectors';

const TeamManagement = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const isAdmin = useAppSelector(selectIsAdmin);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    } else {
      dispatch(fetchUsers({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAdmin, router]);

  const handleToggleAdminStatus = async (
    userId: string,
    currentIsAdmin: boolean
  ) => {
    setUpdatingUsers(prev => new Set(prev).add(userId));

    try {
      await api.patch(`/users/${userId}/admin`, { isAdmin: !currentIsAdmin });
      apiSuccess(
        `User ${currentIsAdmin ? 'removed from' : 'promoted to'} admin successfully`
      );

      // Refresh the users list
      dispatch(fetchUsers({ page: 1, limit: 100 }));
    } catch (error) {
      console.error('Failed to update user admin status:', error);
      apiError('Failed to update user admin status');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getUserDisplayName = (user: User) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const adminUsers = users.filter(user => user.isAdmin);
  const regularUsers = users.filter(user => !user.isAdmin);

  if (loading) {
    return (
      <div className='p-6'>
        <div className='flex items-center justify-center min-h-96'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-gray-600'>Loading team members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center space-x-3'>
        <Users className='h-8 w-8 text-blue-600' />
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Team Management</h1>
          <p className='text-gray-600'>Manage user roles and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Users className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Users</p>
                <p className='text-xl font-bold text-gray-900'>
                  {users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Crown className='h-5 w-5 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Administrators</p>
                <p className='text-xl font-bold text-gray-900'>
                  {adminUsers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <UserIcon className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Regular Users</p>
                <p className='text-xl font-bold text-gray-900'>
                  {regularUsers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Administrators Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Crown className='h-5 w-5 text-purple-600' />
            <span>Administrators ({adminUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {adminUsers.length > 0 ? (
            <div className='space-y-3'>
              {adminUsers.map(user => (
                <div
                  key={user.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-purple-50'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='w-10 h-10 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center'>
                      <span className='text-sm font-bold text-purple-700'>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        {getUserDisplayName(user)}
                      </h3>
                      <div className='flex items-center space-x-2 text-sm text-gray-600'>
                        <Mail className='h-4 w-4' />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <Badge className='bg-purple-100 text-purple-800 border-purple-200'>
                      <Crown className='h-3 w-3 mr-1' />
                      Admin
                    </Badge>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleToggleAdminStatus(user.id, true)}
                    disabled={updatingUsers.has(user.id)}
                    className='border-red-200 text-red-600 hover:bg-red-50'
                  >
                    <ShieldOff className='h-4 w-4 mr-2' />
                    {updatingUsers.has(user.id)
                      ? 'Updating...'
                      : 'Remove Admin'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-8'>
              No administrators found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Regular Users Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <UserIcon className='h-5 w-5 text-green-600' />
            <span>Regular Users ({regularUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {regularUsers.length > 0 ? (
            <div className='space-y-3'>
              {regularUsers.map(user => (
                <div
                  key={user.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center'>
                      <span className='text-sm font-bold text-gray-700'>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        {getUserDisplayName(user)}
                      </h3>
                      <div className='flex items-center space-x-2 text-sm text-gray-600'>
                        <Mail className='h-4 w-4' />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <Badge className='bg-gray-100 text-gray-800 border-gray-200'>
                      <UserIcon className='h-3 w-3 mr-1' />
                      User
                    </Badge>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleToggleAdminStatus(user.id, false)}
                    disabled={updatingUsers.has(user.id)}
                    className='border-green-200 text-green-600 hover:bg-green-50'
                  >
                    <Shield className='h-4 w-4 mr-2' />
                    {updatingUsers.has(user.id) ? 'Updating...' : 'Make Admin'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-8'>
              No regular users found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
