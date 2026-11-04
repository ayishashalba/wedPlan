import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Grid, List, ChevronDown } from 'lucide-react';
import ServiceCard from '../../components/ServiceCard';
import FilterPanel from '../../components/FilterPanel';
import EmptyState from '../../components/EmptyState';
import { useServices } from '../../context/ServiceContext';

const PAGE_SIZE = 12;

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterServices } = useServices();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    district: searchParams.get('district') || 'all',
    minPrice: 0,
    maxPrice: Infinity,
    minCapacity: Number(searchParams.get('capacity')) || 0,
    minRating: 0,
    searchQuery: searchParams.get('q') || ''
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      category: 'all',
      district: 'all',
      minPrice: 0,
      maxPrice: Infinity,
      minCapacity: 0,
      minRating: 0,
      searchQuery: ''
    });
  };

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const filteredList = useMemo(() => {
    return filterServices(filters);
  }, [filters, filterServices]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const hasMore = visibleCount < filteredList.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark block mb-1">
            Browse All Wedding Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Kerala Wedding Marketplace
          </h1>
          <p className="text-sm text-wed-brown-muted mt-1">
            Discover verified convention centres, caterers, decorators, and cinematographers.
          </p>
        </div>

        {/* Mobile Filter Toggle & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-wed-brown shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-wed-gold" />
            Filters {filters.category !== 'all' ? '(Active)' : ''}
          </button>
        </div>
      </div>

      {/* Main Grid: Filter Panel + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 p-4 flex justify-end lg:hidden">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-bold text-lg">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-stone-500 font-bold text-sm"
                >
                  ✕ Close
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar & Result Counter */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search vendor name, hall, sadya, photo..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/40 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
            <div className="text-xs text-wed-brown-muted w-full sm:w-auto text-right">
              Showing <strong className="text-wed-brown">{displayedList.length}</strong> of{' '}
              <strong className="text-wed-brown">{filteredList.length}</strong> matching services
            </div>
          </div>

          {/* Cards Grid */}
          {displayedList.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedList.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-stone-300 hover:border-wed-gold hover:text-wed-gold text-wed-brown text-xs font-bold rounded-2xl transition shadow-sm hover:shadow"
                  >
                    <span>Load More Services</span>
                    <span className="text-[11px] bg-wed-cream px-2 py-0.5 rounded-full text-wed-brown-muted">
                      {filteredList.length - displayedList.length} remaining
                    </span>
                    <ChevronDown className="w-4 h-4 text-wed-gold" />
                  </button>
                </div>
              )}

              {!hasMore && filteredList.length > PAGE_SIZE && (
                <div className="pt-4 text-center text-xs text-wed-brown-muted">
                  All {filteredList.length} services loaded.
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No services match your criteria"
              description="Try adjusting your budget, district selection, or clearing filters to view more vendors."
              actionLabel="Reset All Filters"
              onAction={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

