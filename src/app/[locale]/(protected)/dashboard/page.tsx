import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import Dashboard from '@/components/Dashboard';
import { app } from '@/lib/constants';
import type { APIResponse } from '@/types/api';
import type { Task, TasksResponseData } from '@/types/task';

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default async function DashboardPage(props: DashboardPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  let initialTasks: Task[] = [];

  try {
    const res = await fetch(`${app.baseUrl}/api/tasks?limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': app.apiKey,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const data: APIResponse<TasksResponseData> = await res.json();
      initialTasks = data.data?.tasks || [];
    }
  } catch (error) {
    console.error('Failed to fetch initial tasks on server:', error);
  }

  return <Dashboard initialTasks={initialTasks} />;
}
