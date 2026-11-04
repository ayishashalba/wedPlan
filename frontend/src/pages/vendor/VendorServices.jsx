import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, MapPin, Eye, Users } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

const VendorServices = () => {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendorServices();
      setMyServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError(err.message || 'Failed to load your services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (deleteTargetId) {
      try {
        await vendorService.deleteVendorService(deleteTargetId);
        setMyServices((prev) => prev.filter((s) => (s._id || s.id) !== deleteTargetId));
        setDeleteTargetId(null);
      } catch (err) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading your services..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Manage My Services
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Create, update pricing, and manage your wedding listings visible to Kerala couples.
          </p>
        </div>
        <Link
          to="/vendor/services/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {myServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myServices.map((service) => {
            const serviceId = service._id || service.id;
            const serviceImage = service.image || (service.images && service.images[0]) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
            const serviceTitle = service.serviceName || service.name;

            return (
              <div
                key={serviceId}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={serviceImage}
                      alt={serviceTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-[11px] font-semibold text-wed-brown uppercase">
                      {service.categoryLabel || service.category}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          service.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {service.isActive ? 'Live' : 'Under Review'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-wed-brown line-clamp-1 mb-1">
                      {serviceTitle}
                    </h3>
                    <p className="text-xs text-wed-brown-muted flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-wed-gold" />
                      {service.district} {service.city ? `(${service.city})` : ''}
                    </p>
                    <p className="text-xs text-wed-brown-light line-clamp-2 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-xs bg-wed-cream/50 p-3 rounded-xl">
                      <span className="text-wed-brown-muted">Price:</span>
                      <span className="font-serif font-bold text-wed-brown text-sm">
                        {formatCurrency(service.price)} {service.priceUnit ? `/${service.priceUnit}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to={`/vendor/services/edit/${serviceId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-wed-brown hover:bg-stone-50 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-wed-gold" />
                    Edit
                  </Link>

                  <button
                    onClick={() => {
                      setDeleteTargetId(serviceId);
                      setShowConfirm(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No services added yet"
          description="Get started by listing your convention centre, catering menu, mandapam decoration, or photography package."
          actionLabel="Create First Service"
          actionLink="/vendor/services/add"
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Service Listing"
        message="Are you sure you want to remove this service listing? This action cannot be reversed."
        confirmText="Yes, Delete Listing"
        danger={true}
      />
    </div>
  );
};

export default VendorServices;
