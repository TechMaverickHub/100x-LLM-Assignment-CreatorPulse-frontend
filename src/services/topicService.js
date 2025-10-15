import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const topicService = {
  // Get all available topics
  getTopics: async () => {
    const response = await api.get(API_ROUTES.TOPICS);
    return response.data;
  },

  // Get user's selected topics
  getUserTopics: async () => {
    const response = await api.get(API_ROUTES.USER_TOPICS);
    return response.data;
  },

  // Update user's topic preferences
  updateUserTopics: async (topicIds) => {
    const response = await api.post(API_ROUTES.USER_TOPICS, { topics: topicIds });
    return response.data;
  }
};
