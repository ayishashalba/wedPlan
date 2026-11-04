import api from './api';

export const vendorService = {
  /**
   * Upload multiple image files to Cloudinary via the backend.
   * @param {File[]} files  – Array of File objects (max 5)
   * @returns {Promise<{ url: string, public_id: string }[]>}
   */
  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('folder', 'wedplan/services');

      const response = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Response: { success, data: { urls, results } }
      const results = response.data?.data?.results || [];
      return results.map((r) => ({ url: r.secure_url, public_id: r.public_id }));
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Image upload failed';
      throw new Error(message);
    }
  },


  registerVendor: async (vendorData) => {
    try {
      const response = await api.post('/vendors/register', vendorData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Vendor registration failed';
      throw new Error(message);
    }
  },

  getVendorProfile: async (vendorId) => {
    try {
      const endpoint = vendorId ? `/vendors/${vendorId}` : '/vendors/profile';
      const response = await api.get(endpoint);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch vendor profile';
      throw new Error(message);
    }
  },

  updateVendorProfile: async (profileData) => {
    try {
      const response = await api.put('/vendors/profile', profileData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update vendor profile';
      throw new Error(message);
    }
  },

  getVendorStatus: async () => {
    try {
      const response = await api.get('/vendors/status');
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch vendor status';
      throw new Error(message);
    }
  },

  getVendorServices: async () => {
    try {
      const response = await api.get('/vendors/services');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch vendor services';
      throw new Error(message);
    }
  },

  createVendorService: async (serviceData) => {
    try {
      const response = await api.post('/vendors/services', serviceData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create service';
      throw new Error(message);
    }
  },

  updateVendorService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/vendors/services/${serviceId}`, serviceData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update service';
      throw new Error(message);
    }
  },

  deleteVendorService: async (serviceId) => {
    try {
      const response = await api.delete(`/vendors/services/${serviceId}`);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete service';
      throw new Error(message);
    }
  },

  getVendorBookings: async () => {
    try {
      const response = await api.get('/vendors/bookings');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch vendor bookings';
      throw new Error(message);
    }
  },

  acceptBooking: async (bookingId, reason = '') => {
    try {
      const response = await api.patch(`/vendors/bookings/${bookingId}/accept`, { reason, vendorResponse: reason });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to accept booking';
      throw new Error(message);
    }
  },

  rejectBooking: async (bookingId, reason = '') => {
    try {
      const response = await api.patch(`/vendors/bookings/${bookingId}/reject`, { reason, vendorResponse: reason });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reject booking';
      throw new Error(message);
    }
  },

  completeBooking: async (bookingId) => {
    try {
      const response = await api.patch(`/vendors/bookings/${bookingId}/complete`);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to complete booking';
      throw new Error(message);
    }
  }
};
