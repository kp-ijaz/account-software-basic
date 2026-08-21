import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditLogEntry, AuditState, AuditLogFilterParams, AuditLogSummary } from '../../types/audit';

const initialState: AuditState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 50,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  summary: null,
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setAuditLogs: (
      state,
      action: PayloadAction<{
        items: AuditLogEntry[];
        total: number;
        page: number;
        pageSize: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.loading = false;
      state.error = null;
    },

    setAuditSummary: (state, action: PayloadAction<AuditLogSummary['data']>) => {
      state.summary = action.payload;
    },

    setFilters: (state, action: PayloadAction<AuditLogFilterParams>) => {
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
  setAuditLogs,
  setAuditSummary,
  setFilters,
  setPage,
  clearError,
  reset,
} = auditSlice.actions;

export default auditSlice.reducer;
