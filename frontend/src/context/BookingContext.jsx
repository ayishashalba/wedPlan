import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  // Always start empty — real data comes from MongoDB via API
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  // Fetch the authenticated user's bookings from the backend
  const fetchMyBookings = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      let remote = [];
      if (user.role === 'customer') {
        remote = await bookingService.getCustomerBookings();
      } else if (user.role === 'vendor') {
        remote = await bookingService.getVendorBookings();
      }
      setBookings(Array.isArray(remote) ? remote : []);
    } catch (err) {
      setBookingsError(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [isAuthenticated, user]);

  // Fetch bookings when user logs in or changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyBookings();
    } else {
      // Clear bookings on logout
      setBookings([]);
    }
  }, [isAuthenticated, user?.id, user?._id, fetchMyBookings]);

  const createBooking = async (bookingData) => {
    // Real backend call — throws on failure, no fake local booking
    const created = await bookingService.createBooking(bookingData);
    // Refresh bookings list from backend after creation
    await fetchMyBookings();
    return created;
  };

  const updateBookingStatus = async (id, newStatus, reason = '') => {
    // Real backend call — throws on failure
    const updated = await bookingService.updateBookingStatus(id, newStatus, reason);
    // Refresh list from backend to get the persisted state
    await fetchMyBookings();
    return updated;
  };

  const cancelBooking = async (id, reason = 'Cancelled by customer') => {
    // Real backend call — throws on failure
    const updated = await bookingService.cancelBooking(id, reason);
    // Refresh list from backend
    await fetchMyBookings();
    return updated;
  };

  const getCustomerBookings = useCallback(
    (customerId) => {
      if (!customerId) return bookings;
      return bookings.filter(
        (b) =>
          (b.customer?._id || b.customer || b.customerId)?.toString() === customerId.toString()
      );
    },
    [bookings]
  );

  const getVendorBookings = useCallback(
    (vendorId) => {
      if (!vendorId) return bookings;
      return bookings.filter(
        (b) =>
          (b.vendor?._id || b.vendor || b.vendorId)?.toString() === vendorId.toString()
      );
    },
    [bookings]
  );

  const value = {
    bookings,
    loadingBookings,
    bookingsError,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getCustomerBookings,
    getVendorBookings,
    refreshBookings: fetchMyBookings
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBookings = () => useContext(BookingContext);
