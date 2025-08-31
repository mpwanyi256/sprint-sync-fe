'use client';

import { useAppSelector } from '@/store/hooks';
import { selectIsAdmin } from '@/store/slices/auth/authSelectors';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import Analytics from '@/components/Analytics';

const AnalyticsPage = () => {
  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    if (!isAdmin) {
      redirect('/dashboard');
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  return <Analytics />;
};

export default AnalyticsPage;
