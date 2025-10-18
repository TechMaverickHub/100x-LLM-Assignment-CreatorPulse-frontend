import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdmin } from '../constants.js';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get role_id from Redux store (check both user.role_id and user.role.pk) or localStorage as fallback
  const roleId = user?.role_id || user?.role?.pk || localStorage.getItem('user_role_id');
  
  if (requireAdmin && !isAdmin(roleId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
