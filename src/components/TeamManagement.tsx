'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
} from '@/store/slices/users';
import { toggleUserRole, selectRoleToggleLoading } from '@/store/slices/admin';
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
  Plus,
} from 'lucide-react';
import { apiError, apiSuccess } from '@/util/toast';
import { useRouter } from 'next/navigation';
import { selectIsAdmin } from '@/store/slices/auth/authSelectors';
import AddUserModal from './AddUserModal';

const TeamManagement = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const roleToggleLoading = useAppSelector(selectRoleToggleLoading);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [showAddUserModal, setShowAddUserModal] = useState(false);
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
      const result = await dispatch(
        toggleUserRole({
          userId,
          isAdmin: !currentIsAdmin,
        })
      ).unwrap();

      apiSuccess(result.message);
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
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Users className='h-8 w-8 text-blue-600' />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Team Management
            </h1>
            <p className='text-gray-600'>Manage user roles and permissions</p>
          </div>
        </div>
        <Button onClick={() => setShowAddUserModal(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Users
        </Button>
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

      {/* All Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Users className='h-5 w-5 text-blue-600' />
            <span>All Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className='max-h-[calc(100vh-400px)] overflow-y-auto space-y-3'>
              {users.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
                    user.isAdmin ? 'bg-purple-50' : 'bg-gray-50'
                  }`}
                >
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        user.isAdmin
                          ? 'bg-purple-100 border-purple-200'
                          : 'bg-gray-100 border-gray-200'
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          user.isAdmin ? 'text-purple-700' : 'text-gray-700'
                        }`}
                      >
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
                    <Badge
                      className={
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {user.isAdmin ? (
                        <>
                          <Crown className='h-3 w-3 mr-1' />
                          Admin
                        </>
                      ) : (
                        <>
                          <UserIcon className='h-3 w-3 mr-1' />
                          User
                        </>
                      )}
                    </Badge>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      handleToggleAdminStatus(user.id, user.isAdmin)
                    }
                    disabled={updatingUsers.has(user.id) || roleToggleLoading}
                    className={
                      user.isAdmin
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    }
                  >
                    {user.isAdmin ? (
                      <ShieldOff className='h-4 w-4 mr-2' />
                    ) : (
                      <Shield className='h-4 w-4 mr-2' />
                    )}
                    {updatingUsers.has(user.id)
                      ? 'Updating...'
                      : user.isAdmin
                        ? 'Remove Admin'
                        : 'Make Admin'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-8'>No users found</p>
          )}
        </CardContent>
      </Card>

      <AddUserModal
        open={showAddUserModal}
        onOpenChange={setShowAddUserModal}
      />
    </div>
  );
};

export default TeamManagement;
