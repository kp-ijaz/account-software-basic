/**
 * Initialize auth from persisted Redux state and TokenManager before the app renders.
 */

import { store } from '../store';
import { setAuthenticated, logout, setInitialized } from '../store/slices/authSlice';
import TokenManager from '../utils/tokenManager';

function migrateLegacyPersist() {
  try {
    const legacyRoot = localStorage.getItem('persist:root');
    const currentAuth = localStorage.getItem('persist:auth');

    if (!legacyRoot || currentAuth) {
      return;
    }

    const parsedRoot = JSON.parse(legacyRoot);
    const legacyAuth = parsedRoot.auth ? JSON.parse(parsedRoot.auth) : null;

    if (legacyAuth?.token && legacyAuth?.user) {
      TokenManager.saveAuthData(legacyAuth.token, legacyAuth.user);
      localStorage.setItem(
        'persist:auth',
        JSON.stringify({
          isAuthenticated: legacyAuth.isAuthenticated ?? true,
          user: legacyAuth.user,
          token: legacyAuth.token,
          _persist: { version: -1, rehydrated: true },
        })
      );
    }
  } catch {
    // Ignore migration errors and fall back to TokenManager restore.
  }
}

export function initializeAuthFromStorage() {
  try {
    migrateLegacyPersist();

    const state = store.getState().auth;
    const storedToken = state.token ?? TokenManager.getToken();
    const storedUser = state.user ?? TokenManager.getUser();

    if (storedToken && storedUser && !TokenManager.isTokenExpired(storedToken)) {
      TokenManager.saveAuthData(storedToken, storedUser);

      if (!state.isAuthenticated) {
        store.dispatch(
          setAuthenticated({
            user: storedUser,
            token: storedToken,
          })
        );
      }
    } else if (state.isAuthenticated || storedToken) {
      store.dispatch(logout());
    }
  } catch (error) {
    console.error('Error restoring auth:', error);
    store.dispatch(logout());
  } finally {
    store.dispatch(setInitialized(true));
  }
}

export default initializeAuthFromStorage;
