/**
 * useAuthInit - Initialize authentication state on app load
 * Restores login from localStorage if token is still valid
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAuthenticated, logout } from '../store/slices/authSlice';
import TokenManager from '../utils/tokenManager';
import authService from '../services/authService';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // If already authenticated, don't reinitialize
      if (isAuthenticated) {
        return;
      }

      try {
        // Restore auth from localStorage
        const { token, user } = TokenManager.restoreAuth();

        if (!token) {
          // No valid token found
          return;
        }

        // Token exists and is valid, try to validate with backend
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            // Restore auth state in Redux
            dispatch(
              setAuthenticated({
                user: currentUser,
                token,
              })
            );
          }
        } catch (error) {
          // Failed to validate token with backend, clear auth
          TokenManager.clearAuth();
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        TokenManager.clearAuth();
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);
};

export default useAuthInit;
