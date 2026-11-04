import React from 'react';
import { Package, Sparkles } from 'lucide-react';
import PackageCard from '../../components/PackageCard';
import { useServices } from '../../context/ServiceContext';

const PackagesPage = () => {
  const { packages } = useServices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-wed-ivory rounded-3xl p-8 border border-wed-gold/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wed-gold/15 text-wed-gold-dark text-xs font-semibold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            Complete Wedding Bundles
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Curated Kerala Wedding Packages
          </h1>
          <p className="text-xs sm:text-sm text-wed-brown-muted max-w-xl leading-relaxed">
            All-inclusive wedding packages combining luxury convention centres, traditional 28-dish Sadya catering, floral mandapam styling, and 4K cinema coverage at bundled rates.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;

