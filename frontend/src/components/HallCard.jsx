import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const HallCard = ({ hall }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col group">
      <div className="relative h-60 overflow-hidden bg-stone-100">
        <img
          src={hall.image}
          alt={hall.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-wed-brown shadow-sm flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-wed-gold" />
          {hall.district}
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-wed-brown shadow-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {hall.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-wed-gold" />
          Capacity: {hall.capacity.toLocaleString()} Guests
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-xl text-wed-brown group-hover:text-wed-gold-dark transition mb-1">
            {hall.name}
          </h3>
          <p className="text-xs text-wed-brown-muted mb-4">{hall.location}</p>

          {hall.facilities && hall.facilities.length > 0 && (
            <div className="space-y-1 mb-5">
              {hall.facilities.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-wed-brown-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">Rental Per Event</span>
            <span className="text-xl font-bold font-serif text-wed-brown">{formatCurrency(hall.price)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/booking/${hall.id}`}
              className="px-3.5 py-2 text-xs font-semibold bg-wed-gold/15 text-wed-gold-dark hover:bg-wed-gold hover:text-white rounded-xl transition"
            >
              Book Venue
            </Link>
            <Link
              to={`/halls/${hall.id}`}
              className="px-4 py-2 text-xs font-semibold bg-wed-brown text-white hover:bg-wed-gold transition rounded-xl flex items-center gap-1"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallCard;

