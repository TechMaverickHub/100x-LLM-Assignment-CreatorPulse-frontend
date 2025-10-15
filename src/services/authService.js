import api from './api.js';
import { API_ROUTES } from '../constants.js';
import { handleApiError } from '../utils/errorHandler.js';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(API_ROUTES.USER_LOGIN, credentials);
      const { results } = response.data;
      const { access, refresh, user } = results;
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
    // Store individual user fields separately
    if (user) {
      localStorage.setItem('user_first_name', user.first_name || '');
      localStorage.setItem('user_last_name', user.last_name || '');
      localStorage.setItem('user_role_id', user.role.id || '');
    }
      
      return { user, access_token: access, refresh_token: refresh };
    } catch (error) {
      // Handle API error with detail field
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post(API_ROUTES.USER_REGISTER, userData);
      return response.data;
    } catch (error) {
      // Handle API error with detail field
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_first_name');
    localStorage.removeItem('user_last_name');
    localStorage.removeItem('user_role_id');
  },

  // Get current user (from stored data or token)
  getCurrentUser: async () => {
    // Get individual user fields from localStorage
    const first_name = localStorage.getItem('user_first_name');
    const last_name = localStorage.getItem('user_last_name');
    const role_id = localStorage.getItem('user_role_id');
    
    // Check if we have any user data stored
    if (first_name || last_name || role_id) {
      return {
        first_name: first_name || '',
        last_name: last_name || '',
        role_id: role_id || ''
      };
    }
    
    // If no stored user data, return null to force re-login
    return null;
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) throw new Error('No refresh token');
      
      const response = await api.post(API_ROUTES.USER_REFRESH, { refresh: refresh_token });
      const { access } = response.data;
      
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      // Handle API error with detail field
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }
};
