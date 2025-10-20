import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService.js';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    dailyRegistrations: { date: [], count: [] },
    activeUsers: { date: [], count: [] },
    usersPerTopic: { topic: [], count: [] }
  });
  const [loading, setLoading] = useState({
    dailyRegistrations: false,
    activeUsers: false,
    usersPerTopic: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    await Promise.all([
      fetchDailyRegistrations(),
      fetchActiveUsers(),
      fetchUsersPerTopic()
    ]);
  };

  const fetchDailyRegistrations = async () => {
    setLoading(prev => ({ ...prev, dailyRegistrations: true }));
    try {
      const response = await analyticsService.getDailyRegistrations();
      setAnalyticsData(prev => ({
        ...prev,
        dailyRegistrations: response.results
      }));
    } catch (err) {
      console.error('Error fetching daily registrations:', err);
      setError('Failed to fetch daily registrations data');
    } finally {
      setLoading(prev => ({ ...prev, dailyRegistrations: false }));
    }
  };

  const fetchActiveUsers = async () => {
    setLoading(prev => ({ ...prev, activeUsers: true }));
    try {
      const response = await analyticsService.getActiveUsers();
      setAnalyticsData(prev => ({
        ...prev,
        activeUsers: response.results
      }));
    } catch (err) {
      console.error('Error fetching active users:', err);
      setError('Failed to fetch active users data');
    } finally {
      setLoading(prev => ({ ...prev, activeUsers: false }));
    }
  };

  const fetchUsersPerTopic = async () => {
    setLoading(prev => ({ ...prev, usersPerTopic: true }));
    try {
      const response = await analyticsService.getUsersPerTopic();
      setAnalyticsData(prev => ({
        ...prev,
        usersPerTopic: response.results
      }));
    } catch (err) {
      console.error('Error fetching users per topic:', err);
      setError('Failed to fetch users per topic data');
    } finally {
      setLoading(prev => ({ ...prev, usersPerTopic: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Transform data for charts
  const dailyRegistrationsData = analyticsData.dailyRegistrations.date?.map((date, index) => ({
    date: formatDate(date),
    fullDate: date,
    count: analyticsData.dailyRegistrations.count[index] || 0
  })) || [];

  const activeUsersData = analyticsData.activeUsers.date?.map((date, index) => ({
    date: formatDate(date),
    fullDate: date,
    count: analyticsData.activeUsers.count[index] || 0
  })) || [];

  const usersPerTopicData = analyticsData.usersPerTopic.topic?.map((topic, index) => ({
    topic,
    count: analyticsData.usersPerTopic.count[index] || 0
  })) || [];

  const refreshData = () => {
    setError(null);
    fetchAllAnalytics();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-gray-600">
                User analytics and insights for the last 7 days
              </p>
            </div>
            <button
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

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

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Daily Registrations Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Registrations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dailyRegistrationsData.reduce((sum, item) => sum + item.count, 0)}
                </p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeUsersData.reduce((sum, item) => sum + item.count, 0)}
                </p>
                <p className="text-xs text-gray-500">Logged in last 7 days</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Topics Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Topics with Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usersPerTopicData.length}
                </p>
                <p className="text-xs text-gray-500">Active topics</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Registrations Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily New Users</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            {loading.dailyRegistrations ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRegistrationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `Date: ${payload[0].payload.fullDate}`;
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Active Users Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            {loading.activeUsers ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activeUsersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `Date: ${payload[0].payload.fullDate}`;
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Users Per Topic Chart - Full Width */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Users Per Topic</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            {loading.usersPerTopic ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={usersPerTopicData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
