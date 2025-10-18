import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const sourceService = {
  // Get all sources with pagination and filters (admin only)
  getSources: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    
    // Add filter params
    if (params.name) queryParams.append('name', params.name);
    if (params.url) queryParams.append('url', params.url);
    if (params.sourceType) queryParams.append('source_type', params.sourceType);
    if (params.topic) queryParams.append('topic', params.topic);
    if (params.isActive !== undefined && params.isActive !== '') {
      // Convert to capitalized boolean string for API
      const boolValue = params.isActive === 'true' ? 'True' : 'False';
      queryParams.append('is_active', boolValue);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ROUTES.SOURCE_LIST_FILTER}?${queryString}` : API_ROUTES.SOURCE_LIST_FILTER;
    
    const response = await api.get(url);
    return response.data;
  },

  // Create new source (admin only)
  createSource: async (sourceData) => {
    const response = await api.post(API_ROUTES.SOURCE_CREATE, sourceData);
    return response.data;
  },

  // Update source (admin only)
  updateSource: async (id, sourceData) => {
    const response = await api.put(`${API_ROUTES.ADMIN_SOURCES}${id}/`, sourceData);
    return response.data;
  },

  // Delete source (admin only)
  deleteSource: async (id) => {
    const response = await api.delete(`${API_ROUTES.ADMIN_SOURCES}${id}/`);
    return response.data;
  },

  // Get user sources with filtering and pagination
  getUserSources: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    
    // Add filter params
    if (params.name) queryParams.append('name', params.name);
    if (params.url) queryParams.append('url', params.url);
    if (params.sourceType) queryParams.append('source_type', params.sourceType);
    if (params.topic) queryParams.append('topic', params.topic);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ROUTES.USER_SOURCES}?${queryString}` : API_ROUTES.USER_SOURCES;
    
    const response = await api.get(url);
    return response.data;
  }
};
