import React from 'react';
import { Package, Sparkles } from 'lucide-react';
import { useServices } from '../../context/ServiceContext';
import PackageCard from '../../components/PackageCard';

const VendorPackages = () => {
  const { packages } = useServices();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
          Manage Wedding Packages
        </h1>
        <p className="text-xs text-wed-brown-muted mt-1">
          Bundled Kerala wedding arrangements combining your venue with verified Sadya caterers and stage artists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

export default VendorPackages;

