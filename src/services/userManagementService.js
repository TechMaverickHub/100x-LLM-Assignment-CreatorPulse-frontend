import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const userManagementService = {
  // Get users with filtering and pagination (admin only)
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    // Set page size to 8 users per page
    queryParams.append('size', '8');
    
    // Add filter params
    if (params.email) queryParams.append('email', params.email);
    if (params.firstName) queryParams.append('first_name', params.firstName);
    if (params.lastName) queryParams.append('last_name', params.lastName);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ROUTES.USER_LIST_FILTER}?${queryString}` : API_ROUTES.USER_LIST_FILTER;
    
    const response = await api.get(url);
    return response.data;
  }
};
