import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useServices } from '../../context/ServiceContext';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPackageById } = useServices();

  const [pkg, setPkg] = useState(() => getPackageById(id));
  const [loading, setLoading] = useState(!pkg);

  useEffect(() => {
    const existing = getPackageById(id);
    if (existing) {
      setPkg(existing);
      setLoading(false);
    } else {
      serviceService.getPackageById(id).then((res) => {
        if (res) {
          setPkg({
            ...res,
            id: res._id || res.id,
            name: res.packageName || res.name,
            includes: res.includedServices || res.includes || []
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, getPackageById]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading package details..." />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-wed-brown mb-4">Package Not Found</h2>
        <Link
          to="/packages"
          className="px-5 py-2.5 bg-wed-gold text-white text-xs font-semibold rounded-xl"
        >
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-wed-brown hover:text-wed-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Packages
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-[360px] sm:h-[420px] shadow-luxury">
        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wed-gold text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Wedding Bundle
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">{pkg.name}</h1>
          <p className="text-sm text-wed-blush max-w-xl">{pkg.tagline}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-wed-brown">Package Overview</h2>
            <p className="text-sm text-wed-brown-light leading-relaxed">{pkg.description}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-wed-brown">What's Included in This Package</h2>
            <div className="space-y-3 pt-2">
              {pkg.includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-wed-cream/40 border border-stone-200/60">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-wed-gold-dark">{item.category}</h4>
                    <p className="text-sm text-wed-brown font-medium mt-0.5">{item.item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pkg.highlights && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-2xl text-wed-brown">Key Highlights & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-wed-cream/50 text-xs font-semibold text-wed-brown">
                    <Sparkles className="w-4 h-4 text-wed-gold flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Pricing Box */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-wed-gold/40 shadow-luxury sticky top-28 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-wed-brown-muted block mb-1">
                Total Combined Package Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-wed-brown">
                  {formatCurrency(pkg.discountPrice || pkg.price)}
                </span>
                {pkg.discountPrice && (
                  <span className="text-sm line-through text-stone-400">
                    {formatCurrency(pkg.price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ Includes tax & all included vendor coordination
              </p>
            </div>

            <div className="space-y-3 text-xs bg-wed-cream/50 p-4 rounded-2xl border border-stone-200/60">
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Coverage District:</span>
                <span className="font-bold text-wed-brown">{pkg.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Event Duration:</span>
                <span className="font-bold text-wed-brown">{pkg.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-wed-brown-muted">Package Rating:</span>
                <span className="font-bold text-wed-brown flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {pkg.rating} ({pkg.reviewCount} reviews)
                </span>
              </div>
            </div>

            <Link
              to={`/booking/package-${pkg.id}`}
              className="w-full py-3.5 bg-wed-gold hover:bg-wed-gold-dark text-white font-bold rounded-xl transition shadow-md text-xs uppercase tracking-wider block text-center"
            >
              Reserve Wedding Package
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;

