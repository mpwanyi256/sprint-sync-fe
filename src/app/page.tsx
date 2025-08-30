'use client';

import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/store/slices/auth';
import AppContent from '@/components/AppContent';
import Login from '@/components/Login';

export default function HomePage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Show AppContent if authenticated, Login if not
  if (isAuthenticated && user) {
    return <AppContent />;
  }

  return <Login />;
}
