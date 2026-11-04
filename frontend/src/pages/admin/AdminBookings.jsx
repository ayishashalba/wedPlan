import React, { useState, useEffect } from 'react';
import { CalendarCheck2, Filter, Eye, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import BookingCard from '../../components/BookingCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllBookings(statusFilter !== 'all' ? statusFilter : undefined);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
      setError(err.message || 'Failed to load platform bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const filtered = bookings.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (b.bookingId || '').toLowerCase().includes(q) ||
      (b.serviceName || '').toLowerCase().includes(q) ||
      (b.customerName || b.customer?.name || '').toLowerCase().includes(q) ||
      (b.vendorName || b.vendor?.name || '').toLowerCase().includes(q) ||
      (b.eventLocation || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Master Booking Oversight
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Track all transactions, reservations, and wedding schedule progress across Kerala.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="relative min-w-[200px] w-full sm:w-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference, venue, couple..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading bookings from database..." />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking._id || booking.bookingId || booking.id}
              booking={booking}
              isVendor={false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-xs text-wed-brown-muted">
          No bookings found matching your filter selection.
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
