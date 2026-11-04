import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Booking submission failed';
      throw new Error(message);
    }
  },

  getCustomerBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch customer bookings';
      throw new Error(message);
    }
  },

  getVendorBookings: async () => {
    try {
      const response = await api.get('/bookings/vendor-bookings');
      return response.data?.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch vendor bookings';
      throw new Error(message);
    }
  },

  updateBookingStatus: async (bookingId, status, reason = '') => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status, reason });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Status update failed';
      throw new Error(message);
    }
  },

  cancelBooking: async (bookingId, reason = '') => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`, { reason });
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Cancellation failed';
      throw new Error(message);
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data?.data || null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch booking';
      throw new Error(message);
    }
  }
};
