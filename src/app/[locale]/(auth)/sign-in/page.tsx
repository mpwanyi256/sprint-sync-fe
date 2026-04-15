import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Login from '@/components/Login';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Sprint Sync',
};

export default async function SignInPage(props: SignInPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <Login />;
}
