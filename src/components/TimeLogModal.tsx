'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/services/analytics';
import type { DailyTimeLog } from '@/types/analytics';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, CheckSquare, X, Loader2 } from 'lucide-react';

interface TimeLogModalProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  userTimeLogs?: DailyTimeLog[]; // Optional prop to pass existing data
}

const TimeLogModal = ({
  userId,
  userName,
  isOpen,
  onClose,
  startDate,
  endDate,
  userTimeLogs: propUserTimeLogs,
}: TimeLogModalProps) => {
  const [userTimeLogs, setUserTimeLogs] = useState<DailyTimeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTimeLogs = async () => {
      if (isOpen && userId) {
        // If data is passed as prop, use it instead of fetching
        if (propUserTimeLogs && propUserTimeLogs.length > 0) {
          setUserTimeLogs(propUserTimeLogs);
          return;
        }

        // Otherwise fetch from API
        setUserTimeLogs([]);
        try {
          setLoading(true);
          setError(null);

          const response = await analyticsApi.getTimeLogs({
            startDate,
            endDate,
            userId,
            limit: 100,
          });

          // Handle different possible response structures
          let timeLogsData: DailyTimeLog[] = [];

          if (response?.data?.data && Array.isArray(response.data.data)) {
            // Standard API response structure: { data: { data: [...] } }
            timeLogsData = response.data.data;
          } else if (response?.data && Array.isArray(response.data)) {
            // Direct data in response.data
            timeLogsData = response.data;
          } else if (Array.isArray(response)) {
            // Response is directly an array
            timeLogsData = response;
          }

          setUserTimeLogs(timeLogsData);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load time logs';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserTimeLogs();
  }, [isOpen, userId, startDate, endDate, propUserTimeLogs]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUserTimeLogs([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const totalMinutes = userTimeLogs.reduce(
    (sum, log) => sum + log.totalMinutes,
    0
  );
  const totalTasks = userTimeLogs.reduce((sum, log) => sum + log.taskCount, 0);
  const totalSessions = userTimeLogs.reduce(
    (sum, log) =>
      sum + log.timeLogs.reduce((tSum, tl) => tSum + tl.sessions, 0),
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
        <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                {userName}&apos;s Time Logs
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                {new Date(startDate).toLocaleDateString()} -{' '}
                {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
            <Button variant='ghost' onClick={onClose} size='sm' className='p-1'>
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Summary Cards */}
          <div className='p-4 border-b bg-gray-50'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              <Card className='p-3'>
                <div className='flex items-center'>
                  <div className='p-1.5 bg-blue-100 rounded-lg'>
                    <Clock className='h-4 w-4 text-blue-600' />
                  </div>
                  <div className='ml-2'>
                    <p className='text-xs font-medium text-gray-600'>
                      Total Time
                    </p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                    </p>
                  </div>
                </div>
              </Card>

              <Card className='p-3'>
                <div className='flex items-center'>
                  <div className='p-1.5 bg-green-100 rounded-lg'>
                    <CheckSquare className='h-4 w-4 text-green-600' />
                  </div>
                  <div className='ml-2'>
                    <p className='text-xs font-medium text-gray-600'>Tasks</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {totalTasks}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className='p-3'>
                <div className='flex items-center'>
                  <div className='p-1.5 bg-purple-100 rounded-lg'>
                    <Calendar className='h-4 w-4 text-purple-600' />
                  </div>
                  <div className='ml-2'>
                    <p className='text-xs font-medium text-gray-600'>
                      Sessions
                    </p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {totalSessions}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Time Logs Content */}
          <div className='p-4 max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
                <span className='ml-2 text-gray-600'>Loading time logs...</span>
              </div>
            ) : error ? (
              <div className='flex items-center justify-center py-8'>
                <div className='text-center'>
                  <p className='text-red-600 mb-4'>{error}</p>
                  <Button
                    onClick={() => {
                      setError(null);
                      // Trigger refetch by updating a dependency
                      const fetchUserTimeLogs = async () => {
                        try {
                          setLoading(true);
                          setError(null);
                          const response = await analyticsApi.getTimeLogs({
                            startDate,
                            endDate,
                            userId,
                            limit: 100,
                          });
                          setUserTimeLogs(response.data.data);
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : 'Failed to load time logs'
                          );
                        } finally {
                          setLoading(false);
                        }
                      };
                      fetchUserTimeLogs();
                    }}
                    size='sm'
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : userTimeLogs.length > 0 ? (
              <div className='space-y-4'>
                {userTimeLogs
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((dayLog, dayIndex) => (
                    <Card key={dayIndex} className='p-4'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-gray-100 rounded-lg'>
                            <Calendar className='h-4 w-4 text-gray-600' />
                          </div>
                          <div>
                            <h3 className='font-semibold text-gray-900'>
                              {new Date(dayLog.date).toLocaleDateString(
                                undefined,
                                {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {dayLog.taskCount} tasks worked
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold text-gray-900'>
                            {Math.floor(dayLog.totalMinutes / 60)}h{' '}
                            {dayLog.totalMinutes % 60}m
                          </p>
                          <p className='text-sm text-gray-600'>
                            {dayLog.timeLogs.reduce(
                              (sum, tl) => sum + tl.sessions,
                              0
                            )}{' '}
                            sessions
                          </p>
                        </div>
                      </div>

                      {/* Task breakdown for the day */}
                      <div className='space-y-2'>
                        {dayLog.timeLogs.map((taskLog, taskIndex) => (
                          <div
                            key={taskIndex}
                            className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                          >
                            <div className='flex-1'>
                              <p className='font-medium text-gray-900 truncate'>
                                {taskLog.taskTitle}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {taskLog.sessions} sessions
                              </p>
                            </div>
                            <div className='text-right ml-4'>
                              <p className='font-medium text-gray-900'>
                                {Math.floor(taskLog.minutes / 60)}h{' '}
                                {taskLog.minutes % 60}m
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                  <Clock className='h-8 w-8 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No Time Logs Found
                </h3>
                <p className='text-gray-600'>
                  No time tracking data available for {userName} in the selected
                  date range.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='p-4 border-t bg-gray-50'>
            <div className='flex justify-end'>
              <Button onClick={onClose} size='sm'>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TimeLogModal;
