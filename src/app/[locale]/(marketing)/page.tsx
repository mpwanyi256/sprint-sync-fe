import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Login from '@/components/Login';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sign In',
    description: 'Sign in to Sprint Sync',
  };
}

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <Login />;
}
