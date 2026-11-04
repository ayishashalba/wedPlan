import React, { useState, useEffect } from 'react';
import { Layers, Trash2, MapPin, Eye, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, SERVICE_CATEGORIES } from '../../utils/formatters';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await adminService.deleteService(deleteId);
        setServices((prev) => prev.filter((s) => (s._id || s.id) !== deleteId));
        setDeleteId(null);
      } catch (err) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  const handleToggleStatus = async (serviceId, currentActive) => {
    try {
      await adminService.updateServiceStatus(serviceId, !currentActive);
      setServices((prev) =>
        prev.map((s) => ((s._id || s.id) === serviceId ? { ...s, isActive: !currentActive } : s))
      );
    } catch (err) {
      alert(err.message || 'Failed to update service status');
    }
  };

  const filtered = services.filter((s) => {
    if (categoryFilter !== 'all' && s.category?.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (
      search &&
      !(s.serviceName || s.name || '').toLowerCase().includes(search.toLowerCase()) &&
      !(s.district || '').toLowerCase().includes(search.toLowerCase()) &&
      !(s.vendorName || '').toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Service Catalog & Quality Oversight
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Review live vendor offerings, verify pricing accuracy, and moderate platform listings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="relative min-w-[200px] w-full sm:w-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, district..."
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

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading service catalog from database..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-wed-cream/50 text-wed-brown font-bold border-b border-stone-200">
                  <th className="p-4">Service Title & Vendor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length > 0 ? (
                  filtered.map((service) => {
                    const serviceId = service._id || service.id;
                    const title = service.serviceName || service.name;
                    const img = service.image || (service.images && service.images[0]) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
                    const vendorName = service.vendorProfile?.businessName || service.vendorName || service.vendor?.name || 'Vendor';

                    return (
                      <tr key={serviceId} className="hover:bg-stone-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={img}
                              alt={title}
                              className="w-12 h-10 rounded-lg object-cover border border-stone-200"
                            />
                            <div>
                              <h4 className="font-serif font-bold text-sm text-wed-brown">
                                {title}
                              </h4>
                              <span className="text-[11px] text-wed-gold-dark">
                                Vendor: {vendorName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-wed-brown">
                          {service.categoryLabel || service.category}
                        </td>
                        <td className="p-4 text-wed-brown-light">{service.district}</td>
                        <td className="p-4 font-bold text-wed-brown">
                          {formatCurrency(service.price)} {service.priceUnit ? `/${service.priceUnit}` : ''}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={service.isActive ? 'active' : 'inactive'} />
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(serviceId, service.isActive)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                service.isActive
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {service.isActive ? 'Deactivate' : 'Publish'}
                            </button>

                            <button
                              onClick={() => {
                                setDeleteId(serviceId);
                                setShowConfirm(true);
                              }}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-wed-brown-muted">
                      No services found matching the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Remove Service Listing"
        message="Are you sure you want to delete this listing permanently from WedPlan?"
        confirmText="Yes, Remove"
        danger={true}
      />
    </div>
  );
};

export default AdminServices;
