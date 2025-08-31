import { RootState } from '@/store';

export const selectAnalytics = (state: RootState) => state.analytics;
export const selectTimeLogs = (state: RootState) => state.analytics.timeLogs;
export const selectAnalyticsMetrics = (state: RootState) =>
  state.analytics.metrics;
export const selectAnalyticsPagination = (state: RootState) =>
  state.analytics.pagination;
export const selectAnalyticsLoading = (state: RootState) =>
  state.analytics.loading;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
export const selectSelectedUserId = (state: RootState) =>
  state.analytics.selectedUserId;

export const selectTimeLogsByUser = (state: RootState, userId: string) =>
  state.analytics.timeLogs.filter(log => log.userId === userId);

export const selectUniqueUsers = (state: RootState) => {
  const users = state.analytics.timeLogs.map(log => ({
    id: log.userId,
    name: log.userName,
  }));

  // Remove duplicates based on id
  const uniqueUsers = users.filter(
    (user, index, self) => index === self.findIndex(u => u.id === user.id)
  );

  return uniqueUsers;
};
