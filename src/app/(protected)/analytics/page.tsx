import type { Metadata } from 'next';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Analytics',
};

const AnalyticsPage = () => {
  return <Analytics />;
};

export default AnalyticsPage;
