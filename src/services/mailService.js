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
  },

  // Get newsletter count
  getNewsletterCount: async () => {
    console.log('MailService - getNewsletterCount called');
    console.log('MailService - Using route:', API_ROUTES.MAIL_COUNT);
    const response = await api.get(API_ROUTES.MAIL_COUNT);
    console.log('MailService - Count response:', response.data);
    console.log('MailService - Count from results:', response.data?.results?.count);
    return response.data;
  },

  // Get latest newsletter
  getLatestNewsletter: async () => {
    console.log('MailService - getLatestNewsletter called');
    console.log('MailService - Using route:', API_ROUTES.MAIL_LATEST);
    const response = await api.get(API_ROUTES.MAIL_LATEST);
    console.log('MailService - Latest newsletter response:', response.data);
    return response.data;
  }
};
