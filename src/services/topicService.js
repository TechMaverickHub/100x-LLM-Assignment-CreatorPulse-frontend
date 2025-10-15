import api from './api.js';

export const topicService = {
  // Get all available topics
  getTopics: async () => {
    const response = await api.get('/topics/');
    return response.data;
  },

  // Get user's selected topics
  getUserTopics: async () => {
    const response = await api.get('/user/topics/');
    return response.data;
  },

  // Update user's topic preferences
  updateUserTopics: async (topicIds) => {
    const response = await api.post('/user/topics/', { topics: topicIds });
    return response.data;
  }
};
