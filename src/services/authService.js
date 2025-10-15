import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ROUTES.USER_LOGIN, credentials);
    const { results } = response.data;
    const { access, refresh, user } = results;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return { user, access_token: access, refresh_token: refresh };
  },

  // Register user
  register: async (userData) => {
    const response = await api.post(API_ROUTES.USER_REGISTER, userData);
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Get current user (from stored data or token)
  getCurrentUser: async () => {
    // Since there's no profile endpoint, we'll get user info from the stored token
    // or return the user data if it's stored in localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      return JSON.parse(userData);
    }
    
    // If no stored user data, we can decode the token to get basic info
    // or return null to force re-login
    return null;
  },

  // Refresh token
  refreshToken: async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error('No refresh token');
    
    const response = await api.post(API_ROUTES.USER_REFRESH, { refresh: refresh_token });
    const { access } = response.data;
    
    localStorage.setItem('access_token', access);
    return access;
  }
};
