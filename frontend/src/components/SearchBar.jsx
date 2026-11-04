import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { KERALA_DISTRICTS, EVENT_TYPES } from '../utils/formatters';

const SearchBar = ({ initialValues = {}, onSearch, compact = false }) => {
  const navigate = useNavigate();
  const [district, setDistrict] = useState(initialValues.district || '');
  const [eventType, setEventType] = useState(initialValues.eventType || '');
  const [eventDate, setEventDate] = useState(initialValues.eventDate || '');
  const [guests, setGuests] = useState(initialValues.guests || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district && district !== 'all') params.set('district', district);
    if (eventType) params.set('eventType', eventType);
    if (eventDate) params.set('date', eventDate);
    if (guests) params.set('capacity', guests);

    if (onSearch) {
      onSearch({ district, eventType, eventDate, guests });
    } else {
      navigate(`/services?${params.toString()}`);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm w-full">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="w-4 h-4 text-wed-gold flex-shrink-0" />
          <input
            type="text"
            placeholder="Search halls, sadya catering, photography..."
            className="w-full text-sm bg-transparent outline-none text-wed-brown placeholder-stone-400"
            onChange={(e) => onSearch && onSearch({ query: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-wed-gold hover:bg-wed-gold-dark text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-luxury border border-stone-200/80 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location / District */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-wed-brown uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-wed-gold" />
            Kerala District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-sm bg-wed-cream/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-wed-brown focus:outline-none focus:ring-2 focus:ring-wed-gold/50 transition"
          >
            <option value="">All Kerala Districts</option>
            {KERALA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-wed-brown uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-wed-gold" />
            Event Type
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full text-sm bg-wed-cream/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-wed-brown focus:outline-none focus:ring-2 focus:ring-wed-gold/50 transition"
          >
            <option value="">Any Celebration</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Event Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-wed-brown uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-wed-gold" />
            Event Date
          </label>
          <input
            type="date"
            value={eventDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full text-sm bg-wed-cream/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-wed-brown focus:outline-none focus:ring-2 focus:ring-wed-gold/50 transition"
          />
        </div>

        {/* Guests */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-wed-brown uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-wed-gold" />
            Number of Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full text-sm bg-wed-cream/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-wed-brown focus:outline-none focus:ring-2 focus:ring-wed-gold/50 transition"
          >
            <option value="">Any Guest Count</option>
            <option value="150">Intimate (&lt; 200)</option>
            <option value="500">Medium (200 - 600)</option>
            <option value="1000">Grand (600 - 1,200)</option>
            <option value="2000">Royal (1,200+)</option>
          </select>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-wed-gold hover:bg-wed-gold-dark text-white font-semibold rounded-xl transition shadow-md"
        >
          <Search className="w-4 h-4" />
          Find Wedding Services
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

