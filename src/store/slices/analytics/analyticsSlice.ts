import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DailyTimeLog,
  TimeLogMetrics,
  TimeLogPagination,
} from '@/types/analytics';

interface AnalyticsState {
  timeLogs: DailyTimeLog[];
  metrics: TimeLogMetrics | null;
  pagination: TimeLogPagination | null;
  loading: boolean;
  error: string | null;
  selectedUserId: string | null;
}

const initialState: AnalyticsState = {
  timeLogs: [],
  metrics: null,
  pagination: null,
  loading: false,
  error: null,
  selectedUserId: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTimeLogs: (state, action: PayloadAction<DailyTimeLog[]>) => {
      state.timeLogs = action.payload;
    },
    setMetrics: (state, action: PayloadAction<TimeLogMetrics>) => {
      state.metrics = action.payload;
    },
    setPagination: (state, action: PayloadAction<TimeLogPagination>) => {
      state.pagination = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    },
    clearAnalytics: state => {
      state.timeLogs = [];
      state.metrics = null;
      state.pagination = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setTimeLogs,
  setMetrics,
  setPagination,
  setSelectedUserId,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
