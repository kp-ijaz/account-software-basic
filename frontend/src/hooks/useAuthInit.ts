/**
 * useAuthInit - Restore and validate auth on app load after redux-persist rehydration
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAuthenticated, logout, setInitialized } from '../store/slices/authSlice';
import TokenManager from '../utils/tokenManager';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    try {
      const storedToken = token ?? TokenManager.getToken();
      const storedUser = user ?? TokenManager.getUser();

      if (storedToken && storedUser) {
        if (TokenManager.isTokenExpired(storedToken)) {
          dispatch(logout());
        } else {
          TokenManager.saveAuthData(storedToken, storedUser);

          if (!isAuthenticated) {
            dispatch(
              setAuthenticated({
                user: storedUser,
                token: storedToken,
              })
            );
          }
        }
      } else if (isAuthenticated) {
        dispatch(logout());
      }
    } catch (error) {
      console.error('Error restoring auth:', error);
      dispatch(logout());
    } finally {
      dispatch(setInitialized(true));
    }
  }, [dispatch, isAuthenticated, token, user]);
};

export default useAuthInit;
