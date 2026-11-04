import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch admin stats';
      throw new Error(message);
    }
  },

  getAllUsers: async (role, search) => {
    try {
      const response = await api.get('/admin/users', { params: { role, search } });
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch users';
      throw new Error(message);
    }
  },

  getAllCustomers: async () => {
    try {
      const response = await api.get('/admin/customers');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch customers';
      throw new Error(message);
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update user status';
      throw new Error(message);
    }
  },

  getAllVendors: async (status, category) => {
    try {
      const response = await api.get('/admin/vendors', { params: { status, category } });
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch vendors';
      throw new Error(message);
    }
  },

  getPendingVendors: async () => {
    try {
      const response = await api.get('/admin/vendors/pending');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch pending vendors';
      throw new Error(message);
    }
  },

  approveVendor: async (vendorId) => {
    try {
      const response = await api.patch(`/admin/vendors/${vendorId}/approve`);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to approve vendor';
      throw new Error(message);
    }
  },

  rejectVendor: async (vendorId, reason = '') => {
    try {
      const response = await api.patch(`/admin/vendors/${vendorId}/reject`, { reason });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reject vendor';
      throw new Error(message);
    }
  },

  getAllServices: async () => {
    try {
      const response = await api.get('/admin/services');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch all services';
      throw new Error(message);
    }
  },

  updateServiceStatus: async (serviceId, isActive) => {
    try {
      const response = await api.patch(`/admin/services/${serviceId}/status`, { isActive });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update service status';
      throw new Error(message);
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/admin/services/${serviceId}`);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete service';
      throw new Error(message);
    }
  },

  getAllBookings: async (status) => {
    try {
      const response = await api.get('/admin/bookings', { params: { status } });
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch all bookings';
      throw new Error(message);
    }
  }
};

