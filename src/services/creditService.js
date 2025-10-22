import api from './api.js';
import { API_ROUTES } from '../constants.js';
import { handleApiError } from '../utils/errorHandler.js';

export const creditService = {
  // Get user's credit information
  getCreditInfo: async () => {
    try {
      const response = await api.get(API_ROUTES.CREDIT_INFO);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }
};
