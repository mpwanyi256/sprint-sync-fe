import type { Metadata } from 'next';
import TeamManagement from '@/components/TeamManagement';

export const metadata: Metadata = {
  title: 'Team Management',
  description: 'Team Management',
};

export default function TeamPage() {
  return <TeamManagement />;
}
