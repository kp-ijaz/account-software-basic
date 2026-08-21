import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseState, ExpenseFilterParams } from '../../types/expense';

const initialState: ExpenseState = {
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

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    // Fetch expense
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setExpenses: (
      state,
      action: PayloadAction<{
        items: Expense[];
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

    // Create expense
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.unshift(action.payload);
      state.total += 1;
    },

    // Update expense
    updateExpenseItem: (state, action: PayloadAction<Expense>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    // Delete expense
    removeExpense: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total -= 1;
    },

    // Filters
    setFilters: (state, action: PayloadAction<ExpenseFilterParams>) => {
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
  setExpenses,
  addExpense,
  updateExpenseItem,
  removeExpense,
  setFilters,
  setPage,
  clearError,
  reset,
} = expenseSlice.actions;

export default expenseSlice.reducer;
