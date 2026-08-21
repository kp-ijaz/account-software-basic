import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import incomeReducer from './slices/incomeSlice';
import expenseReducer from './slices/expenseSlice';
import dayBookReducer from './slices/dayBookSlice';
import ledgerReducer from './slices/ledgerSlice';
import dashboardReducer from './slices/dashboardSlice';
import reportReducer from './slices/reportSlice';
import auditReducer from './slices/auditSlice';
import settingsReducer from './slices/settingsSlice';
import categoryReducer from './slices/categorySlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    income: incomeReducer,
    expense: expenseReducer,
    daybook: dayBookReducer,
    ledger: ledgerReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
    audit: auditReducer,
    settings: settingsReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
