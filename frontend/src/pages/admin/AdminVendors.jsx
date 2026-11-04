import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Eye, MapPin, Phone, Mail, Award, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllVendors(
        filterStatus !== 'all' ? filterStatus : undefined,
        filterCategory !== 'all' ? filterCategory : undefined
      );
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load vendors:', err);
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filterCategory, filterStatus]);

  const handleApprove = async (vendorId) => {
    try {
      await adminService.approveVendor(vendorId);
      await fetchVendors();
    } catch (err) {
      alert(err.message || 'Failed to approve vendor');
    }
  };

  const handleConfirmReject = async () => {
    if (rejectTargetId) {
      try {
        await adminService.rejectVendor(rejectTargetId, 'Administrative criteria not fulfilled');
        setRejectTargetId(null);
        setShowRejectModal(false);
        await fetchVendors();
      } catch (err) {
        alert(err.message || 'Failed to reject vendor');
      }
    }
  };

  const filtered = vendors.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (v.businessName || '').toLowerCase().includes(q) ||
      (v.ownerName || v.user?.name || '').toLowerCase().includes(q) ||
      (v.email || v.user?.email || '').toLowerCase().includes(q) ||
      (v.phone || v.user?.phone || '').toLowerCase().includes(q) ||
      (v.city || '').toLowerCase().includes(q) ||
      (v.district || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Vendor Management & Licensing
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Verify Kerala wedding providers, regulate platform listings, and inspect compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Wedding Hall">Wedding Halls</option>
            <option value="Catering">Catering</option>
            <option value="Decoration">Decoration</option>
            <option value="Photography">Photography</option>
            <option value="Event Management">Event Management</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading vendors from database..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-wed-cream/50 text-wed-brown font-bold border-b border-stone-200">
                  <th className="p-4">Vendor & Trade Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length > 0 ? (
                  filtered.map((vendor) => {
                    const vendorId = vendor._id || vendor.id;
                    const status = vendor.verificationStatus || vendor.status;

                    return (
                      <tr key={vendorId} className="hover:bg-stone-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={vendor.logo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'}
                              alt={vendor.businessName}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                            />
                            <div>
                              <h4 className="font-serif font-bold text-sm text-wed-brown">
                                {vendor.businessName}
                              </h4>
                              <span className="text-[11px] text-wed-brown-muted">
                                Proprietor: {vendor.ownerName || vendor.user?.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-wed-gold-dark">{vendor.category}</td>
                        <td className="p-4 text-wed-brown-light">{vendor.city}, {vendor.district}</td>
                        <td className="p-4 text-wed-brown-light">
                          <div>{vendor.phone || vendor.user?.phone}</div>
                          <span className="text-[10px] text-stone-400">{vendor.email || vendor.user?.email}</span>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setSelectedVendor(vendor)}
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-wed-brown transition"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {status !== 'approved' && (
                              <button
                                onClick={() => handleApprove(vendorId)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                              >
                                Approve
                              </button>
                            )}

                            {status !== 'rejected' && (
                              <button
                                onClick={() => {
                                  setRejectTargetId(vendorId);
                                  setShowRejectModal(true);
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-wed-brown-muted">
                      No vendors found matching your selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedVendor && (
        <Modal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          title={`Vendor Details: ${selectedVendor.businessName}`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedVendor.logo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'}
                  alt={selectedVendor.businessName}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-serif font-bold text-lg text-wed-brown">
                    {selectedVendor.businessName}
                  </h4>
                  <p className="text-xs text-wed-gold-dark font-medium">{selectedVendor.category}</p>
                </div>
              </div>
              <StatusBadge status={selectedVendor.verificationStatus || selectedVendor.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-wed-cream/40 p-4 rounded-xl">
              <div>
                <span className="text-stone-400 block mb-0.5">Proprietor Name:</span>
                <p className="font-semibold text-wed-brown">{selectedVendor.ownerName || selectedVendor.user?.name}</p>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Years of Experience:</span>
                <p className="font-semibold text-wed-brown">{selectedVendor.experience || selectedVendor.yearsExperience || 0} Years</p>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Contact Phone:</span>
                <p className="font-semibold text-wed-brown">{selectedVendor.phone || selectedVendor.user?.phone}</p>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Email Address:</span>
                <p className="font-semibold text-wed-brown">{selectedVendor.email || selectedVendor.user?.email}</p>
              </div>
              <div className="col-span-2">
                <span className="text-stone-400 block mb-0.5">Full Physical Address:</span>
                <p className="font-semibold text-wed-brown">{selectedVendor.address || `${selectedVendor.city}, ${selectedVendor.district}`}</p>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-wed-brown mb-1.5">
                Business Description & Specialization
              </h5>
              <p className="text-xs text-wed-brown-light leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                {selectedVendor.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-wed-brown"
              >
                Close
              </button>
              {(selectedVendor.verificationStatus || selectedVendor.status) !== 'approved' && (
                <button
                  onClick={() => {
                    handleApprove(selectedVendor._id || selectedVendor.id);
                    setSelectedVendor(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
                >
                  Approve Registration
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Confirmation */}
      <ConfirmationDialog
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        title="Reject Vendor Application"
        message="Are you sure you want to reject this vendor? Unapproved vendors cannot publish public listings."
        confirmText="Confirm Rejection"
        danger={true}
      />
    </div>
  );
};

export default AdminVendors;
