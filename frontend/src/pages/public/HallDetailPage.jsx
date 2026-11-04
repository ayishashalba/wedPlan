import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Star,
  CheckCircle2,
  Calendar,
  Share2,
  Heart,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { useServices } from '../../context/ServiceContext';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const HallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById } = useServices();

  const [hall, setHall] = useState(() => getServiceById(id));
  const [loading, setLoading] = useState(!hall);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const existing = getServiceById(id);
    if (existing) {
      setHall(existing);
      setLoading(false);
    } else {
      serviceService.getServiceById(id).then((res) => {
        if (res) {
          setHall({
            ...res,
            id: res._id || res.id,
            name: res.serviceName || res.name,
            capacity: res.guestCapacity || res.capacity,
            facilities: res.features || res.facilities || [],
            gallery: res.images || res.gallery || [res.image]
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, getServiceById]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading venue details..." />
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-wed-brown mb-4">Venue Not Found</h2>
        <p className="text-xs text-wed-brown-muted mb-6">
          The wedding hall you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/halls"
          className="px-5 py-2.5 bg-wed-gold text-white text-xs font-semibold rounded-xl"
        >
          Back to Wedding Halls
        </Link>
      </div>
    );
  }

  const gallery = (hall.images && hall.images.length > 0)
    ? hall.images
    : (hall.gallery && hall.gallery.length > 0)
    ? hall.gallery
    : [hall.image].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-wed-brown hover:text-wed-gold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Link copied to clipboard!')}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-wed-brown transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & District */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-wed-gold-dark font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{hall.district} • Premium Convention Venue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            {hall.name}
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-wed-gold" />
            {hall.address || hall.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-stone-200 text-right shadow-sm">
            <span className="text-[10px] uppercase font-bold text-wed-brown-muted block">Rating</span>
            <span className="flex items-center gap-1 font-bold text-wed-brown text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {hall.rating} ({hall.reviewCount || 100}+ reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border border-stone-200 shadow-luxury">
          <img
            src={gallery[activeImage] || hall.image}
            alt={hall.name}
            className="w-full h-full object-cover transition duration-300"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white">
            Photo {activeImage + 1} of {gallery.length}
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                  activeImage === idx ? 'border-wed-gold scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid: Left Content, Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-wed-brown">About the Venue</h2>
            <p className="text-sm text-wed-brown-light leading-relaxed whitespace-pre-line">
              {hall.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              <div className="bg-wed-cream/50 p-4 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                  Guest Capacity
                </span>
                <span className="font-serif font-bold text-lg text-wed-brown">
                  {hall.capacity ? `${hall.capacity.toLocaleString()} Guests` : '800+ Guests'}
                </span>
              </div>
              <div className="bg-wed-cream/50 p-4 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                  Venue Type
                </span>
                <span className="font-serif font-bold text-lg text-wed-brown">AC Banquet Hall</span>
              </div>
              <div className="bg-wed-cream/50 p-4 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                  Availability
                </span>
                <span className="font-serif font-bold text-lg text-emerald-700">Open for 2026/27</span>
              </div>
            </div>
          </div>

          {/* Facilities */}
          {hall.facilities && hall.facilities.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-2xl text-wed-brown">Venue Facilities & Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {hall.facilities.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-wed-cream/40 text-xs font-semibold text-wed-brown">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location & Map Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-2xl text-wed-brown">Address & Location</h2>
            <p className="text-xs text-wed-brown-muted leading-relaxed">
              {hall.address || hall.location}
            </p>
            <div className="h-44 bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-200 text-xs text-wed-brown-muted font-medium">
              <MapPin className="w-5 h-5 text-wed-gold mr-2" />
              {hall.location} (Interactive Map Preview Ready)
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-wed-gold/40 shadow-luxury sticky top-28 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-wed-brown-muted block mb-1">
                Rental Price per Event
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-wed-brown">
                  {formatCurrency(hall.price)}
                </span>
                <span className="text-xs text-wed-brown-muted">/ day</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ Includes generator backup & stage rigging
              </p>
            </div>

            <div className="space-y-3 text-xs bg-wed-cream/50 p-4 rounded-2xl border border-stone-200/60">
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Guest Capacity:</span>
                <span className="font-bold text-wed-brown">{hall.capacity} Guests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">District:</span>
                <span className="font-bold text-wed-brown">{hall.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Admin Verification:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to={`/booking/${hall.id}`}
                className="w-full py-3.5 bg-wed-gold hover:bg-wed-gold-dark text-white font-bold rounded-xl transition shadow-md text-xs uppercase tracking-wider block text-center"
              >
                Request Booking Date
              </Link>
              <p className="text-[10px] text-center text-wed-brown-muted">
                No upfront cancellation fee. Directly confirmed by venue management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallDetailPage;

