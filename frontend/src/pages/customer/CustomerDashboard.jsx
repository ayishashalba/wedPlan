import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import BookingCard from '../../components/BookingCard';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBookings();

  const customerBookings = bookings || [];

  const total = customerBookings.length;
  const pending = customerBookings.filter((b) => b.status === 'pending').length;
  const confirmed = customerBookings.filter((b) => b.status === 'confirmed').length;
  const rejected = customerBookings.filter((b) => ['rejected', 'cancelled'].includes(b.status)).length;

  const recent = customerBookings.slice(0, 3);

  const stats = [
    {
      label: 'Total Bookings',
      val: total,
      icon: CalendarCheck2,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      label: 'Pending Requests',
      val: pending,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    {
      label: 'Confirmed Bookings',
      val: confirmed,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      label: 'Rejected / Cancelled',
      val: rejected,
      icon: XCircle,
      color: 'bg-stone-50 text-stone-700 border-stone-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-wed-ivory rounded-3xl p-6 sm:p-8 border border-wed-gold/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-wed-gold-dark block mb-1">
            Couple Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Track your Kerala wedding vendor bookings, stage requests, and feast caterings in real time.
          </p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Book More Services
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-medium text-wed-brown-muted block mb-1">
                  {s.label}
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
                  {s.val}
                </span>
              </div>
              <div className={`p-3 rounded-2xl border ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-wed-brown">Recent Booking Activity</h2>
          <Link
            to="/customer/bookings"
            className="text-xs font-semibold text-wed-gold-dark hover:underline flex items-center gap-1"
          >
            View All ({total})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="space-y-4">
            {recent.map((booking) => (
              <BookingCard
                key={booking._id || booking.bookingId || booking.id}
                booking={booking}
                onCancel={(id) => cancelBooking(id, 'Cancelled by user from dashboard')}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center">
            <p className="text-xs text-wed-brown-muted mb-4">You have no booking requests yet.</p>
            <Link
              to="/services"
              className="px-4 py-2 bg-wed-gold text-white text-xs font-semibold rounded-xl"
            >
              Explore Kerala Wedding Vendors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
