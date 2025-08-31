import { createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsApi } from '@/services/analytics';
import { TimeLogFilters } from '@/types/analytics';
import {
  setLoading,
  setError,
  setTimeLogs,
  setMetrics,
  setPagination,
} from './analyticsSlice';

export const fetchTimeLogs = createAsyncThunk(
  'analytics/fetchTimeLogs',
  async (filters: TimeLogFilters, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await analyticsApi.getTimeLogs(filters);

      dispatch(setTimeLogs(response.data.data));
      dispatch(setMetrics(response.data.metrics));
      dispatch(setPagination(response.data.pagination));

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch time logs';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
