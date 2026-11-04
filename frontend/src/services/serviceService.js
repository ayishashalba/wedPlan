import api from './api';

export const serviceService = {
  getAllServices: async (filters = {}) => {
    try {
      const response = await api.get('/services', { params: filters });
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch services';
      console.warn('Backend services request failed:', message);
      return [];
    }
  },

  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.warn(`Backend service ${id} request failed:`, error.message);
      return null;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Service creation failed';
      throw new Error(message);
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Service update failed';
      throw new Error(message);
    }
  },

  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Service deletion failed';
      throw new Error(message);
    }
  },

  getFeaturedServices: async () => {
    try {
      const response = await api.get('/services/featured');
      return response.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  getAllPackages: async () => {
    try {
      const response = await api.get('/services/packages/all');
      return response.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await api.get(`/services/packages/${id}`);
      return response.data?.data || null;
    } catch (error) {
      return null;
    }
  }
};
