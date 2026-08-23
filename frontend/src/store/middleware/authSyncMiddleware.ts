import { Middleware } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import TokenManager from '../../utils/tokenManager';
import { setAuthenticated, logout } from '../slices/authSlice';

export const authSyncMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (setAuthenticated.match(action)) {
    TokenManager.saveAuthData(action.payload.token, action.payload.user);
  }

  if (logout.match(action)) {
    TokenManager.clearAuth();
  }

  if (action.type === REHYDRATE) {
    const auth = action.payload?.auth;
    if (auth?.token && auth?.user && auth?.isAuthenticated) {
      if (!TokenManager.isTokenExpired(auth.token)) {
        TokenManager.saveAuthData(auth.token, auth.user);
      }
    }
  }

  return result;
};
