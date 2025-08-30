'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCurrentUser,
  selectUser,
  selectIsAuthenticated,
  setAuthenticated,
} from '@/store/slices/auth';
import { Loader2 } from 'lucide-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (token && !user) {
        try {
          setIsLoading(true);
          // Try to fetch current user to validate token
          await dispatch(fetchCurrentUser()).unwrap();
          console.log('AuthProvider - User fetched successfully');
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(setAuthenticated(false));
        } finally {
          setIsLoading(false);
        }
      } else if (!token) {
        // No token, ensure not authenticated
        dispatch(setAuthenticated(false));
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, user]);

  // Handle navigation based on auth state
  useEffect(() => {
    console.log('AuthProvider - Navigation effect:', {
      isAuthenticated,
      user,
      pathname,
    });

    if (isAuthenticated && user && pathname === '/login') {
      // User is authenticated, redirect to dashboard
      console.log(
        'AuthProvider - User is authenticated, redirecting to dashboard'
      );
      router.push('/');
    } else if (!isAuthenticated && pathname !== '/login' && pathname !== '/') {
      // User is not authenticated, redirect to login
      console.log(
        'AuthProvider - User not authenticated, redirecting to login'
      );
      router.push('/login');
    }
  }, [isAuthenticated, user, pathname, router]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='animate-spin' />
        <span className='text-sm text-gray-500'>
          Checking authentication...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
