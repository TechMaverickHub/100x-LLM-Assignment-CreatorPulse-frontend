import api from './api.js';
import { API_ROUTES } from '../constants.js';

export const managementService = {
  // Get management dashboard counts (admin only)
  getManagementCounts: async () => {
    const response = await api.get(API_ROUTES.MANAGEMENT_COUNT);
    return response.data;
  }
};
