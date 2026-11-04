import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Star,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Phone,
  Utensils,
  Sparkles,
  Camera,
  CalendarHeart,
  Clock
} from 'lucide-react';
import { useServices } from '../../context/ServiceContext';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const CATEGORY_META = {
  hall: { label: 'Wedding Hall & Convention Centre', icon: Building2, defaultUnit: 'per day' },
  catering: { label: 'Catering Service & Feasts', icon: Utensils, defaultUnit: 'per plate' },
  decoration: { label: 'Stage & Floral Decoration', icon: Sparkles, defaultUnit: 'starting price' },
  photography: { label: 'Photography & Videography', icon: Camera, defaultUnit: 'package' },
  'event-management': { label: 'Wedding & Event Management', icon: CalendarHeart, defaultUnit: 'planning fee' }
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById } = useServices();

  const [service, setService] = useState(() => getServiceById(id));
  const [loading, setLoading] = useState(!service);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const existing = getServiceById(id);
    if (existing) {
      setService(existing);
      setLoading(false);
    } else {
      setLoading(true);
      serviceService
        .getServiceById(id)
        .then((res) => {
          if (res) {
            setService({
              ...res,
              id: res._id || res.id,
              name: res.serviceName || res.name,
              capacity: res.guestCapacity !== undefined ? res.guestCapacity : res.capacity,
              facilities: res.features || res.facilities || [],
              gallery: res.images && res.images.length > 0 ? res.images : (res.gallery || [res.image].filter(Boolean)),
              vendorName: res.vendorProfile?.businessName || res.vendorName || res.vendor?.name || 'Wedding Professional',
              vendorPhone: res.vendorProfile?.phone || res.vendor?.phone || res.phone || ''
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, getServiceById]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner text="Loading service details..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-wed-brown">Service Listing Not Found</h2>
        <p className="text-xs text-wed-brown-muted max-w-md mx-auto">
          The wedding service you requested could not be found or may have been unlisted.
        </p>
        <div className="pt-2">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const categoryKey = (service.category || 'hall').toLowerCase();
  const catMeta = CATEGORY_META[categoryKey] || {
    label: service.categoryLabel || service.category || 'Wedding Service',
    icon: Building2,
    defaultUnit: service.priceUnit || 'service'
  };
  const CategoryIcon = catMeta.icon;

  const extractUrl = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.url || item.secure_url || '';
  };

  const rawGallery =
    (service.images && service.images.length > 0)
      ? service.images
      : (service.gallery && service.gallery.length > 0)
      ? service.gallery
      : [service.image].filter(Boolean);

  const gallery = rawGallery.map(extractUrl).filter(Boolean);

  const hasCapacity = service.hasGuestCapacity === true ||
    (service.hasGuestCapacity === undefined && Boolean(service.guestCapacity && service.guestCapacity > 0));
  const capacityNum = hasCapacity
    ? (Number(service.maxGuestCapacity || service.guestCapacity || service.capacity) || 0)
    : 0;
  const vendorName = service.vendorName || service.vendorProfile?.businessName || service.vendor?.name || 'Verified Wedding Professional';
  const vendorPhone = service.vendorPhone || service.vendorProfile?.phone || service.vendor?.phone || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/services')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-wed-brown hover:text-wed-gold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Service link copied to clipboard!');
              }
            }}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-wed-brown transition shadow-sm"
            title="Share Service Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title & Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-wed-gold-dark font-semibold uppercase tracking-wider">
            <CategoryIcon className="w-4 h-4" />
            <span>{service.district} • {catMeta.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            {service.name || service.serviceName}
          </h1>
          <p className="text-xs text-wed-brown-muted flex items-center gap-1.5 pt-0.5">
            <MapPin className="w-4 h-4 text-wed-gold flex-shrink-0" />
            <span>{service.address || service.location || `${service.district}, Kerala`}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200 text-right shadow-sm">
            <span className="text-[10px] uppercase font-bold text-wed-brown-muted block">Rating</span>
            <span className="flex items-center gap-1 font-bold text-wed-brown text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {service.rating || '5.0'} ({service.reviewCount || 48} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Main Image and Gallery Showcase */}
      <div className="space-y-4">
        <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-stone-200 shadow-luxury bg-stone-100">
          <img
            src={gallery[activeImage] || service.image}
            alt={service.name || 'Service work'}
            className="w-full h-full object-cover transition duration-300"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
            <span>Photo {activeImage + 1} of {gallery.length}</span>
            {activeImage === 0 && (
              <span className="bg-wed-gold text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white ml-1">
                Main
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail gallery */}
        {gallery.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                  activeImage === idx
                    ? 'border-wed-gold scale-95 shadow-md ring-2 ring-wed-gold/30'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid: Left Info, Right Sticky Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-wed-brown">About this Service</h2>
            <p className="text-sm text-wed-brown-light leading-relaxed whitespace-pre-line">
              {service.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              {hasCapacity && capacityNum > 0 && (
                <div className="bg-wed-cream/50 p-4 rounded-2xl">
                  <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                    Guest Capacity
                  </span>
                  <span className="font-serif font-bold text-lg text-wed-brown">
                    {capacityNum.toLocaleString()} Guests
                  </span>
                </div>
              )}
              <div className="bg-wed-cream/50 p-4 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                  District
                </span>
                <span className="font-serif font-bold text-lg text-wed-brown">{service.district}</span>
              </div>
              <div className="bg-wed-cream/50 p-4 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                  Category
                </span>
                <span className="font-serif font-bold text-lg text-wed-brown capitalize">
                  {catMeta.label.split('&')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Included Features & Facilities */}
          {service.facilities && service.facilities.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-2xl text-wed-brown">Features &amp; Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {service.facilities.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-wed-cream/40 text-xs font-semibold text-wed-brown border border-stone-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Information Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-wed-brown">Wedding Professional</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-wed-cream/40 border border-stone-200/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-wed-brown">{vendorName}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Vendor
                  </span>
                </div>
                <p className="text-xs text-wed-brown-muted">
                  Operating in {service.district}, Kerala • High Customer Satisfaction
                </p>
              </div>

              {vendorPhone ? (
                <a
                  href={`tel:${vendorPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex-shrink-0"
                >
                  <Phone className="w-4 h-4" />
                  Contact Vendor: {vendorPhone}
                </a>
              ) : (
                <div className="text-xs text-wed-brown-muted italic">
                  Vendor contact information is currently unavailable.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-wed-gold/40 shadow-luxury sticky top-28 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-wed-brown-muted block mb-1">
                Pricing Structure
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-wed-brown">
                  {formatCurrency(service.price)}
                </span>
                <span className="text-xs text-wed-brown-muted">/{service.priceUnit || catMeta.defaultUnit}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ Transparent Kerala pricing with no hidden charges
              </p>
            </div>

            <div className="space-y-3 text-xs bg-wed-cream/50 p-4 rounded-2xl border border-stone-200/60">
              {hasCapacity && capacityNum > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-wed-brown-muted">Max Capacity:</span>
                  <span className="font-bold text-wed-brown">{capacityNum.toLocaleString()} Guests</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">District:</span>
                <span className="font-bold text-wed-brown">{service.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Vendor:</span>
                <span className="font-bold text-wed-brown">{vendorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Status:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                to={`/booking/${service.id || service._id}`}
                className="w-full py-4 bg-wed-gold hover:bg-wed-gold-dark text-white font-bold rounded-xl transition shadow-md text-xs uppercase tracking-wider block text-center"
              >
                Book This Service
              </Link>

              {vendorPhone && (
                <a
                  href={`tel:${vendorPhone}`}
                  className="w-full py-3 border border-stone-300 hover:border-emerald-600 hover:text-emerald-700 text-wed-brown text-xs font-semibold rounded-xl transition block text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Call Vendor ({vendorPhone})
                </a>
              )}

              <p className="text-[10px] text-center text-wed-brown-muted pt-1">
                Zero advance booking fee. Vendor responds with confirmed quotation within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

