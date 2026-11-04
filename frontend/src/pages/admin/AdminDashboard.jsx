import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  Clock,
  ShieldCheck,
  Layers,
  CalendarCheck2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, pending] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingVendors()
      ]);
      setStatsData(stats);
      setPendingVendors(Array.isArray(pending) ? pending : []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      setError(err.message || 'Failed to load administration metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (vendorId) => {
    try {
      await adminService.approveVendor(vendorId);
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to approve vendor');
    }
  };

  const handleReject = async (vendorId) => {
    try {
      await adminService.rejectVendor(vendorId, 'Incomplete verification documents');
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to reject vendor');
    }
  };

  const stats = [
    {
      label: 'Registered Customers',
      val: statsData?.totalCustomers || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      label: 'Total Vendors',
      val: statsData?.totalVendors || 0,
      icon: Store,
      color: 'bg-amber-50 text-amber-700'
    },
    {
      label: 'Pending Vendor Approvals',
      val: statsData?.pendingVendors || pendingVendors.length,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700 font-bold'
    },
    {
      label: 'Approved Vendors',
      val: statsData?.approvedVendors || 0,
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700'
    },
    {
      label: 'Platform Listings',
      val: statsData?.totalServices || 0,
      icon: Layers,
      color: 'bg-purple-50 text-purple-700'
    },
    {
      label: 'Total Platform Bookings',
      val: statsData?.totalBookings || 0,
      icon: CalendarCheck2,
      color: 'bg-stone-50 text-stone-700'
    },
    {
      label: 'Pending Inquiries',
      val: statsData?.pendingBookings || 0,
      icon: AlertCircle,
      color: 'bg-rose-50 text-rose-700'
    }
  ];

  if (loading && !statsData) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading WedPlan administrative data..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-wed-brown text-white rounded-3xl p-6 sm:p-8 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-wed-gold block mb-1">
            Platform Operations & Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            WedPlan Administrative Control Center
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Monitor vendor licensing, regulate wedding service quality, and track marketplace metrics across Kerala.
          </p>
        </div>

        <Link
          to="/admin/vendors"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm whitespace-nowrap"
        >
          <Clock className="w-4 h-4" />
          Review Pending ({pendingVendors.length})
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <div className={`p-3 rounded-2xl ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Vendor Approvals Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-wed-brown">
              Pending Vendor Registrations ({pendingVendors.length})
            </h2>
            <p className="text-xs text-wed-brown-muted mt-0.5">
              Trade verification required before allowing public listings.
            </p>
          </div>
          <Link
            to="/admin/vendors"
            className="text-xs font-semibold text-wed-gold-dark hover:underline flex items-center gap-1"
          >
            Manage All Vendors
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingVendors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-wed-cream/50 text-wed-brown font-bold border-b border-stone-200">
                  <th className="p-4">Business Entity</th>
                  <th className="p-4">Proprietor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">District / City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pendingVendors.map((vendor) => {
                  const vendorId = vendor._id || vendor.id;
                  return (
                    <tr key={vendorId} className="hover:bg-stone-50 transition">
                      <td className="p-4 font-serif font-bold text-sm text-wed-brown">
                        {vendor.businessName}
                      </td>
                      <td className="p-4 text-wed-brown-light">
                        <div>{vendor.ownerName || vendor.user?.name}</div>
                        <span className="text-[11px] text-stone-400">{vendor.phone || vendor.user?.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-wed-gold/10 text-wed-gold-dark font-semibold rounded-md">
                          {vendor.category}
                        </span>
                      </td>
                      <td className="p-4 text-wed-brown-light">
                        {vendor.city}, {vendor.district}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={vendor.verificationStatus || vendor.status} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(vendorId)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(vendorId)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition flex items-center gap-1 shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-wed-brown-muted">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            No pending vendor approvals. All registrations are verified!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
