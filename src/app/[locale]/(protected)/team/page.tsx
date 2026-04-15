import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import TeamManagement from '@/components/TeamManagement';

type TeamPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Team Management',
  description: 'Team Management',
};

export default async function TeamPage(props: TeamPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <TeamManagement />;
}
