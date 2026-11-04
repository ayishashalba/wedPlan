import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Utensils,
  Sparkles,
  Camera,
  CalendarHeart,
  Package,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  Heart,
  Quote,
  Briefcase
} from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import ServiceCard from '../../components/ServiceCard';
import PackageCard from '../../components/PackageCard';
import VendorCard from '../../components/VendorCard';
import { useServices } from '../../context/ServiceContext';
import { useVendors } from '../../context/VendorContext';

const HomePage = () => {
  const { services, packages } = useServices();
  const { approvedVendors } = useVendors();

  const featuredServices = services.slice(0, 4);
  const featuredPackages = packages.slice(0, 3);
  const topVendors = approvedVendors.length > 0
    ? approvedVendors.slice(0, 3)
    : services
        .map((s) => (s.vendorProfile ? {
          id: s.vendorProfile._id || s.vendorProfile.id || s.vendorId,
          businessName: s.vendorProfile.businessName || s.vendorName,
          logo: s.vendorProfile.logo || s.image,
          category: s.categoryLabel || s.category,
          district: s.vendorProfile.district || s.district,
          city: s.vendorProfile.city || s.city,
          rating: s.vendorProfile.rating || s.rating || 5.0,
          description: s.description
        } : null))
        .filter(Boolean)
        .filter((v, idx, arr) => arr.findIndex((item) => item.businessName === v.businessName) === idx)
        .slice(0, 3);

  const categories = [
    {
      id: 'hall',
      title: 'Wedding Halls',
      count: '350+ Venues',
      desc: 'Iconic backwater resorts, air-conditioned convention centres & royal banquets.',
      icon: Building2,
      path: '/halls',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'catering',
      title: 'Kerala Sadya & Catering',
      count: '180+ Caterers',
      desc: 'Authentic 28-dish traditional feast on plantain leaves & Malabar Dum Biryanis.',
      icon: Utensils,
      path: '/catering',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'decoration',
      title: 'Floral & Stage Decor',
      count: '220+ Artisans',
      desc: 'Breathtaking jasmine mandapams, crystal chandeliers & modern pastel themes.',
      icon: Sparkles,
      path: '/decoration',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'photography',
      title: 'Photography & Cinema',
      count: '140+ Studios',
      desc: 'Poetic candid wedding stories, 4K teasers, aerial drone footage & luxury albums.',
      icon: Camera,
      path: '/photography',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'event-management',
      title: 'Event Management',
      count: '90+ Planners',
      desc: 'End-to-end wedding planners, guest hospitality, chenda melam & artist booking.',
      icon: CalendarHeart,
      path: '/event-management',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Discover & Compare',
      desc: 'Search verified convention halls, sadya masters, and photographers across Kochi, Trivandrum, Calicut and all Kerala districts.'
    },
    {
      num: '02',
      title: 'Customize Your Request',
      desc: 'Select preferred muhurtham dates, guest headcounts, culinary menus, and floral themes. Book individual vendors or bundled packages.'
    },
    {
      num: '03',
      title: 'Direct Vendor Confirmation',
      desc: 'Receive transparent quotations and confirmed dates directly from licensed vendors with complete peace of mind.'
    }
  ];

  const testimonials = [
    {
      quote:
        'Booking both the Bolgatty Island hall and Annapoorna Sadya through WedPlan saved us weeks of stressful running around. Everything went like a fairytale!',
      couple: 'Dr. Gopika & Sreerag',
      location: 'Kochi Wedding, Jan 2026',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote:
        'The transparent package pricing and direct chat with Lumiere Cinematography made our NRI wedding planning from Dubai seamless and transparent.',
      couple: 'Faisal & Shabana',
      location: 'Kozhikode Nikah, Feb 2026',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote:
        'Our traditional temple mandapam decor was executed beyond perfection. The team coordinated with the temple trust and delivered pure magic.',
      couple: 'Naveen & Gayathri',
      location: 'Thrissur Wedding, Dec 2025',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] flex items-center justify-center pt-16 pb-28 px-4 overflow-hidden">
        {/* Background Image with Warm Kerala Wedding Atmosphere */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="Kerala Wedding Mandapam"
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wed-brown/70 via-wed-brown/50 to-wed-cream" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-wed-blush uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-wed-gold" />
            Kerala's Premier Multi-Vendor Wedding Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
            Plan Your Dream Wedding, <br />
            <span className="text-wed-gold-light italic">All in One Place</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-200 font-normal leading-relaxed drop-shadow">
            Connect with certified convention halls, authentic Sadya caterers, stage designers, and candid cinematographers across all 14 districts of Kerala.
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* EXPLORE SERVICES CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">
            Curated Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Explore Wedding Services
          </h2>
          <p className="text-sm text-wed-brown-muted leading-relaxed">
            Everything required for a magnificent celebration, vetted for quality and verified for your special day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-luxury-hover hover:-translate-y-1 transition duration-300 flex flex-col"
              >
                <div className="relative h-40 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2 rounded-xl text-wed-gold shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-wed-brown group-hover:text-wed-gold-dark transition mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-wed-brown-muted mb-3 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-wed-gold-dark">
                    <span>{cat.count}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED COMBINED PACKAGES */}
      <section className="bg-wed-ivory py-16 border-y border-wed-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark block mb-2">
                Hassle-Free All-In-One
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
                Featured Wedding Packages
              </h2>
              <p className="text-sm text-wed-brown-muted mt-2 max-w-xl">
                Pre-bundled packages combining venue, traditional feast, stage styling, and cinematography at exclusive platform rates.
              </p>
            </div>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-sm font-bold text-wed-gold-dark hover:text-wed-brown transition"
            >
              View All Packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark block mb-2">
              Top Rated Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
              Popular Wedding Choices in Kerala
            </h2>
            <p className="text-sm text-wed-brown-muted mt-2 max-w-xl">
              From waterfront island ballrooms to royal Sadya masters, handpicked for exceptional celebration memories.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-wed-gold-dark hover:text-wed-brown transition"
          >
            Explore All Listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* POPULAR VENDORS IN KERALA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">
            Verified Partners
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Trusted Kerala Wedding Vendors
          </h2>
          <p className="text-sm text-wed-brown-muted">
            Licensed event businesses thoroughly verified by the WedPlan administration team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* HOW WEDPLAN WORKS */}
      <section className="bg-wed-brown text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-wed-gold">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              How WedPlan Works
            </h2>
            <p className="text-sm text-stone-300">
              Three clear steps to organize your perfect Kerala wedding celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-stone-900/40 border border-stone-800 rounded-3xl p-8 relative space-y-4 hover:border-wed-gold/50 transition"
              >
                <div className="font-serif font-extrabold text-4xl text-wed-gold">
                  {s.num}
                </div>
                <h3 className="font-serif font-bold text-xl text-white">{s.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BECOME A VENDOR CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 to-wed-brown text-white p-8 sm:p-12 lg:p-16 shadow-luxury">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wed-gold/20 text-wed-gold-light text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              Vendor Growth Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Are You a Wedding Hall Owner, Caterer, or Photographer?
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Showcase your services to thousands of couples planning weddings in Kerala. Gain verified booking leads, manage your schedule, and grow your wedding business effortlessly.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/vendor/register"
                className="px-6 py-3 bg-wed-gold hover:bg-wed-gold-dark text-white font-semibold rounded-xl transition shadow-md text-sm"
              >
                Register Your Business Today
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-stone-600 hover:border-stone-400 text-stone-200 text-sm font-semibold rounded-xl transition"
              >
                Vendor Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">
            Loved by Kerala Couples
          </h2>
          <p className="text-sm text-wed-brown-muted">
            Read what happy couples say about planning their celebrations with WedPlan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div>
                <Quote className="w-8 h-8 text-wed-gold/40 mb-3" />
                <p className="text-xs text-wed-brown leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img
                  src={t.avatar}
                  alt={t.couple}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-wed-brown">{t.couple}</h4>
                  <span className="text-[11px] text-wed-brown-muted block">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

