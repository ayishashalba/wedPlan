import React from 'react';
import { MapPin, Star, Award, Phone, Mail } from 'lucide-react';
import StatusBadge from './StatusBadge';

const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-luxury-hover transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={vendor.logo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'}
              alt={vendor.businessName}
              className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
            />
            <div>
              <h4 className="font-serif font-bold text-lg text-wed-brown leading-snug">{vendor.businessName}</h4>
              <p className="text-xs text-wed-brown-muted">Proprietor: {vendor.ownerName}</p>
            </div>
          </div>
          <StatusBadge status={vendor.status} />
        </div>

        <p className="text-xs text-wed-brown-light line-clamp-2 mb-4 leading-relaxed">
          {vendor.description}
        </p>

        <div className="space-y-2 text-xs text-wed-brown-muted mb-4 bg-wed-cream/50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-wed-gold flex-shrink-0" />
            <span className="truncate">{vendor.city}, {vendor.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-wed-gold flex-shrink-0" />
            <span>{vendor.yearsExperience} Years Experience in Kerala Weddings</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-wed-gold flex-shrink-0" />
            <span>{vendor.phone}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <span className="bg-wed-gold/10 text-wed-gold-dark font-medium px-2.5 py-1 rounded-md">
          {vendor.category}
        </span>
        {vendor.rating > 0 && (
          <span className="flex items-center gap-1 font-semibold text-wed-brown">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {vendor.rating} Rating
          </span>
        )}
      </div>
    </div>
  );
};

export default VendorCard;

