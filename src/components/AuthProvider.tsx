'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthenticated } from '@/store/slices/auth';
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

  return <>{children}</>;
}
