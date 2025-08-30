import type { Metadata } from 'next';
import Login from '@/components/Login';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Create a new account',
};

export default function SignupPage() {
  return <Login />;
}
