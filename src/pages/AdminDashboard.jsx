import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSources } from '../store/sourceSlice.js';
import { fetchUserTopics } from '../store/topicSlice.js';
import { fetchNewsletterCount, fetchLatestNewsletter } from '../store/mailSlice.js';
import { Settings, Users, Globe, BarChart3, Mail, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { sources, loading: sourcesLoading } = useSelector(state => state.sources);
  const { userTopics, loading: topicsLoading } = useSelector(state => state.topics);
  const { totalNewsletterCount, latestNewsletter } = useSelector(state => state.mail);

  useEffect(() => {
    console.log('AdminDashboard - Fetching admin data');
    dispatch(fetchSources());
    dispatch(fetchUserTopics());
    dispatch(fetchNewsletterCount());
    dispatch(fetchLatestNewsletter());
  }, [dispatch]);

  const adminStats = [
    {
      name: 'Total Sources',
      value: sources.length,
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Content sources configured'
    },
    {
      name: 'Active Sources',
      value: sources.filter(source => source.is_active).length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Currently active sources'
    },
    {
      name: 'Total Users',
      value: '1,234', // This would come from an API call in a real app
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Registered users'
    },
    {
      name: 'Newsletters Sent',
      value: totalNewsletterCount || 0,
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Total newsletters generated'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Sources',
      description: 'Add, edit, or remove content sources',
      icon: Globe,
      link: '/admin/sources',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: Users,
      link: '/admin/users',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      title: 'Analytics',
      description: 'View system analytics and reports',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-50 border-gray-200 text-gray-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.first_name} {user?.last_name}! Manage your Creator Pulse system.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm border border-primary-200 rounded-xl">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                    <dd className="text-xs text-gray-500">
                      {stat.description}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${action.color}`}
              >
                <div className="flex items-center">
                  <action.icon className="h-5 w-5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">{action.title}</h3>
                    <p className="text-xs opacity-75">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Newsletter</span>
              <span className="text-sm text-gray-900">
                {latestNewsletter ? new Date(latestNewsletter.created_at).toLocaleDateString() : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sources</span>
              <span className="text-sm text-gray-900">
                {sources.filter(source => source.is_active).length} / {sources.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
            <span className="text-gray-600">System is running normally</span>
            <span className="ml-auto text-gray-400">Just now</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span className="text-gray-600">Latest newsletter generated</span>
            <span className="ml-auto text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
            <span className="text-gray-600">New user registered</span>
            <span className="ml-auto text-gray-400">4 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
