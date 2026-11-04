import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';
import { KERALA_DISTRICTS, SERVICE_CATEGORIES } from '../utils/formatters';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-wed-gold" />
          <h3 className="font-serif font-bold text-lg text-wed-brown">Filter Services</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-wed-gold-dark hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-bold text-wed-brown block mb-3">
          Service Category
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-xs text-wed-brown cursor-pointer">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filters.category === 'all' || !filters.category}
              onChange={() => onFilterChange('category', 'all')}
              className="accent-wed-gold"
            />
            All Categories
          </label>
          {SERVICE_CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 text-xs text-wed-brown cursor-pointer">
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={filters.category === c.id}
                onChange={() => onFilterChange('category', c.id)}
                className="accent-wed-gold"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* District Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-bold text-wed-brown block mb-2">
          District (Kerala)
        </label>
        <select
          value={filters.district || 'all'}
          onChange={(e) => onFilterChange('district', e.target.value)}
          className="w-full text-xs bg-wed-cream/50 border border-stone-200 rounded-xl px-3 py-2 text-wed-brown focus:outline-none focus:ring-1 focus:ring-wed-gold"
        >
          <option value="all">All Districts</option>
          {KERALA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-bold text-wed-brown block mb-2">
          Budget / Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-wed-brown-muted">Min (₹)</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', Number(e.target.value) || 0)}
              className="w-full text-xs bg-wed-cream/50 border border-stone-200 rounded-xl p-2 outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-wed-brown-muted">Max (₹)</span>
            <input
              type="number"
              placeholder="e.g. 200000"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', Number(e.target.value) || Infinity)}
              className="w-full text-xs bg-wed-cream/50 border border-stone-200 rounded-xl p-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Guest Capacity Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-bold text-wed-brown block mb-2">
          Minimum Guest Capacity
        </label>
        <select
          value={filters.minCapacity || 0}
          onChange={(e) => onFilterChange('minCapacity', Number(e.target.value))}
          className="w-full text-xs bg-wed-cream/50 border border-stone-200 rounded-xl px-3 py-2 text-wed-brown focus:outline-none focus:ring-1 focus:ring-wed-gold"
        >
          <option value={0}>Any Capacity</option>
          <option value={200}>200+ Guests</option>
          <option value={500}>500+ Guests</option>
          <option value={1000}>1,000+ Guests</option>
          <option value={1500}>1,500+ Guests</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-bold text-wed-brown block mb-2">
          Customer Rating
        </label>
        <div className="space-y-1.5">
          {[4.8, 4.5, 4.0].map((rate) => (
            <label key={rate} className="flex items-center gap-2 text-xs text-wed-brown cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rate}
                onChange={() => onFilterChange('minRating', rate)}
                className="accent-wed-gold"
              />
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {rate} & above
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-xs text-wed-brown cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating || filters.minRating === 0}
              onChange={() => onFilterChange('minRating', 0)}
              className="accent-wed-gold"
            />
            Any Rating
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

