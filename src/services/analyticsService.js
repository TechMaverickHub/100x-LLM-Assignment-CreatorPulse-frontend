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
  },

  // Email/Newsletter Analytics
  // Get daily email count (last 7 days)
  getDailyEmailCount: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_EMAILS_DAILY_COUNT);
    return response.data;
  },

  // Get email status breakdown (success vs failure)
  getEmailStatusBreakdown: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_EMAILS_STATUS_BREAKDOWN);
    return response.data;
  },

  // Topic & Source Analytics
  // Get sources by topic
  getSourcesByTopic: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_SOURCES_BY_TOPIC);
    return response.data;
  },

  // Get top topics by user subscriptions
  getTopTopics: async () => {
    const response = await api.get(API_ROUTES.ANALYTICS_TOPICS_TOP);
    return response.data;
  }
};
