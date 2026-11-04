import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone
} from 'lucide-react';
import { useServices } from '../../context/ServiceContext';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { serviceService } from '../../services/serviceService';
import { EVENT_TYPES, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getServiceById, getPackageById } = useServices();
  const { createBooking } = useBookings();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Check if booking is for a package or an individual service
  const isPackage = serviceId?.startsWith('package-');
  const actualId = isPackage ? serviceId.replace('package-', '') : serviceId;

  const [targetItem, setTargetItem] = useState(() =>
    isPackage ? getPackageById(actualId) : getServiceById(actualId)
  );
  const [loadingItem, setLoadingItem] = useState(!targetItem);

  const [formData, setFormData] = useState({
    eventType: 'Wedding Ceremony',
    eventDate: '',
    eventTime: '09:30 AM (Muhurtham)',
    guestCount: 500,
    location: '',
    additionalRequirements: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [capacityError, setCapacityError] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch target item if not present in memory / on direct refresh
  useEffect(() => {
    const existing = isPackage ? getPackageById(actualId) : getServiceById(actualId);
    if (existing) {
      setTargetItem(existing);
      setFormData((prev) => ({
        ...prev,
        location: prev.location || existing.location || existing.district || 'Kochi, Kerala',
        guestCount: (Number(existing.capacity || existing.guestCapacity) > 0)
          ? Math.min(prev.guestCount || 500, Number(existing.capacity || existing.guestCapacity))
          : prev.guestCount
      }));
      setLoadingItem(false);
    } else {
      setLoadingItem(true);
      const fetcher = isPackage
        ? serviceService.getPackageById(actualId)
        : serviceService.getServiceById(actualId);

      fetcher
        .then((res) => {
          if (res) {
            const normalized = {
              ...res,
              id: res._id || res.id,
              name: res.serviceName || res.name || res.packageName,
              capacity: res.guestCapacity !== undefined ? res.guestCapacity : res.capacity,
              facilities: res.features || res.facilities || [],
              vendorName: res.vendorProfile?.businessName || res.vendorName || res.vendor?.name || 'Wedding Vendor',
              vendorPhone: res.vendorProfile?.phone || res.vendor?.phone || res.vendorPhone || ''
            };
            setTargetItem(normalized);
            setFormData((prev) => ({
              ...prev,
              location: prev.location || normalized.location || normalized.district || 'Kochi, Kerala'
            }));
          }
          setLoadingItem(false);
        })
        .catch(() => setLoadingItem(false));
    }
  }, [actualId, isPackage, getPackageById, getServiceById]);

  // Redirect to login if unauthenticated once auth loading is completed
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [authLoading, isAuthenticated, location, navigate]);

  if (authLoading || loadingItem) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner text="Preparing booking system..." />
      </div>
    );
  }

  if (!targetItem) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-wed-brown">Service Not Found</h2>
        <p className="text-xs text-wed-brown-muted">
          The wedding service or package you requested could not be located.
        </p>
        <div className="pt-2">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const hasGuestCapacity = targetItem.hasGuestCapacity === true ||
    (targetItem.hasGuestCapacity === undefined && Boolean(targetItem.guestCapacity && targetItem.guestCapacity > 0));
  const maxCapacity = hasGuestCapacity
    ? (Number(targetItem.maxGuestCapacity || targetItem.guestCapacity || targetItem.capacity) || 0)
    : 0;
  const vendorName = targetItem.vendorName || targetItem.vendorProfile?.businessName || targetItem.vendor?.name || 'Wedding Professional';
  const vendorPhone = targetItem.vendorPhone || targetItem.vendorProfile?.phone || targetItem.vendor?.phone || '';

  const validate = () => {
    const errs = {};
    setCapacityError(null);

    if (!formData.eventDate) {
      errs.eventDate = 'Please select your celebration date';
    }

    if (hasGuestCapacity) {
      const countNum = Number(formData.guestCount);
      if (!formData.guestCount || isNaN(countNum) || countNum <= 0 || !Number.isInteger(countNum)) {
        errs.guestCount = 'Guest count must be a positive integer';
      } else if (maxCapacity > 0 && countNum > maxCapacity) {
        const capErr = {
          maxCapacity,
          requestedCount: countNum,
          vendorName,
          vendorPhone,
          message: `Sorry! This service can accommodate a maximum of ${maxCapacity} guests. Your requested guest count is ${countNum}. Please contact the vendor for further assistance.`
        };
        setCapacityError(capErr);
        errs.guestCount = `Maximum capacity is ${maxCapacity} guests`;
      }
    }

    if (!formData.location.trim()) {
      errs.location = 'Event venue location is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGuestCountChange = (val) => {
    const countNum = Number(val);
    setFormData({ ...formData, guestCount: val });

    if (hasGuestCapacity && maxCapacity > 0 && countNum > maxCapacity) {
      setCapacityError({
        maxCapacity,
        requestedCount: countNum,
        vendorName,
        vendorPhone,
        message: `Sorry! This service can accommodate a maximum of ${maxCapacity} guests. Your requested guest count is ${countNum}. Please contact the vendor for further assistance.`
      });
      setErrors((prev) => ({ ...prev, guestCount: `Exceeds max capacity (${maxCapacity})` }));
    } else {
      setCapacityError(null);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.guestCount;
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      const bookingPayload = {
        serviceId: isPackage ? undefined : (targetItem._id || targetItem.id),
        packageId: isPackage ? (targetItem._id || targetItem.id) : undefined,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        guestCount: hasGuestCapacity ? Number(formData.guestCount) : 0,
        eventLocation: formData.location,
        location: formData.location,
        requirements: formData.additionalRequirements,
        additionalRequirements: formData.additionalRequirements
      };

      const newBooking = await createBooking(bookingPayload);
      setCreatedBookingId(newBooking?.bookingId || newBooking?.id || 'SUBMITTED');
      setSubmitted(true);
    } catch (err) {
      const respData = err.response?.data;
      if (respData?.capacityError) {
        setCapacityError({
          maxCapacity: respData.capacityError.maxCapacity,
          requestedCount: respData.capacityError.requestedGuests,
          vendorName: respData.capacityError.vendorName || vendorName,
          vendorPhone: respData.capacityError.vendorPhone || vendorPhone,
          message: respData.message
        });
      }
      setApiError(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-wed-brown">
          Booking Request Submitted!
        </h2>
        <p className="text-xs text-wed-brown-muted leading-relaxed max-w-md mx-auto">
          Your booking request <strong className="font-mono text-wed-brown">#{createdBookingId}</strong> for{' '}
          <strong>{targetItem.name || targetItem.serviceName}</strong> has been transmitted to the vendor. You will receive real-time status updates on your dashboard.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/customer/bookings"
            className="w-full sm:w-auto px-6 py-3 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-md"
          >
            View in My Bookings
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto px-6 py-3 border border-stone-300 text-wed-brown hover:bg-stone-50 text-xs font-semibold rounded-xl transition"
          >
            Explore More Services
          </Link>
        </div>
      </div>
    );
  }

  const estimatedPrice =
    targetItem.priceUnit === 'per person' || targetItem.priceUnit === 'per plate'
      ? (targetItem.discountPrice || targetItem.price || 450) * Number(formData.guestCount || 0)
      : targetItem.discountPrice || targetItem.price;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-wed-brown hover:text-wed-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Guest Capacity Exceeded Detailed Error Alert */}
      {capacityError && (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-rose-900">
                Capacity Limit Exceeded
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                Sorry! This service can accommodate a maximum of{' '}
                <strong className="font-bold underline">{capacityError.maxCapacity}</strong> guests.
                Your requested guest count is{' '}
                <strong className="font-bold underline">{capacityError.requestedCount}</strong>.
                Please contact the vendor for further assistance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/80 border border-rose-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Vendor Name</span>
              <span className="font-semibold text-wed-brown">{capacityError.vendorName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Maximum Capacity</span>
              <span className="font-semibold text-rose-700">{capacityError.maxCapacity} guests</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Requested Headcount</span>
              <span className="font-semibold text-rose-700">{capacityError.requestedCount} guests</span>
            </div>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-stone-600 font-medium mr-1.5">Vendor Contact:</span>
              {capacityError.vendorPhone ? (
                <span className="font-semibold text-wed-brown">{capacityError.vendorPhone}</span>
              ) : (
                <span className="text-stone-500 italic">Vendor contact information is currently unavailable.</span>
              )}
            </div>

            {capacityError.vendorPhone ? (
              <a
                href={`tel:${capacityError.vendorPhone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Call Vendor
              </a>
            ) : (
              <span className="text-xs text-stone-400 italic">No direct call line</span>
            )}
          </div>
        </div>
      )}

      {apiError && !capacityError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-luxury space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-wed-gold-dark block mb-1">
              Kerala Wedding Booking Request
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
              Reserve {targetItem.name || targetItem.serviceName}
            </h1>
            <p className="text-xs text-wed-brown-muted mt-1">
              Please enter your event specifications. The vendor will review and confirm availability.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Event Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full text-xs bg-wed-cream/40 border border-stone-200 rounded-xl px-3.5 py-3 text-wed-brown focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                  Event Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/40 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
                  />
                </div>
                {errors.eventDate && <p className="text-[11px] text-rose-600">{errors.eventDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                  Muhurtham / Event Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    placeholder="e.g. 09:30 AM Muhurtham"
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/40 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
                  />
                </div>
              </div>
            </div>

            {/* Guest Count and Location */}
            <div className={`grid grid-cols-1 ${hasGuestCapacity ? 'sm:grid-cols-2' : ''} gap-4`}>
              {hasGuestCapacity && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                      Expected Guest Count *
                    </label>
                    {maxCapacity > 0 && (
                      <span className="text-[11px] font-semibold text-wed-gold-dark">
                        Max: {maxCapacity.toLocaleString()} guests
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={formData.guestCount}
                      onChange={(e) => handleGuestCountChange(e.target.value)}
                      className={`w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border bg-wed-cream/40 focus:outline-none focus:ring-2 ${
                        capacityError
                          ? 'border-rose-400 ring-2 ring-rose-300'
                          : 'border-stone-200 focus:ring-wed-gold/40'
                      }`}
                    />
                  </div>
                  {errors.guestCount && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.guestCount}</p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                  Venue / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bolgatty Island, Kochi"
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/40 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
                  />
                </div>
                {errors.location && <p className="text-[11px] text-rose-600">{errors.location}</p>}
              </div>
            </div>

            {/* Additional requirements */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Additional Requirements / Special Requests
              </label>
              <textarea
                rows="4"
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="Mention stage floral preferences, vegan sadya counter requirements, drone footage access, or bride & groom dressing room needs..."
                className="w-full text-xs p-3.5 rounded-xl border border-stone-200 bg-wed-cream/40 focus:outline-none focus:ring-2 focus:ring-wed-gold/40 leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || Boolean(capacityError)}
              className="w-full py-4 bg-wed-gold hover:bg-wed-gold-dark text-white font-bold rounded-xl transition shadow-md text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {submitting
                ? 'Submitting Booking Request...'
                : capacityError
                ? 'Guest Count Exceeds Capacity'
                : 'Submit Booking Request'}
            </button>
          </form>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border-2 border-wed-gold/30 shadow-luxury space-y-5 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-wed-brown border-b border-stone-100 pb-3">
              Booking Summary
            </h3>

            <div className="space-y-3">
              <img
                src={targetItem.image || (targetItem.images && targetItem.images[0])}
                alt={targetItem.name || targetItem.serviceName}
                className="w-full h-36 object-cover rounded-2xl"
              />
              <h4 className="font-serif font-bold text-base text-wed-brown">{targetItem.name || targetItem.serviceName}</h4>
              <p className="text-xs text-wed-gold-dark font-medium">
                {isPackage ? 'Curated Wedding Package' : targetItem.district}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-wed-brown-muted">
                <span>Base Rate:</span>
                <span className="font-medium text-wed-brown">
                  {formatCurrency(targetItem.price)} {targetItem.priceUnit ? `/${targetItem.priceUnit}` : ''}
                </span>
              </div>
              {(targetItem.priceUnit === 'per person' || targetItem.priceUnit === 'per plate') && (
                <div className="flex justify-between text-wed-brown-muted">
                  <span>Guest Headcount:</span>
                  <span className="font-medium text-wed-brown">{formData.guestCount} Guests</span>
                </div>
              )}
              {maxCapacity > 0 && (
                <div className="flex justify-between text-wed-brown-muted">
                  <span>Max Capacity:</span>
                  <span className="font-medium text-wed-brown">{maxCapacity.toLocaleString()} Guests</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Estimated Total:
              </span>
              <span className="text-2xl font-serif font-bold text-wed-gold-dark">
                {formatCurrency(estimatedPrice)}
              </span>
            </div>

            <div className="bg-wed-cream/50 p-3 rounded-xl text-[11px] text-wed-brown-muted flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Zero advance required during initial inquiry. Confirmed quotation provided by vendor within 24 hours.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
