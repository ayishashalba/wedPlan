import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  CalendarCheck2,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { vendorService } from '../../services/vendorService';
import BookingCard from '../../components/BookingCard';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendorServices, setVendorServices] = useState([]);
  const [vendorBookings, setVendorBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorStatus, setVendorStatus] = useState(user?.vendorProfile?.verificationStatus || user?.status || 'pending');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [servicesData, bookingsData, statusData] = await Promise.all([
        vendorService.getVendorServices().catch(() => []),
        vendorService.getVendorBookings().catch(() => []),
        vendorService.getVendorStatus().catch(() => null)
      ]);

      setVendorServices(Array.isArray(servicesData) ? servicesData : []);
      setVendorBookings(Array.isArray(bookingsData) ? bookingsData : []);
      if (statusData?.verificationStatus || statusData?.status) {
        setVendorStatus(statusData.verificationStatus || statusData.status);
      }
    } catch (err) {
      console.error('Failed to load vendor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const isApproved = vendorStatus === 'approved';
  const pendingBookings = vendorBookings.filter((b) => b.status === 'pending');
  const confirmedBookings = vendorBookings.filter((b) => b.status === 'confirmed');

  // Calculate estimated booking value from confirmed & completed bookings
  const totalValue = vendorBookings
    .filter((b) => ['confirmed', 'completed'].includes(b.status))
    .reduce((acc, curr) => acc + (curr.totalAmount || curr.price || 0), 0);

  const stats = [
    {
      label: 'Active Services',
      val: vendorServices.length,
      icon: Layers,
      color: 'bg-amber-50 text-amber-700'
    },
    {
      label: 'Total Inquiries',
      val: vendorBookings.length,
      icon: CalendarCheck2,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      label: 'Pending Inquiries',
      val: pendingBookings.length,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700'
    },
    {
      label: 'Confirmed Events',
      val: confirmedBookings.length,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Verification Alert Banner if Pending */}
      {!isApproved && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-amber-900">
              Account Pending Admin Verification
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your vendor profile is currently under review by our Kerala marketplace administrators.
              New service listings cannot be published to the public search catalog until verification is approved.
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-wed-ivory rounded-3xl p-6 sm:p-8 border border-wed-gold/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={vendorStatus} />
            <span className="text-xs text-wed-brown-muted">• {user?.vendorProfile?.category || user?.category || 'Wedding Vendor'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            {user?.vendorProfile?.businessName || user?.businessName || user?.name || 'Vendor Partner'}
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Manage your Kerala wedding listings, respond to Muhurtham inquiries, and monitor revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vendor/services/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Service
          </Link>
        </div>
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
                  {loading ? '...' : s.val}
                </span>
              </div>
              <div className={`p-3 rounded-2xl ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-wed-brown to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-wed-gold">
            Estimated Confirmed Booking Value
          </span>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            {formatCurrency(totalValue)}
          </h3>
          <p className="text-xs text-stone-300">
            Based on confirmed and fulfilled Kerala wedding reservations
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs text-stone-200">
          <TrendingUp className="w-4 h-4 text-emerald-400 inline mr-1.5" />
          High wedding season: <strong>Nov - Feb</strong>
        </div>
      </div>

      {/* Booking Requests Waiting for Action */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-wed-brown">
            Pending Booking Requests ({pendingBookings.length})
          </h2>
          <Link
            to="/vendor/bookings"
            className="text-xs font-semibold text-wed-gold-dark hover:underline flex items-center gap-1"
          >
            All Bookings ({vendorBookings.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingBookings.length > 0 ? (
          <div className="space-y-4">
            {pendingBookings.map((b) => (
              <BookingCard
                key={b._id || b.bookingId || b.id}
                booking={b}
                isVendor={true}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-wed-brown">All caught up!</h4>
            <p className="text-xs text-wed-brown-muted mt-1">
              You have no pending inquiries waiting for your approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
