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

  const normalizedPathname =
    pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const isPublicRoute = publicRoutes.includes(normalizedPathname);

  // Handle navigation based on auth state
  useEffect(() => {
    const authToken = getAuthToken();

    if (isAuthenticated && user && authToken && isPublicRoute) {
      router.push('/dashboard');
    } else if (!isAuthenticated && !isPublicRoute) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isPublicRoute, router, user]);

  return <>{children}</>;
}
