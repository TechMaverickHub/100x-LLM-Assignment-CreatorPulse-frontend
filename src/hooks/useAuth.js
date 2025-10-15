import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, logout } from '../store/authSlice.js';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  useEffect(() => {
    // Check if we have a token and user data in localStorage
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData && !user) {
      // Initialize user from stored data
      const parsedUser = JSON.parse(userData);
      dispatch({ type: 'auth/loginUser/fulfilled', payload: { user: parsedUser, access_token: token } });
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout
  };
};
