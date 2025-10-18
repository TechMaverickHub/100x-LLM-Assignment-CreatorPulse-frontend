import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdmin } from '../constants.js';

const RoleBasedRedirect = () => {
  const { user } = useSelector(state => state.auth);

  // Get role_id from Redux store (check both user.role_id and user.role.pk) or localStorage as fallback
  const roleId = user?.role_id || user?.role?.pk || localStorage.getItem('user_role_id');

  // Redirect based on user role
  if (isAdmin(roleId)) {
    // Role ID 1 (superadmin) - redirect to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    // Role ID 2 (user) - redirect to regular dashboard
    return <Navigate to="/dashboard" replace />;
  }
};

export default RoleBasedRedirect;
