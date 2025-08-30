import type { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your tasks',
};

export default function DashboardPage() {
  return <Dashboard />;
}
