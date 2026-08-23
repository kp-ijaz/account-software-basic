import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import TokenManager from '../../utils/tokenManager';
import { setAuthenticated, logout } from '../slices/authSlice';

type RehydrateAction = AnyAction & {
  payload?: {
    auth?: {
      token?: string;
      user?: unknown;
      isAuthenticated?: boolean;
    };
  };
};

export const authSyncMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (setAuthenticated.match(action)) {
    TokenManager.saveAuthData(action.payload.token, action.payload.user);
  }

  if (logout.match(action)) {
    TokenManager.clearAuth();
  }

  if (action.type === REHYDRATE) {
    const rehydrateAction = action as RehydrateAction;
    const auth = rehydrateAction.payload?.auth;

    if (auth?.token && auth?.user && auth?.isAuthenticated) {
      if (!TokenManager.isTokenExpired(auth.token)) {
        TokenManager.saveAuthData(auth.token, auth.user);
      }
    }
  }

  return result;
};
