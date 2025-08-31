'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthenticated } from '@/store/slices/auth';
import { publicRoutes } from '@/lib/constants';
import { getAuthToken } from '@/util/helperFunctions';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  // Handle navigation based on auth state
  useEffect(() => {
    const authToken = getAuthToken();

    if (
      isAuthenticated &&
      user &&
      authToken &&
      publicRoutes.includes(pathname ?? '')
    ) {
      router.push('/dashboard');
    } else if (!isAuthenticated && !publicRoutes.includes(pathname ?? '')) {
      router.push('/');
    }
  }, [isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}
