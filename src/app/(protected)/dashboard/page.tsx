import type { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';
import { cookies } from 'next/headers';
import { app } from '@/lib/constants';
import { Task, TasksResponseData } from '@/types/task';
import { APIResponse } from '@/types/api';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default async function DashboardPage() {
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
      next: { revalidate: 0 }, // no-store equivalent to always fetch fresh data
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
