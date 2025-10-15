import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSource, updateSource, clearError } from '../store/sourceSlice.js';
import { X } from 'lucide-react';

const SourceForm = ({ source, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.sources);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    source_type: 'website',
    is_active: true
  });

  useEffect(() => {
    if (source) {
      setFormData({
        name: source.name || '',
        description: source.description || '',
        url: source.url || '',
        source_type: source.source_type || 'website',
        is_active: source.is_active !== undefined ? source.is_active : true
      });
    }
  }, [source]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (source) {
        await dispatch(updateSource({ id: source.id, sourceData: formData })).unwrap();
      } else {
        await dispatch(createSource(formData)).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save source:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {source ? 'Edit Source' : 'Add New Source'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Source Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., TechCrunch, MIT News"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this source"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL *
          </label>
          <input
            type="url"
            name="url"
            id="url"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="source_type" className="block text-sm font-medium text-gray-700">
            Source Type
          </label>
          <select
            name="source_type"
            id="source_type"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.source_type}
            onChange={handleChange}
          >
            <option value="website">Website</option>
            <option value="blog">Blog</option>
            <option value="news">News Site</option>
            <option value="academic">Academic Journal</option>
            <option value="social">Social Media</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Active (include in newsletter generation)
          </label>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {source ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            source ? 'Update Source' : 'Create Source'
          )}
        </button>
      </div>
    </form>
  );
};

export default SourceForm;
