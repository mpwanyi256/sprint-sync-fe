'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar
        onSidebarToggle={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className='pt-16 lg:ml-64'>{children}</main>
    </div>
  );
}
