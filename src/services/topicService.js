import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const topicService = {
  // Get all available topics
  getTopics: async () => {
    console.log('TopicService - Fetching topics from:', API_ROUTES.TOPICS_LIST);
    const response = await api.get(API_ROUTES.TOPICS_LIST);
    console.log('TopicService - Topics response:', response.data);
    return response.data;
  },

  // Get user's selected topics
  getUserTopics: async () => {
    console.log('TopicService - Fetching user topics from:', API_ROUTES.USER_TOPICS_LIST);
    const response = await api.get(API_ROUTES.USER_TOPICS_LIST);
    console.log('TopicService - User topics response:', response.data);
    return response.data;
  },

  // Update user's topic preferences
  updateUserTopics: async (topicIds) => {
    console.log('TopicService - Updating user topics with:', topicIds);
    const response = await api.post(API_ROUTES.USER_TOPICS_UPDATE, topicIds);
    console.log('TopicService - Update response:', response.data);
    return response.data;
  }
};
