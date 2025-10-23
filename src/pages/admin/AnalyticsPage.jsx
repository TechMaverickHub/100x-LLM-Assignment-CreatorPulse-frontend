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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  Calendar,
  BarChart3,
  RefreshCw,
  Mail,
  CheckCircle,
  XCircle,
  Globe,
  BookOpen
} from 'lucide-react';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    dailyRegistrations: { date: [], count: [] },
    activeUsers: { date: [], count: [] },
    usersPerTopic: { topic: [], count: [] },
    dailyEmailCount: { date: [], count: [] },
    emailStatusBreakdown: { success: 0, failure: 0 },
    sourcesByTopic: { topic: [], count: [] },
    topTopics: { topic: [], count: [] }
  });
  const [loading, setLoading] = useState({
    dailyRegistrations: false,
    activeUsers: false,
    usersPerTopic: false,
    dailyEmailCount: false,
    emailStatusBreakdown: false,
    sourcesByTopic: false,
    topTopics: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    await Promise.all([
      fetchDailyRegistrations(),
      fetchActiveUsers(),
      fetchUsersPerTopic(),
      fetchDailyEmailCount(),
      fetchEmailStatusBreakdown(),
      fetchSourcesByTopic(),
      fetchTopTopics()
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

  const fetchDailyEmailCount = async () => {
    setLoading(prev => ({ ...prev, dailyEmailCount: true }));
    try {
      const response = await analyticsService.getDailyEmailCount();
      setAnalyticsData(prev => ({
        ...prev,
        dailyEmailCount: response.results
      }));
    } catch (err) {
      console.error('Error fetching daily email count:', err);
      setError('Failed to fetch daily email count data');
    } finally {
      setLoading(prev => ({ ...prev, dailyEmailCount: false }));
    }
  };

  const fetchEmailStatusBreakdown = async () => {
    setLoading(prev => ({ ...prev, emailStatusBreakdown: true }));
    try {
      const response = await analyticsService.getEmailStatusBreakdown();
      setAnalyticsData(prev => ({
        ...prev,
        emailStatusBreakdown: response.results
      }));
    } catch (err) {
      console.error('Error fetching email status breakdown:', err);
      setError('Failed to fetch email status breakdown data');
    } finally {
      setLoading(prev => ({ ...prev, emailStatusBreakdown: false }));
    }
  };

  const fetchSourcesByTopic = async () => {
    setLoading(prev => ({ ...prev, sourcesByTopic: true }));
    try {
      const response = await analyticsService.getSourcesByTopic();
      setAnalyticsData(prev => ({
        ...prev,
        sourcesByTopic: response.results
      }));
    } catch (err) {
      console.error('Error fetching sources by topic:', err);
      setError('Failed to fetch sources by topic data');
    } finally {
      setLoading(prev => ({ ...prev, sourcesByTopic: false }));
    }
  };

  const fetchTopTopics = async () => {
    setLoading(prev => ({ ...prev, topTopics: true }));
    try {
      const response = await analyticsService.getTopTopics();
      setAnalyticsData(prev => ({
        ...prev,
        topTopics: response.results
      }));
    } catch (err) {
      console.error('Error fetching top topics:', err);
      setError('Failed to fetch top topics data');
    } finally {
      setLoading(prev => ({ ...prev, topTopics: false }));
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

  // Email/Newsletter Analytics Data
  const dailyEmailCountData = analyticsData.dailyEmailCount.date?.map((date, index) => ({
    date: formatDate(date),
    fullDate: date,
    count: analyticsData.dailyEmailCount.count[index] || 0
  })) || [];

  const emailStatusData = [
    { name: 'Success', value: analyticsData.emailStatusBreakdown.success || 0, color: '#10B981' },
    { name: 'Failure', value: analyticsData.emailStatusBreakdown.failure || 0, color: '#EF4444' }
  ];

  // Topic & Source Analytics Data
  const sourcesByTopicData = analyticsData.sourcesByTopic.topic?.map((topic, index) => ({
    topic,
    count: analyticsData.sourcesByTopic.count[index] || 0
  })) || [];

  const topTopicsData = analyticsData.topTopics.topic?.map((topic, index) => ({
    topic,
    count: analyticsData.topTopics.count[index] || 0
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Emails Sent Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dailyEmailCountData.reduce((sum, item) => sum + item.count, 0)}
                </p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Sources Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sourcesByTopicData.reduce((sum, item) => sum + item.count, 0)}
                </p>
                <p className="text-xs text-gray-500">Across all topics</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-purple-600" />
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

        {/* Email/Newsletter Analytics Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Email/Newsletter Analytics</h2>
            <p className="mt-1 text-gray-600">Email delivery and newsletter performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Emails Sent Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Newsletters Sent Per Day</h3>
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              {loading.dailyEmailCount ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyEmailCountData}>
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
                      stroke="#F97316" 
                      strokeWidth={3}
                      dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#F97316', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Email Status Breakdown Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Success vs Failure</h3>
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              {loading.emailStatusBreakdown ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emailStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emailStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Topic & Source Analytics Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Topic & Source Analytics</h2>
            <p className="mt-1 text-gray-600">Content sources and topic distribution insights</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sources by Topic Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sources Added Per Topic</h3>
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              {loading.sourcesByTopic ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourcesByTopicData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill="#06B6D4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top Topics by User Subscriptions Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Topics by User Subscriptions</h3>
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              {loading.topTopics ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topTopicsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill="#EC4899"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
