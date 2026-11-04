import React, { useState } from 'react';
import HallCard from '../../components/HallCard';
import { useServices } from '../../context/ServiceContext';
import { KERALA_DISTRICTS } from '../../utils/formatters';
import { Building2, Search, Users } from 'lucide-react';

const HallsPage = () => {
  const { services } = useServices();
  const [district, setDistrict] = useState('all');
  const [capacity, setCapacity] = useState(0);
  const [search, setSearch] = useState('');

  const halls = services.filter((s) => s.category?.toLowerCase() === 'hall');

  const filteredHalls = halls.filter((h) => {
    if (district !== 'all' && !h.district?.toLowerCase().includes(district.toLowerCase())) return false;
    if (capacity && (h.capacity || h.guestCapacity || 0) < capacity) return false;
    if (search && !(h.name || h.serviceName || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-wed-ivory rounded-3xl p-8 border border-wed-gold/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wed-gold/15 text-wed-gold-dark text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            Kerala Venues
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Wedding Halls & Convention Centres
          </h1>
          <p className="text-xs sm:text-sm text-wed-brown-muted max-w-xl leading-relaxed">
            From majestic backwater island banquet resorts to pillarless grand auditoriums with central air conditioning and lavish guest parking.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hall name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
            />
          </div>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="text-xs bg-wed-cream/40 border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none"
          >
            <option value="all">All Kerala Districts</option>
            {KERALA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="text-xs bg-wed-cream/40 border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none"
          >
            <option value={0}>Any Guest Capacity</option>
            <option value={500}>500+ Guests</option>
            <option value={1000}>1,000+ Guests</option>
            <option value={1500}>1,500+ Guests</option>
            <option value={2000}>2,000+ Guests</option>
          </select>
        </div>

        <div className="text-xs text-wed-brown-muted font-medium">
          Showing <strong>{filteredHalls.length}</strong> venues
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHalls.map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
      </div>
    </div>
  );
};

export default HallsPage;

