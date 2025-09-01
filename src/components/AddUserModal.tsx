'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  bulkCreateUsers,
  selectBulkUserLoading,
  selectLastBulkUserResult,
} from '@/store/slices/admin';
import { fetchUsers } from '@/store/slices/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { apiError, apiSuccess } from '@/util/toast';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal = ({ open, onOpenChange }: AddUserModalProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectBulkUserLoading);
  const lastResult = useAppSelector(selectLastBulkUserResult);

  const [users, setUsers] = useState<UserFormData[]>([
    { firstName: '', lastName: '', email: '', password: '', isAdmin: false },
  ]);

  const addUser = () => {
    setUsers([
      ...users,
      { firstName: '', lastName: '', email: '', password: '', isAdmin: false },
    ]);
  };

  const removeUser = (index: number) => {
    if (users.length > 1) {
      setUsers(users.filter((_, i) => i !== index));
    }
  };

  const updateUser = (
    index: number,
    field: keyof UserFormData,
    value: string | boolean
  ) => {
    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], [field]: value };
    setUsers(updatedUsers);
  };

  const validateForm = () => {
    return users.every(
      user =>
        user.firstName.trim() &&
        user.lastName.trim() &&
        user.email.trim() &&
        user.password.trim() &&
        user.email.includes('@')
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      apiError('Please fill in all fields with valid data');
      return;
    }

    try {
      const result = await dispatch(bulkCreateUsers({ users })).unwrap();

      if (result.data.summary.successful > 0) {
        apiSuccess(result.data.message);
        // No need to fetch users - Redux state is updated automatically

        if (result.data.summary.failed === 0) {
          onOpenChange(false);
          setUsers([
            {
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              isAdmin: false,
            },
          ]);
        }
      }

      if (result.data.failed.length > 0) {
        apiError(`Some users failed to create. Check the results below.`);
      }
    } catch (error) {
      apiError('Failed to create users');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setUsers([
      { firstName: '', lastName: '', email: '', password: '', isAdmin: false },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Users className='h-5 w-5' />
            <span>Add New Users</span>
          </DialogTitle>
          <DialogDescription>
            Create multiple users at once. Each user will receive login
            credentials via email.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {users.map((user, index) => (
            <Card key={index} className='p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-medium text-gray-700'>
                  User {index + 1}
                </h3>
                {users.length > 1 && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => removeUser(index)}
                    className='text-red-600 border-red-200 hover:bg-red-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor={`firstName-${index}`}>First Name</Label>
                  <Input
                    id={`firstName-${index}`}
                    value={user.firstName}
                    onChange={e =>
                      updateUser(index, 'firstName', e.target.value)
                    }
                    placeholder='John'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                  <Input
                    id={`lastName-${index}`}
                    value={user.lastName}
                    onChange={e =>
                      updateUser(index, 'lastName', e.target.value)
                    }
                    placeholder='Doe'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <Input
                    id={`email-${index}`}
                    type='email'
                    value={user.email}
                    onChange={e => updateUser(index, 'email', e.target.value)}
                    placeholder='john.doe@company.com'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`password-${index}`}>Password</Label>
                  <Input
                    id={`password-${index}`}
                    type='password'
                    value={user.password}
                    onChange={e =>
                      updateUser(index, 'password', e.target.value)
                    }
                    placeholder='Enter password'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`role-${index}`}>Role</Label>
                  <Select
                    value={user.isAdmin.toString()}
                    onValueChange={value =>
                      updateUser(index, 'isAdmin', value === 'true')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='false'>Regular User</SelectItem>
                      <SelectItem value='true'>Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type='button'
            variant='outline'
            onClick={addUser}
            className='w-full border-dashed border-2'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Another User
          </Button>

          {lastResult && (
            <Card className='p-4 bg-gray-50'>
              <h4 className='font-medium text-gray-900 mb-2'>
                Last Creation Result
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <span className='text-green-700'>
                    Successfully created: {lastResult.data.summary.successful}
                  </span>
                </div>
                {lastResult.data.summary.failed > 0 && (
                  <div className='flex items-center space-x-2'>
                    <AlertCircle className='h-4 w-4 text-red-600' />
                    <span className='text-red-700'>
                      Failed: {lastResult.data.summary.failed}
                    </span>
                  </div>
                )}
                {lastResult.data.failed.map((failure, index) => (
                  <div key={index} className='ml-6 text-red-600'>
                    {failure.email}: {failure.error}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className='flex justify-end space-x-2 pt-4 border-t'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !validateForm()}>
            {loading
              ? 'Creating...'
              : `Create ${users.length} User${users.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
