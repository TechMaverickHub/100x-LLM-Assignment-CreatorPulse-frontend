import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSources, setEditingSource, clearEditingSource, setFilters, clearFilters, setCurrentPage } from '../../store/sourceSlice.js';
import { topicService } from '../../services/topicService.js';
import { SOURCE_TYPE_CONSTANTS, SOURCE_TYPE_LABELS, TOPIC_LABELS } from '../../constants.js';
import { Plus, Edit, ExternalLink, Globe, Search, Filter, X, CheckCircle, AlertCircle } from 'lucide-react';
import SourceForm from '../../components/SourceForm.jsx';

const SourcesPage = () => {
  const dispatch = useDispatch();
  const { sources, loading, error, editingSource, pagination, filters } = useSelector(state => state.sources);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    dispatch(fetchSources(filters));
  }, [dispatch, filters]);

  // Fetch topics for filter dropdown
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicService.getTopics();
        setTopics(response.results || []);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };
    fetchTopics();
  }, []);


  const handleEdit = async (source) => {
    console.log('Source object for edit:', source);
    const sourceId = source.pk || source.id || source.source_id;
    console.log('Source ID for edit:', sourceId);
    
    if (!sourceId) {
      console.error('No valid source ID found in source object');
      return;
    }
    
    try {
      // Use the source object from the list instead of fetching fresh data
      // This preserves the is_active field which is not returned by the individual source API
      dispatch(setEditingSource(source));
      setShowForm(true);
    } catch (error) {
      console.error('Failed to set editing source:', error);
    }
  };


  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(clearEditingSource());
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(clearEditingSource());
    dispatch(fetchSources(filters));
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(setCurrentPage(1));
  };

  const clearAllFilters = () => {
    setLocalFilters({
      name: '',
      url: '',
      sourceType: '',
      topic: '',
      isActive: ''
    });
    dispatch(clearFilters());
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchSources({ ...filters, page }));
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
            <h1 className="text-2xl font-bold text-gray-900">Content Sources</h1>
            <p className="mt-2 text-gray-600">
              Manage the sources that feed content into your Creator Pulse newsletter.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Sources</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="filter-name"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={localFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Filter by name"
              />
            </div>
            
            <div>
              <label htmlFor="filter-url" className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                id="filter-url"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={localFilters.url}
                onChange={(e) => handleFilterChange('url', e.target.value)}
                placeholder="Filter by URL"
              />
            </div>
            
            <div>
              <label htmlFor="filter-source-type" className="block text-sm font-medium text-gray-700 mb-1">
                Source Type
              </label>
              <select
                id="filter-source-type"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={localFilters.sourceType}
                onChange={(e) => handleFilterChange('sourceType', e.target.value)}
              >
                <option value="">All Types</option>
                {Object.entries(SOURCE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={parseInt(key)}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                id="filter-topic"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={localFilters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-is-active" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="filter-is-active"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={localFilters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Apply Filters
            </button>
          </div>
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
              Get started by adding a new content source.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sources.map((source) => (
                <div key={source.pk || source.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
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

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      {source.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                          <span>Inactive</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(source)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Edit source"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Visit source"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && sources.length > 0 && (pagination.next || pagination.previous) && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {sources.length > 0 ? ((pagination.currentPage - 1) * 8) + 1 : 0} to {sources.length > 0 ? ((pagination.currentPage - 1) * 8) + sources.length : 0} of {pagination.count} sources
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.previous}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
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

      {/* Source Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseForm}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <SourceForm
                source={editingSource}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcesPage;
