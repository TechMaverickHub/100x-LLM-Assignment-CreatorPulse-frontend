import api from './api.js';

export const newsletterService = {
  // Get latest newsletter
  getLatestNewsletter: async () => {
    const response = await api.get('/newsletter/latest/');
    return response.data;
  },

  // Get newsletter by date
  getNewsletterByDate: async (date) => {
    const response = await api.get(`/newsletter/${date}/`);
    return response.data;
  },

  // Get newsletter history
  getNewsletterHistory: async () => {
    const response = await api.get('/newsletter/history/');
    return response.data;
  }
};
