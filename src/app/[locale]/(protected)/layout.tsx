'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import { useState } from 'react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAppSelector(selectUser);

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
