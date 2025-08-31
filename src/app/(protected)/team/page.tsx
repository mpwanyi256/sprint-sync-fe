'use client';

import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TeamManagement from '@/components/TeamManagement';

export default function TeamPage() {
  const currentUser = useAppSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser?.isAdmin) {
    return null;
  }

  return <TeamManagement />;
}
