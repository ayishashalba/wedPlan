import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Star, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import { useServices } from '../../context/ServiceContext';
import { formatCurrency, KERALA_DISTRICTS } from '../../utils/formatters';

const PhotographyPage = () => {
  const { services } = useServices();
  const [district, setDistrict] = useState('all');

  const photographers = services.filter((s) => s.category?.toLowerCase() === 'photography');

  const filtered = photographers.filter((p) => {
    if (district !== 'all') {
      const cleanFilter = district.split('(')[0].trim().toLowerCase();
      const cleanService = (p.district || '').split('(')[0].trim().toLowerCase();
      if (!cleanService.includes(cleanFilter) && !cleanFilter.includes(cleanService)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-wed-ivory rounded-3xl p-8 border border-wed-gold/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wed-gold/15 text-wed-gold-dark text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Candid Storytelling
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Kerala Wedding Photography & Cinematography
          </h1>
          <p className="text-xs sm:text-sm text-wed-brown-muted max-w-xl leading-relaxed">
            Preserve sacred rituals, heartfelt laughter, and timeless romantic frames with Kerala’s celebrated wedding cinematographers and drone visual artists.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="text-xs bg-wed-cream/40 border border-stone-200 rounded-xl px-3.5 py-2 text-wed-brown outline-none"
        >
          <option value="all">All Kerala Districts</option>
          {KERALA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <div className="text-xs text-wed-brown-muted">
          Showing <strong>{filtered.length}</strong> photography studios
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-luxury-hover transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-semibold text-wed-brown shadow-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-wed-gold" />
                  {item.district}
                </div>
                <div className="absolute top-4 right-4 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-wed-brown shadow-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {item.rating}
                </div>
                {item.videography && (
                  <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-wed-gold" />
                    4K Cinematic Video Included
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-serif font-bold text-2xl text-wed-brown mb-2">{item.name}</h3>
                <p className="text-xs text-wed-brown-light mb-4 leading-relaxed">{item.description}</p>

                {item.packagesOffered && (
                  <div className="space-y-1.5 bg-wed-cream/40 p-4 rounded-2xl mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-wed-gold-dark block mb-2">
                      Package Inclusions:
                    </span>
                    {item.packagesOffered.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-wed-brown">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block">
                  Package Pricing
                </span>
                <span className="text-2xl font-serif font-bold text-wed-brown">
                  {formatCurrency(item.price)}
                </span>
                {item.priceUnit && (
                  <span className="text-xs text-wed-brown-muted"> / {item.priceUnit}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/services/${item.id || item._id}`}
                  className="px-3.5 py-2.5 bg-wed-brown text-white hover:bg-wed-gold text-xs font-semibold rounded-xl transition"
                >
                  Details
                </Link>
                <Link
                  to={`/booking/${item.id || item._id}`}
                  className="px-4 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-1.5"
                >
                  Book Dates
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotographyPage;

