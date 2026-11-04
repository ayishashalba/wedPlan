import React, { useState } from 'react';
import { CalendarCheck2 } from 'lucide-react';
import BookingCard from '../../components/BookingCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useBookings } from '../../context/BookingContext';

const CustomerBookings = () => {
  const { bookings, loadingBookings, cancelBooking, refreshBookings } = useBookings();
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelBooking(id, 'Cancelled by customer');
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = (bookings || []).filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const statuses = [
    { id: 'all', label: 'All Bookings' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'rejected', label: 'Rejected' }
  ];

  if (loadingBookings && bookings.length === 0) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading your bookings from WedPlan..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            My Wedding Bookings
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Review status, inspect vendor contracts, and manage your wedding requests.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Booking List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking._id || booking.bookingId || booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck2}
          title={`No ${filterStatus === 'all' ? '' : filterStatus} bookings found`}
          description="You do not have any bookings in this status category currently."
          actionLabel="Explore Services"
          actionLink="/services"
        />
      )}
    </div>
  );
};

export default CustomerBookings;
