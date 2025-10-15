import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const newsletterService = {
  // Get newsletter by date
  getNewsletterByDate: async (date) => {
    const response = await api.get(`${API_ROUTES.NEWSLETTER_BY_DATE}${date}/`);
    return response.data;
  },

  // Get newsletter history
  getNewsletterHistory: async () => {
    const response = await api.get(API_ROUTES.NEWSLETTER_HISTORY);
    return response.data;
  },

  // Generate newsletter
  generateNewsletter: async () => {
    const response = await api.post(API_ROUTES.NEWSLETTER_GENERATE);
    return response.data;
  }
};
