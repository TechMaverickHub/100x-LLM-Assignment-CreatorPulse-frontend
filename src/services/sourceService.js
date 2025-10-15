import api from './api.js';

export const sourceService = {
  // Get all sources (admin only)
  getSources: async () => {
    const response = await api.get('/admin/sources/');
    return response.data;
  },

  // Create new source (admin only)
  createSource: async (sourceData) => {
    const response = await api.post('/admin/sources/', sourceData);
    return response.data;
  },

  // Update source (admin only)
  updateSource: async (id, sourceData) => {
    const response = await api.put(`/admin/sources/${id}/`, sourceData);
    return response.data;
  },

  // Delete source (admin only)
  deleteSource: async (id) => {
    const response = await api.delete(`/admin/sources/${id}/`);
    return response.data;
  }
};
