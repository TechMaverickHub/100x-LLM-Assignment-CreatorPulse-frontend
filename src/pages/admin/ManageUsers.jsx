import { useEffect, useState } from 'react';
import { userManagementService } from '../../services/userManagementService.js';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import { Search, Filter, X, Users, Mail, Calendar, Clock, UserCheck, UserX } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1
  });

  // Filter states
  const [filters, setFilters] = useState({
    email: '',
    firstName: '',
    lastName: '',
    isActive: '',
    page: 1,
    pageSize: 8
  });

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    type: 'warning',
    onConfirm: null
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userManagementService.getUsers(filters);
      setUsers(response.results || []);
      setPagination({
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
        currentPage: filters.page,
        totalPages: Math.ceil((response.count || 0) / 8) // Use 8 as page size since API uses size=8
      });
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setFilters({
      ...localFilters,
      page: 1 // Reset to first page when filters change
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      email: '',
      firstName: '',
      lastName: '',
      isActive: '',
      page: 1,
      pageSize: 8
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (timeString) => {
    return timeString || 'Not set';
  };

  const handleActivateUser = (user) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Activate User',
      message: `Are you sure you want to activate ${user.first_name} ${user.last_name}? They will be able to access the system again.`,
      confirmText: 'Activate',
      type: 'info',
      onConfirm: () => confirmActivateUser(user.pk)
    });
  };

  const handleDeactivateUser = (user) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Deactivate User',
      message: `Are you sure you want to deactivate ${user.first_name} ${user.last_name}? They will lose access to the system.`,
      confirmText: 'Deactivate',
      type: 'danger',
      onConfirm: () => confirmDeactivateUser(user.pk)
    });
  };

  const confirmActivateUser = async (userId) => {
    setActionLoading(true);
    try {
      await userManagementService.activateUser(userId);
      // Refresh the user list
      await fetchUsers();
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    } catch (err) {
      setError('Failed to activate user. Please try again.');
      console.error('Error activating user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeactivateUser = async (userId) => {
    setActionLoading(true);
    try {
      await userManagementService.deactivateUser(userId);
      // Refresh the user list
      await fetchUsers();
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    } catch (err) {
      setError('Failed to deactivate user. Please try again.');
      console.error('Error deactivating user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="mt-2 text-gray-600">
                View and manage all registered users
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Email
                </label>
                <input
                  type="text"
                  value={localFilters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder="Enter email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by First Name
                </label>
                <input
                  type="text"
                  value={localFilters.firstName}
                  onChange={(e) => handleFilterChange('firstName', e.target.value)}
                  placeholder="Enter first name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Last Name
                </label>
                <input
                  type="text"
                  value={localFilters.lastName}
                  onChange={(e) => handleFilterChange('lastName', e.target.value)}
                  placeholder="Enter last name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Status
                </label>
                <select
                  value={localFilters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Users</option>
                  <option value="true">Active Users</option>
                  <option value="false">Inactive Users</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-8">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.entries(localFilters).some(([key, filter]) => 
                  key !== 'page' && key !== 'pageSize' && filter && filter !== ''
                )
                  ? 'Try adjusting your filters to see more results.'
                  : 'No users have been registered yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-primary-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Users ({pagination.count})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.pk} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Joined {formatDate(user.created)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            Delivery: {formatTime(user.delivery_time)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Enhanced Status Badge */}
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
                          user.is_active 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {user.is_active ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </div>
                      
                      {/* Enhanced Action Button */}
                      {user.is_active ? (
                        <button
                          onClick={() => handleDeactivateUser(user)}
                          disabled={actionLoading}
                          className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user)}
                          disabled={actionLoading}
                          className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Activate User
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (pagination.next || pagination.previous) && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {users.length > 0 ? ((pagination.currentPage - 1) * 8) + 1 : 0} to {users.length > 0 ? ((pagination.currentPage - 1) * 8) + users.length : 0} of {pagination.count} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.previous}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.next}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          type={confirmationModal.type}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
