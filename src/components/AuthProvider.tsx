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
import { publicRoutes } from '@/lib/constants';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  // Handle navigation based on auth state
  useEffect(() => {
    if (isAuthenticated && user && publicRoutes.includes(pathname ?? '')) {
      router.push('/dashboard');
    } else if (!isAuthenticated && !publicRoutes.includes(pathname ?? '')) {
      router.push('/');
    }
    setIsLoading(false);
  }, [isAuthenticated, user, pathname, router]);

  // if (isLoading) {
  //   return (
  //     <div className='flex items-center justify-center h-screen'>
  //       <Loader2 className='animate-spin' />
  //       <span className='text-sm text-gray-500'>
  //         Checking authentication...
  //       </span>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
