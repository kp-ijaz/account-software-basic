import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DashboardSummary,
  DashboardTransaction,
  DashboardChartData,
  CategoryBreakdown,
  DashboardState,
} from '../../types/dashboard';

const initialState: DashboardState = {
  summary: null,
  recentTransactions: [],
  monthlyData: [],
  incomeBreakdown: [],
  expenseBreakdown: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setDashboardData: (
      state,
      action: PayloadAction<{
        summary: DashboardSummary;
        recentTransactions: DashboardTransaction[];
        monthlyData: DashboardChartData[];
        incomeBreakdown: CategoryBreakdown[];
        expenseBreakdown: CategoryBreakdown[];
      }>
    ) => {
      state.summary = action.payload.summary;
      state.recentTransactions = action.payload.recentTransactions;
      state.monthlyData = action.payload.monthlyData;
      state.incomeBreakdown = action.payload.incomeBreakdown;
      state.expenseBreakdown = action.payload.expenseBreakdown;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    reset: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setDashboardData,
  clearError,
  reset,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
