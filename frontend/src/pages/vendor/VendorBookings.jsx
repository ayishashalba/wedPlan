import React, { useState, useEffect } from 'react';
import { CalendarCheck2, Filter } from 'lucide-react';
import BookingCard from '../../components/BookingCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { vendorService } from '../../services/vendorService';

const VendorBookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendorBookings();
      setMyBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load vendor bookings:', err);
      setError(err.message || 'Failed to load booking inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      if (status === 'confirmed') {
        await vendorService.acceptBooking(id);
      } else if (status === 'rejected') {
        await vendorService.rejectBooking(id);
      } else if (status === 'completed') {
        await vendorService.completeBooking(id);
      }
      await fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const filtered = myBookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const statuses = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending Action' },
    { id: 'confirmed', label: 'Confirmed Events' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Declined' }
  ];

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading customer booking inquiries..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Customer Inquiries & Bookings
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Review event dates, guest headcounts, accept bookings, and manage contracts.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statuses.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === tab.id
                ? 'bg-wed-gold text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking._id || booking.bookingId || booking.id}
              booking={booking}
              isVendor={true}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck2}
          title={`No ${filterStatus === 'all' ? '' : filterStatus} booking requests`}
          description="Inquiries submitted by couples for your services will appear here."
        />
      )}
    </div>
  );
};

export default VendorBookings;
