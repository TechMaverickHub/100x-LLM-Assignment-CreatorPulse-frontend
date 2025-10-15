import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    // Only initialize if we're not already authenticated and not loading
    if (!isAuthenticated && !loading) {
      const token = localStorage.getItem('access_token');
      const first_name = localStorage.getItem('user_first_name');
      const last_name = localStorage.getItem('user_last_name');
      const role_id = localStorage.getItem('user_role_id');
      
      console.log('AuthProvider - Checking localStorage:', { token: !!token, first_name, last_name, role_id });
      
      if (token && (first_name || last_name || role_id)) {
        console.log('AuthProvider - Initializing user from localStorage');
        // Initialize user from stored individual fields
        const userData = {
          first_name: first_name || '',
          last_name: last_name || '',
          role_id: role_id || ''
        };
        dispatch({ type: 'auth/loginUser/fulfilled', payload: { user: userData, access_token: token } });
      }
    }
  }, [dispatch, isAuthenticated, loading]);

  return children;
};

export default AuthProvider;
