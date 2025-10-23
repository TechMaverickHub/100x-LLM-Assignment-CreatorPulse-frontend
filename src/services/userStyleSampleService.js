import api from './api.js';
import { FULL_API_URLS } from '../constants.js';

export const userStyleSampleService = {
  // Add a new user style sample
  addUserStyleSample: async (text) => {
    try {
      const response = await api.post(FULL_API_URLS.USER_STYLE_SAMPLE, {
        text: text
      });
      return response.data;
    } catch (error) {
      console.error('Error adding user style sample:', error);
      throw error;
    }
  },

  // Get paginated list of user style samples
  getUserStyleSamplesList: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(FULL_API_URLS.USER_STYLE_SAMPLE_LIST, {
        params: {
          page: page,
          page_size: pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user style samples list:', error);
      throw error;
    }
  },

  // Get a specific user style sample by ID
  getUserStyleSample: async (sampleId) => {
    try {
      const response = await api.get(`${FULL_API_URLS.USER_STYLE_SAMPLE_DETAIL}${sampleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user style sample:', error);
      throw error;
    }
  },

  // Update a user style sample
  updateUserStyleSample: async (sampleId, text) => {
    try {
      const response = await api.patch(`${FULL_API_URLS.USER_STYLE_SAMPLE_DETAIL}${sampleId}`, {
        text: text
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user style sample:', error);
      throw error;
    }
  },

  // Delete a user style sample
  deleteUserStyleSample: async (sampleId) => {
    try {
      const response = await api.delete(`${FULL_API_URLS.USER_STYLE_SAMPLE_DETAIL}${sampleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user style sample:', error);
      throw error;
    }
  }
};

export default userStyleSampleService;
