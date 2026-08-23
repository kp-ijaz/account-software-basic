import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, MadrasaSettings } from '../../types/settings';

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
  saveLoading: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setSaveLoading: (state, action: PayloadAction<boolean>) => {
      state.saveLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.saveLoading = false;
    },

    setSettings: (state, action: PayloadAction<MadrasaSettings>) => {
      state.settings = action.payload;
      state.loading = false;
      state.saveLoading = false;
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
  setSaveLoading,
  setError,
  setSettings,
  clearError,
  reset,
} = settingsSlice.actions;

export default settingsSlice.reducer;
