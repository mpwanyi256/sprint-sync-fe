import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Analytics from '@/components/Analytics';

type AnalyticsPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Analytics',
};

export default async function AnalyticsPage(props: AnalyticsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <Analytics />;
}
