import api from './api';
import { TimeLogResponse, TimeLogFilters } from '@/types/analytics';

export const analyticsApi = {
  getTimeLogs: async (
    filters: TimeLogFilters = {}
  ): Promise<TimeLogResponse> => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/timelogs/daily?${params.toString()}`);
    return response.data;
  },
};
