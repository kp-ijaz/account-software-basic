/**
 * useAuthInit - Initialize authentication state on app load
 * Restores login from localStorage if token is still valid
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAuthenticated, logout, setLoading } from '../store/slices/authSlice';
import TokenManager from '../utils/tokenManager';
import authService from '../services/authService';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Prevent running multiple times
      if (hasInitialized.current) {
        return;
      }
      hasInitialized.current = true;

      // If already has token and authenticated from Redux, skip
      if (isAuthenticated && token) {
        return;
      }

      try {
        // Set loading state
        dispatch(setLoading(true));

        // Check localStorage for token (redux-persist might not have hydrated yet)
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (!storedToken) {
          // No token in storage, make sure Redux state is cleared
          dispatch(logout());
          dispatch(setLoading(false));
          return;
        }

        // Token exists in localStorage, validate it
        if (TokenManager.isTokenExpired(storedToken)) {
          // Token is expired, clear everything
          TokenManager.clearAuth();
          dispatch(logout());
          dispatch(setLoading(false));
          return;
        }

        // Token is not expired, try to validate with backend
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            // Token is valid, restore auth state
            const parsedUser = storedUser ? JSON.parse(storedUser) : currentUser;
            dispatch(
              setAuthenticated({
                user: parsedUser,
                token: storedToken,
              })
            );
          }
        } catch (error) {
          // Backend validation failed (might be 401), clear auth
          console.warn('Token validation failed:', error);
          TokenManager.clearAuth();
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        TokenManager.clearAuth();
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated, token]);
};

export default useAuthInit;
