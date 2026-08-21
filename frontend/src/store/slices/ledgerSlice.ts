import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LedgerEntry, LedgerState, LedgerFilterParams } from '../../types/ledger';

const initialState: LedgerState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 50,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 50,
    sortBy: 'date',
    sortOrder: 'desc',
  },
  openingBalance: 0,
  totalDebit: 0,
  totalCredit: 0,
  closingBalance: 0,
};

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setLedger: (
      state,
      action: PayloadAction<{
        items: LedgerEntry[];
        total: number;
        page: number;
        pageSize: number;
        openingBalance: number;
        totalDebit: number;
        totalCredit: number;
        closingBalance: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.openingBalance = action.payload.openingBalance;
      state.totalDebit = action.payload.totalDebit;
      state.totalCredit = action.payload.totalCredit;
      state.closingBalance = action.payload.closingBalance;
      state.error = null;
      state.loading = false;
    },

    setFilters: (state, action: PayloadAction<LedgerFilterParams>) => {
      state.filters = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      state.filters.page = action.payload;
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
  setLedger,
  setFilters,
  setPage,
  clearError,
  reset,
} = ledgerSlice.actions;

export default ledgerSlice.reducer;
