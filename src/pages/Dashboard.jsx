import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTopics } from '../store/topicSlice.js';
import { fetchNewsletterCount, fetchLatestNewsletter } from '../store/mailSlice.js';
import { isAdmin } from '../constants.js';
import HTMLViewer from '../components/HTMLViewer.jsx';
import { creditService } from '../services/creditService.js';
import { BookOpen, Newspaper, TrendingUp, Users, FileText, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { userTopics, loading } = useSelector(state => state.topics);
  const { totalNewsletterCount, latestNewsletter } = useSelector(state => state.mail);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState(null);

  useEffect(() => {
    console.log('Dashboard - Fetching user topics, newsletter count, and latest newsletter');
    dispatch(fetchUserTopics());
    dispatch(fetchNewsletterCount());
    dispatch(fetchLatestNewsletter());
  }, [dispatch]);

  // Fetch credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setCreditsLoading(true);
        setCreditsError(null);
        const response = await creditService.getCreditInfo();
        setCreditsRemaining(response.results.credit_remaining);
      } catch (err) {
        console.error('Error fetching credits:', err);
        setCreditsError(err.message);
        // Set default credits if API fails
        setCreditsRemaining(100);
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCredits();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard - State updated:', { 
      userTopics: userTopics.length, 
      loading,
      userTopicsData: userTopics
    });
  }, [userTopics, loading]);

  const stats = [
    {
      name: 'Credits Remaining',
      value: creditsLoading ? '...' : creditsError ? 'Error' : creditsRemaining,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Selected Topics',
      value: userTopics.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Newsletters Received',
      value: totalNewsletterCount || 0,
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
          Welcome back, {user?.first_name} {user?.last_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your AI newsletter today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Topics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Your Topics</h2>
            <Link
              to="/topics"
              className="text-xs font-medium text-primary-600 hover:text-primary-500 px-2 py-1 rounded-md hover:bg-primary-50 transition-colors"
            >
              Manage
            </Link>
          </div>
          <div>
            {loading ? (
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-16 flex-shrink-0"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20 flex-shrink-0"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14 flex-shrink-0"></div>
                <div className="h-6 bg-gray-200 rounded-full w-18 flex-shrink-0"></div>
              </div>
            ) : userTopics.length > 0 ? (
              <div className="flex items-center gap-2 overflow-x-auto">
                {userTopics.slice(0, 6).map((userTopic) => (
                  <span
                    key={userTopic.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200 whitespace-nowrap flex-shrink-0"
                  >
                    {userTopic.topic.name}
                  </span>
                ))}
                {userTopics.length > 6 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap flex-shrink-0">
                    +{userTopics.length - 6} more
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
                No topics selected yet. <Link to="/topics" className="text-primary-600 hover:text-primary-500 font-medium">Choose your interests</Link>
              </div>
            )}
          </div>
        </div>

         {/* Latest Newsletter */}
         <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
           <div className="mb-3">
             <h2 className="text-base font-semibold text-gray-900">Latest Newsletter</h2>
           </div>
           <div>
             {latestNewsletter ? (
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <HTMLViewer 
                     htmlContent={latestNewsletter.message} 
                     title="Latest Newsletter Preview"
                   />
                   <Link
                     to="/newsletter/history"
                     className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                   >
                     View All Newsletters
                   </Link>
                 </div>
               </div>
             ) : (
               <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
                 No newsletters available yet.
               </div>
             )}
           </div>
         </div>
      </div>

      {/* User Style Sample Section */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">User Style Sample</h2>
          </div>
          <Link
            to="/user-style-sample"
            className="text-xs font-medium text-primary-600 hover:text-primary-500 px-2 py-1 rounded-md hover:bg-primary-50 transition-colors"
          >
            Manage
          </Link>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
            Add sample text to influence your newsletter style. Help the AI understand your preferred writing tone and style.
          </p>
          <Link
            to="/user-style-sample"
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            <FileText className="h-3 w-3" />
            Add Style Sample
          </Link>
        </div>
      </div>

      {/* Admin Section (if superadmin) */}
      {isAdmin(user?.role_id) && (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Admin Panel</h2>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
              Manage content sources and system settings.
            </p>
            <Link
              to="/admin/sources"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Manage Sources
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
