import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const analyticsService = {
  // Get daily user registrations (last 7 days)
  getDailyRegistrations: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_DAILY_REGISTRATIONS);
    return response.data;
  },

  // Get active users (logged in last 7 days)
  getActiveUsers: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_ACTIVE_USERS);
    return response.data;
  },

  // Get users per topic
  getUsersPerTopic: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_USERS_PER_TOPIC);
    return response.data;
  }
};
