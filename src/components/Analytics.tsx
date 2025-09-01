'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTimeLogs,
  selectAnalyticsLoading,
  selectAnalyticsError,
  selectUniqueUsers,
  setSelectedUserId,
  selectSelectedUserId,
} from '@/store/slices/analytics';
import { fetchTimeLogs } from '@/store/slices/analytics/analyticsThunks';
import { Button } from '@/components/ui/button';
import {
  Clock,
  RefreshCw,
  Filter,
  Eye,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import TimeLogModal from './TimeLogModal';
import { selectIsAdmin } from '@/store/slices/auth/authSelectors';
import { useRouter } from 'next/navigation';

const Analytics = () => {
  const dispatch = useAppDispatch();
  const timeLogs = useAppSelector(selectTimeLogs);
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);
  const uniqueUsers = useAppSelector(selectUniqueUsers);
  const selectedUserId = useAppSelector(selectSelectedUserId);
  const isAdmin = useAppSelector(selectIsAdmin);
  const router = useRouter();

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<
    string | null
  >(null);

  const loadTimeLogs = useCallback(() => {
    dispatch(
      fetchTimeLogs({
        startDate,
        endDate,
        userId: selectedUserId || undefined,
        limit: 50,
      })
    );
  }, [dispatch, startDate, endDate, selectedUserId]);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    } else {
      loadTimeLogs();
    }
  }, [loadTimeLogs, isAdmin, router]);

  const handleUserFilter = (userId: string) => {
    dispatch(setSelectedUserId(userId === 'all' ? null : userId));
  };

  const handleShowUserDetails = (userId: string) => {
    setSelectedUserForModal(userId);
    setShowUserModal(true);
  };

  // Process user data for the table
  const userTableData = uniqueUsers
    .map(user => {
      const userLogs = timeLogs.filter(log => log.userId === user.id);
      const totalMinutes = userLogs.reduce(
        (sum, log) => sum + log.totalMinutes,
        0
      );
      const totalTasks = userLogs.reduce((sum, log) => sum + log.taskCount, 0);
      const totalSessions = userLogs.reduce(
        (sum, log) =>
          sum +
          log.timeLogs.reduce((sessionSum, tl) => sessionSum + tl.sessions, 0),
        0
      );

      return {
        id: user.id,
        name: user.name,
        totalMinutes,
        totalTasks,
        totalSessions,
        avgMinutesPerTask:
          totalTasks > 0 ? Math.round(totalMinutes / totalTasks) : 0,
      };
    })
    .sort((a, b) => b.totalMinutes - a.totalMinutes);

  // Chart data processing
  const chartColors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
  ];

  // Top 6 users for pie chart
  const topUsersData = userTableData.slice(0, 6).map((user, index) => ({
    name: user.name,
    value: user.totalMinutes,
    color: chartColors[index % chartColors.length],
  }));

  // Daily productivity data
  const dailyData = timeLogs.reduce(
    (
      acc: Record<
        string,
        { date: string; totalMinutes: number; userCount: number }
      >,
      log
    ) => {
      if (!acc[log.date]) {
        acc[log.date] = { date: log.date, totalMinutes: 0, userCount: 0 };
      }
      acc[log.date].totalMinutes += log.totalMinutes;
      acc[log.date].userCount = new Set([
        ...Array.from({ length: acc[log.date].userCount }),
        log.userId,
      ]).size;
      return acc;
    },
    {}
  );

  const productivityChartData = Object.values(dailyData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    }));

  // Task distribution by user for bar chart
  const taskDistributionData = userTableData.slice(0, 8).map(user => ({
    name: user.name
      .split(' ')
      .map(n => n[0])
      .join(''),
    tasks: user.totalTasks,
    hours: Math.round((user.totalMinutes / 60) * 10) / 10,
  }));

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button onClick={loadTimeLogs}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>Analytics</h1>
          <p className='text-sm text-gray-600 mt-1'>
            Track team productivity and time allocation
          </p>
        </div>
        <Button
          onClick={loadTimeLogs}
          disabled={loading}
          size='sm'
          className='text-xs'
        >
          {loading ? (
            <RefreshCw className='h-3 w-3 mr-1 animate-spin' />
          ) : (
            <RefreshCw className='h-3 w-3 mr-1' />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg border border-gray-200 p-3'>
        <div className='flex flex-wrap gap-3 items-end'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-gray-500' />
            <span className='text-sm font-medium text-gray-700'>Filters:</span>
          </div>
          <div className='flex-1 min-w-[140px]'>
            <label className='block text-xs font-medium text-gray-600 mb-1'>
              Start Date
            </label>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>
          <div className='flex-1 min-w-[140px]'>
            <label className='block text-xs font-medium text-gray-600 mb-1'>
              End Date
            </label>
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>
          <div className='flex-1 min-w-[140px]'>
            <label className='block text-xs font-medium text-gray-600 mb-1'>
              User
            </label>
            <select
              value={selectedUserId || 'all'}
              onChange={e => handleUserFilter(e.target.value)}
              className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
            >
              <option value='all'>All Users</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Users Table - Takes 2/3 of the space */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <div className='px-4 py-3 border-b border-gray-200'>
              <h2 className='text-lg font-medium text-gray-900'>
                Team Performance
              </h2>
              <p className='text-sm text-gray-600'>
                {userTableData.length} users •{' '}
                {new Date(startDate).toLocaleDateString()} -{' '}
                {new Date(endDate).toLocaleDateString()}
              </p>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      User
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total Time
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tasks
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Sessions
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Avg/Task
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {userTableData.length > 0 ? (
                    userTableData.map(user => (
                      <tr key={user.id} className='hover:bg-gray-50'>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                              <span className='text-xs font-medium text-blue-700'>
                                {user.name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div className='ml-3'>
                              <div className='text-sm font-medium text-gray-900'>
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <Clock className='h-3 w-3 text-gray-400 mr-1' />
                            <span className='text-sm text-gray-900'>
                              {Math.floor(user.totalMinutes / 60)}h{' '}
                              {user.totalMinutes % 60}m
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <span className='text-sm text-gray-900'>
                            {user.totalTasks}
                          </span>
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <span className='text-sm text-gray-900'>
                            {user.totalSessions}
                          </span>
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <span className='text-sm text-gray-900'>
                            {user.avgMinutesPerTask}m
                          </span>
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleShowUserDetails(user.id)}
                            className='text-xs px-2 py-1 h-auto'
                          >
                            <Eye className='h-3 w-3 mr-1' />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className='px-4 py-8 text-center'>
                        <div className='text-gray-500'>
                          <Clock className='h-8 w-8 mx-auto mb-2 text-gray-300' />
                          <p className='text-sm'>
                            No time tracking data available for the selected
                            period
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts Section - Takes 1/3 of the space */}
        <div className='space-y-4'>
          {/* Summary Stats */}
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center mb-3'>
              <TrendingUp className='h-4 w-4 text-blue-600 mr-2' />
              <h3 className='text-sm font-semibold text-gray-900'>Summary</h3>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-600'>Total Users</span>
                <span className='text-sm font-medium text-gray-900'>
                  {userTableData.length}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-600'>Total Hours</span>
                <span className='text-sm font-medium text-gray-900'>
                  {Math.floor(
                    userTableData.reduce(
                      (sum, user) => sum + user.totalMinutes,
                      0
                    ) / 60
                  )}
                  h
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-600'>Total Tasks</span>
                <span className='text-sm font-medium text-gray-900'>
                  {userTableData.reduce(
                    (sum, user) => sum + user.totalTasks,
                    0
                  )}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-600'>Avg per User</span>
                <span className='text-sm font-medium text-gray-900'>
                  {userTableData.length > 0
                    ? Math.round(
                        userTableData.reduce(
                          (sum, user) => sum + user.totalMinutes,
                          0
                        ) /
                          userTableData.length /
                          60
                      )
                    : 0}
                  h
                </span>
              </div>
            </div>
          </div>

          {/* Time Distribution Pie Chart */}
          {topUsersData.length > 0 && (
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center mb-3'>
                <Users className='h-4 w-4 text-green-600 mr-2' />
                <h3 className='text-sm font-semibold text-gray-900'>
                  Time Distribution
                </h3>
              </div>
              <div className='h-48'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={topUsersData}
                      cx='50%'
                      cy='50%'
                      outerRadius={60}
                      fill='#8884d8'
                      dataKey='value'
                      label={({ percent }) =>
                        `${((percent || 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {topUsersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${Math.floor(value / 60)}h ${value % 60}m`,
                        'Time Logged',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-2 space-y-1'>
                {topUsersData.slice(0, 3).map((user, index) => (
                  <div key={index} className='flex items-center text-xs'>
                    <div
                      className='w-2 h-2 rounded-full mr-2'
                      style={{ backgroundColor: user.color }}
                    ></div>
                    <span className='text-gray-600 truncate'>{user.name}</span>
                  </div>
                ))}
                {topUsersData.length > 3 && (
                  <div className='text-xs text-gray-500'>
                    +{topUsersData.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Daily Productivity Trend */}
          {productivityChartData.length > 0 && (
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center mb-3'>
                <BarChart3 className='h-4 w-4 text-purple-600 mr-2' />
                <h3 className='text-sm font-semibold text-gray-900'>
                  Daily Trend
                </h3>
              </div>
              <div className='h-32'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={productivityChartData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      labelFormatter={value => `Date: ${value}`}
                      formatter={(value: number, name: string) => [
                        name === 'totalMinutes'
                          ? `${Math.floor(value / 60)}h ${value % 60}m`
                          : value,
                        name === 'totalMinutes' ? 'Total Time' : 'Active Users',
                      ]}
                    />
                    <Line
                      type='monotone'
                      dataKey='totalMinutes'
                      stroke='#8B5CF6'
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Task Distribution Bar Chart */}
          {taskDistributionData.length > 0 && (
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center mb-3'>
                <BarChart3 className='h-4 w-4 text-orange-600 mr-2' />
                <h3 className='text-sm font-semibold text-gray-900'>
                  Task Distribution
                </h3>
              </div>
              <div className='h-32'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={taskDistributionData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='name'
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        value,
                        name === 'tasks' ? 'Tasks' : 'Hours',
                      ]}
                    />
                    <Bar dataKey='tasks' fill='#F59E0B' radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Log Modal */}
      {showUserModal && selectedUserForModal && (
        <TimeLogModal
          userId={selectedUserForModal}
          userName={
            uniqueUsers.find(u => u.id === selectedUserForModal)?.name || ''
          }
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUserForModal(null);
          }}
          startDate={startDate}
          endDate={endDate}
          userTimeLogs={timeLogs.filter(
            log => log.userId === selectedUserForModal
          )}
        />
      )}
    </div>
  );
};

export default Analytics;
