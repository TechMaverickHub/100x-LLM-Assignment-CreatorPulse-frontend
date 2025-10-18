import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSources, deleteSource, setEditingSource, clearEditingSource, setFilters, clearFilters, setCurrentPage } from '../../store/sourceSlice.js';
import { topicService } from '../../services/topicService.js';
import { SOURCE_TYPE_CONSTANTS, SOURCE_TYPE_LABELS, TOPIC_LABELS } from '../../constants.js';
import { Plus, Globe, Filter, X } from 'lucide-react';
import SourceForm from '../../components/SourceForm.jsx';
import SourceCard from '../../components/SourceCard.jsx';

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      dispatch(deleteSource(id));
    }
  };

  const handleEdit = (source) => {
    dispatch(setEditingSource(source));
    setShowForm(true);
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

      {/* Sources List */}
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
          <div className="p-6 text-center">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sources</h3>
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
                <SourceCard
                  key={source.pk || source.id}
                  source={source}
                  showActions={true}
                  isAdmin={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && sources.length > 0 && (pagination.next || pagination.previous) && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.count)} of {pagination.count} sources
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
