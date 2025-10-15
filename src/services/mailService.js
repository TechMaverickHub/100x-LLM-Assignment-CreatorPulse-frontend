import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const mailService = {
  // Get paginated list of sent newsletters
  getNewsletterList: async (page = 1, pageSize = 10) => {
    const response = await api.get(`${API_ROUTES.MAIL_USER_LIST}?page=${page}&size=${pageSize}`);
    return response.data;
  },

  // Get newsletter list with search/filter
  getNewsletterListWithFilter: async (params = {}) => {
    console.log('MailService - getNewsletterListWithFilter called with params:', params);
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('size', params.pageSize);
    if (params.status) queryParams.append('status', params.status);
    if (params.email) queryParams.append('email', params.email);
    
    const url = `${API_ROUTES.MAIL_USER_LIST}?${queryParams.toString()}`;
    console.log('MailService - Making request to:', url);
    
    const response = await api.get(url);
    console.log('MailService - Response received:', response.data);
    return response.data;
  }
};
