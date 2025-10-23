import api from './api.js';

export const draftService = {
  // Get list of all templates with optional filters
  getTemplateList: async (page = 1, pageSize = 20, name = '') => {
    try {
      let url = `/newsletter/template/list-filter?page=${page}&page_size=${pageSize}`;
      if (name) {
        url += `&name=${encodeURIComponent(name)}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching template list:', error);
      throw error;
    }
  },

  // Create a new template (first save with template name)
  createTemplate: async (name, htmlContent) => {
    try {
      const response = await api.post('/newsletter/template', {
        name,
        html_content: htmlContent
      });
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Save a new draft for an existing template
  saveDraft: async (newsletterTemplateId, htmlContent) => {
    try {
      const response = await api.post('/newsletter/draft', {
        newsletter_template_id: newsletterTemplateId,
        html_content: htmlContent
      });
      return response.data;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  },

  // Get all drafts for a template
  getDraftList: async (newsletterTemplateId) => {
    try {
      const response = await api.get(`/newsletter/draft/list?newsletter_template_id=${newsletterTemplateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching draft list:', error);
      throw error;
    }
  },

  // Get a specific draft by ID
  getDraft: async (draftId) => {
    try {
      const response = await api.get(`/newsletter/draft/${draftId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching draft:', error);
      throw error;
    }
  }
};

