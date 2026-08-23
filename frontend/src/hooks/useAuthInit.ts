/**
 * useAuthInit - Restore auth from localStorage on app load
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAuthenticated, logout } from '../store/slices/authSlice';
import TokenManager from '../utils/tokenManager';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent running multiple times
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    // If already authenticated, don't reinitialize
    if (isAuthenticated) {
      return;
    }

    // Try to restore auth from localStorage
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);

        // Check if token is expired
        if (!TokenManager.isTokenExpired(storedToken)) {
          // Token is still valid, restore auth state
          dispatch(
            setAuthenticated({
              user,
              token: storedToken,
            })
          );
        } else {
          // Token expired, clear it
          TokenManager.clearAuth();
          dispatch(logout());
        }
      }
    } catch (error) {
      console.error('Error restoring auth:', error);
      // Clear auth on any error
      TokenManager.clearAuth();
      dispatch(logout());
    }
  }, [dispatch, isAuthenticated]);
};

export default useAuthInit;
