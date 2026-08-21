import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../services/categoryService';

interface CategoryState {
  incomeCategories: Category[];
  expenseCategories: Category[];
  loading: boolean;
  error: null | string;
}

const initialState: CategoryState = {
  incomeCategories: [],
  expenseCategories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setIncomeCategories: (state, action: PayloadAction<Category[]>) => {
      state.incomeCategories = action.payload;
      state.error = null;
      state.loading = false;
    },

    setExpenseCategories: (state, action: PayloadAction<Category[]>) => {
      state.expenseCategories = action.payload;
      state.error = null;
      state.loading = false;
    },

    addIncomeCategory: (state, action: PayloadAction<Category>) => {
      state.incomeCategories.push(action.payload);
    },

    addExpenseCategory: (state, action: PayloadAction<Category>) => {
      state.expenseCategories.push(action.payload);
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
  setIncomeCategories,
  setExpenseCategories,
  addIncomeCategory,
  addExpenseCategory,
  clearError,
  reset,
} = categorySlice.actions;

export default categorySlice.reducer;
