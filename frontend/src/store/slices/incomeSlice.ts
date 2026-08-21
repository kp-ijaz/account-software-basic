import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Income, IncomeState, IncomeFilterParams } from '../../types/income';

const initialState: IncomeState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  },
};

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    // Fetch income
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setIncomes: (
      state,
      action: PayloadAction<{
        items: Income[];
        total: number;
        page: number;
        pageSize: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.error = null;
      state.loading = false;
    },

    // Create income
    addIncome: (state, action: PayloadAction<Income>) => {
      state.items.unshift(action.payload);
      state.total += 1;
    },

    // Update income
    updateIncomeItem: (state, action: PayloadAction<Income>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    // Delete income
    removeIncome: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total -= 1;
    },

    // Filters
    setFilters: (state, action: PayloadAction<IncomeFilterParams>) => {
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
  setIncomes,
  addIncome,
  updateIncomeItem,
  removeIncome,
  setFilters,
  setPage,
  clearError,
  reset,
} = incomeSlice.actions;

export default incomeSlice.reducer;
