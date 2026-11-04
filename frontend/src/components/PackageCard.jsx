import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const PackageCard = ({ pkg }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border-2 border-wed-gold/30 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col group relative">
      {/* Top Banner */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
        
        <div className="absolute top-4 left-4 bg-wed-gold text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          All-Inclusive Wedding Bundle
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-serif font-bold text-2xl drop-shadow-sm mb-1">{pkg.name}</h3>
          <p className="text-xs text-wed-blush drop-shadow-sm font-medium">{pkg.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-wed-brown-light mb-6 leading-relaxed">
            {pkg.description}
          </p>

          <h4 className="text-xs uppercase tracking-wider font-bold text-wed-brown mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-wed-gold" />
            What is Included:
          </h4>
          <div className="space-y-2.5 mb-6">
            {pkg.includes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-wed-brown">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>
                  <strong className="text-wed-gold-dark">{item.category}:</strong> {item.item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif text-wed-brown">
                {formatCurrency(pkg.discountPrice || pkg.price)}
              </span>
              {pkg.discountPrice && (
                <span className="text-sm line-through text-stone-400">
                  {formatCurrency(pkg.price)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-wed-brown-muted">Complete bundle pricing</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/booking/package-${pkg.id}`}
              className="px-4 py-2.5 bg-wed-gold text-white font-medium text-xs rounded-xl hover:bg-wed-gold-dark transition shadow-sm"
            >
              Book Package
            </Link>
            <Link
              to={`/packages/${pkg.id}`}
              className="px-3 py-2.5 border border-stone-300 hover:border-wed-gold text-wed-brown font-medium text-xs rounded-xl hover:bg-wed-ivory transition flex items-center gap-1"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;

