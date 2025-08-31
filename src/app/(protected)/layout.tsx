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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar
        onSidebarToggle={toggleSidebar}
        sidebarOpen={sidebarOpen}
        onSearch={handleSearch}
      />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className='lg:ml-64 pt-16'>{children}</main>
    </div>
  );
}
