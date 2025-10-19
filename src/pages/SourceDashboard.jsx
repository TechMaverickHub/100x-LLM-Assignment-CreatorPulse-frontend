import { useState, useEffect } from 'react';
import { sourceService } from '../services/sourceService.js';
import { SOURCE_TYPE_LABELS, TOPIC_LABELS, SOURCE_TYPE_CONSTANTS, TOPIC_CONSTANTS } from '../constants.js';
import { Search, Filter, ExternalLink, Globe, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const SourceDashboard = () => {
  const [sources, setSources] = useState([]);
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
    name: '',
    url: '',
    sourceType: '',
    topic: '',
    page: 1,
    pageSize: 15
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSources();
  }, [filters]);

  const fetchSources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sourceService.getUserSources(filters);
      setSources(response.results || []);
      setPagination({
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
        currentPage: filters.page,
        totalPages: Math.ceil((response.count || 0) / filters.pageSize)
      });
    } catch (err) {
      setError('Failed to fetch sources. Please try again.');
      console.error('Error fetching sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      url: '',
      sourceType: '',
      topic: '',
      page: 1,
      pageSize: 10
    });
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getSourceTypeColor = (sourceTypeName) => {
    const colors = {
      'RSS': 'bg-blue-100 text-blue-800',
      'API': 'bg-green-100 text-green-800',
      'Reddit': 'bg-orange-100 text-orange-800',
      'ArXiv': 'bg-purple-100 text-purple-800',
      'Twitter': 'bg-sky-100 text-sky-800',
      'YouTube': 'bg-red-100 text-red-800',
      'Blog': 'bg-gray-100 text-gray-800'
    };
    return colors[sourceTypeName] || 'bg-gray-100 text-gray-800';
  };

  const getTopicColor = (topicName) => {
    const colors = {
      'AI': 'bg-purple-100 text-purple-800',
      'Blockchain': 'bg-yellow-100 text-yellow-800',
      'Cybersecurity': 'bg-red-100 text-red-800',
      'IoT': 'bg-green-100 text-green-800'
    };
    return colors[topicName] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Source Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Browse and manage your content sources
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
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Enter source name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by URL
              </label>
              <input
                type="text"
                value={filters.url}
                onChange={(e) => handleFilterChange('url', e.target.value)}
                placeholder="Enter URL..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type
              </label>
              <select
                value={filters.sourceType}
                onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {Object.entries(SOURCE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={filters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Topics</option>
                {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Sources Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200">
        {loading ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48"></div>
                </div>
              ))}
            </div>
          </div>
        ) : sources.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sources found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sources.map((source) => (
                <div key={source.pk} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Header with favicon and title */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      {getFaviconUrl(source.url) ? (
                        <img
                          src={getFaviconUrl(source.url)}
                          alt=""
                          className="h-6 w-6 rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Globe className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary-600"
                        >
                          {source.name}
                        </a>
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {getDomainFromUrl(source.url)}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTopicColor(source.topic?.name)}`}>
                      {source.topic?.name}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceTypeColor(source.source_type?.name)}`}>
                      {source.source_type?.name}
                    </span>
                  </div>

                  {/* Description */}
                  {source.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {source.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      <span>Active</span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * filters.pageSize) + 1} to {Math.min(pagination.currentPage * filters.pageSize, pagination.count)} of {pagination.count} sources
              </div>
              <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
};

export default SourceDashboard;
