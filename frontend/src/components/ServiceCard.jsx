import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Users, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=60';

const ServiceCard = ({ service }) => {
  const serviceId = service.id || service._id;
  const getDetailPath = () => {
    return `/services/${serviceId}`;
  };

  const extractUrl = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.url || item.secure_url || '';
  };

  // Primary image: prefer primary flag, then images[0], then image, then gallery[0], then fallback
  let primaryImage = '';
  if (Array.isArray(service.images) && service.images.length > 0) {
    const primaryObj = service.images.find((img) => typeof img === 'object' && img?.isPrimary);
    primaryImage = primaryObj ? extractUrl(primaryObj) : extractUrl(service.images[0]);
  }
  if (!primaryImage) {
    primaryImage = extractUrl(service.image);
  }
  if (!primaryImage && Array.isArray(service.gallery) && service.gallery.length > 0) {
    primaryImage = extractUrl(service.gallery[0]);
  }
  if (!primaryImage) {
    primaryImage = FALLBACK_IMG;
  }

  const hasCapacity = service.hasGuestCapacity === true ||
    (service.hasGuestCapacity === undefined && Boolean(service.guestCapacity && service.guestCapacity > 0));
  const capacityNum = hasCapacity
    ? (Number(service.maxGuestCapacity || service.guestCapacity || service.capacity) || 0)
    : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/70 shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={service.name || service.serviceName || 'Wedding Service'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-wed-brown tracking-wide uppercase border border-stone-100 shadow-sm">
          {service.categoryLabel || service.category}
        </div>
        {service.featured && (
          <div className="absolute top-3 right-3 bg-wed-gold text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-wed-brown-muted mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-wed-gold" />
              {service.district || service.location || 'Kerala'}
            </span>
            <span className="flex items-center gap-1 font-semibold text-wed-brown">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {service.rating || '5.0'} ({service.reviewCount || 12})
            </span>
          </div>

          <h3 className="font-serif font-bold text-lg text-wed-brown group-hover:text-wed-gold-dark transition line-clamp-1 mb-2">
            {service.name || service.serviceName}
          </h3>

          <p className="text-xs text-wed-brown-muted line-clamp-2 mb-4 leading-relaxed">
            {service.description}
          </p>

          {hasCapacity && capacityNum > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-wed-brown-muted mb-4 bg-wed-cream/60 p-2 rounded-lg">
              <Users className="w-3.5 h-3.5 text-wed-gold" />
              <span>Capacity: <strong className="text-wed-brown">{capacityNum.toLocaleString()} guests</strong></span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">Pricing</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-serif text-wed-brown">{formatCurrency(service.price)}</span>
              {service.priceUnit && <span className="text-xs text-wed-brown-muted">/{service.priceUnit}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/booking/${serviceId}`}
              className="px-3 py-1.5 text-xs font-semibold bg-wed-gold/15 text-wed-gold-dark hover:bg-wed-gold hover:text-white rounded-lg transition"
            >
              Book
            </Link>
            <Link
              to={getDetailPath()}
              className="px-3 py-1.5 text-xs font-semibold bg-wed-brown text-white hover:bg-wed-gold transition rounded-lg flex items-center gap-1"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

