import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTopics } from '../store/topicSlice.js';
import { BookOpen, Newspaper, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { userTopics, loading } = useSelector(state => state.topics);

  useEffect(() => {
    dispatch(fetchUserTopics());
  }, [dispatch]);

  const stats = [
    {
      name: 'Selected Topics',
      value: userTopics.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Newsletters Received',
      value: '12',
      icon: Newspaper,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Reading Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your AI newsletter today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
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
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Topics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Topics</h2>
            <Link
              to="/topics"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Manage
            </Link>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : userTopics.length > 0 ? (
              <div className="space-y-2">
                {userTopics.slice(0, 3).map((topic) => (
                  <div key={topic.id} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    {topic.name}
                  </div>
                ))}
                {userTopics.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{userTopics.length - 3} more topics
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No topics selected yet. <Link to="/topics" className="text-primary-600 hover:text-primary-500">Choose your interests</Link>
              </div>
            )}
          </div>
        </div>

        {/* Latest Newsletter */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Latest Newsletter</h2>
            <Link
              to="/newsletter"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View All
            </Link>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              Today's AI insights and updates
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                • Machine Learning breakthroughs this week
              </div>
              <div className="text-sm text-gray-600">
                • New AI tools and frameworks
              </div>
              <div className="text-sm text-gray-600">
                • Industry trends and analysis
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/newsletter"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Read Newsletter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section (if superadmin) */}
      {user?.role === 'superadmin' && (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Admin Panel</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Manage content sources and system settings.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/admin/sources"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Manage Sources
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
