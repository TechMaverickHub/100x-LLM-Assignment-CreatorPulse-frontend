import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const sourceService = {
  // Get all sources (admin only)
  getSources: async () => {
    const response = await api.get(API_ROUTES.ADMIN_SOURCES);
    return response.data;
  },

  // Create new source (admin only)
  createSource: async (sourceData) => {
    const response = await api.post(API_ROUTES.ADMIN_SOURCES, sourceData);
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
  }
};
