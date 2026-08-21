import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReportsState, MonthlyReportData, YearlyReportData, BalanceSheetData } from '../../types/reports';

const currentDate = new Date();
const initialState: ReportsState = {
  monthlyReport: null,
  yearlyReport: null,
  balanceSheet: null,
  loading: false,
  error: null,
  selectedMonth: currentDate.getMonth() + 1,
  selectedYear: currentDate.getFullYear(),
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setMonthlyReport: (state, action: PayloadAction<MonthlyReportData['data']>) => {
      state.monthlyReport = action.payload;
      state.loading = false;
      state.error = null;
    },

    setYearlyReport: (state, action: PayloadAction<YearlyReportData['data']>) => {
      state.yearlyReport = action.payload;
      state.loading = false;
      state.error = null;
    },

    setBalanceSheet: (state, action: PayloadAction<BalanceSheetData['data']>) => {
      state.balanceSheet = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
    },

    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
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
  setMonthlyReport,
  setYearlyReport,
  setBalanceSheet,
  setSelectedMonth,
  setSelectedYear,
  clearError,
  reset,
} = reportSlice.actions;

export default reportSlice.reducer;
