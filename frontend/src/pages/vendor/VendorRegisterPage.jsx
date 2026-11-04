import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Eye,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Briefcase,
  HeadphonesIcon,
  AlertCircle,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── Data ─────────────────────────────────────────────────────────── */
const benefits = [
  {
    icon: Users,
    title: 'More Customers',
    desc: 'Reach couples searching for wedding services across Kerala and grow your client base organically.'
  },
  {
    icon: Eye,
    title: 'Online Visibility',
    desc: 'Showcase your business, services, photos, and transparent pricing to thousands of engaged couples.'
  },
  {
    icon: CalendarCheck,
    title: 'Easy Booking Management',
    desc: 'Receive and manage customer booking requests directly from your personalised vendor dashboard.'
  },
  {
    icon: TrendingUp,
    title: 'Business Growth',
    desc: 'Build your reputation with verified reviews and reach more potential customers across all 14 districts.'
  }
];

const steps = [
  { num: '01', title: 'Create Your Vendor Account', desc: 'Register with your business email. Select "Wedding Vendor" during sign-up.' },
  { num: '02', title: 'Get Verified by WedPlan Admin', desc: 'Our team reviews your business details and credentials before activating your profile.' },
  { num: '03', title: 'Add Services, Photos & Pricing', desc: 'Build your listing with high-quality photos, detailed service descriptions, and clear pricing.' },
  { num: '04', title: 'Receive & Manage Bookings', desc: 'Accept or decline booking requests and communicate with customers through your dashboard.' }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    highlight: false,
    features: ['Basic business profile', 'Up to 3 service listings', 'Customer enquiry requests', 'WedPlan badge']
  },
  {
    name: 'Professional',
    price: '₹999',
    period: 'per month',
    highlight: true,
    features: ['Unlimited service listings', 'Priority search placement', 'Photo gallery (up to 30)', 'Booking analytics', 'Dedicated support']
  },
  {
    name: 'Premium',
    price: '₹1,999',
    period: 'per month',
    highlight: false,
    features: ['Everything in Professional', 'Featured homepage listing', 'Social media promotion', 'Verified Business badge', 'Advanced analytics']
  }
];

const supportItems = [
  { icon: ShieldCheck, label: 'Business account verification and trust badge' },
  { icon: Briefcase, label: 'Service listing creation and management tools' },
  { icon: CalendarCheck, label: 'Booking request and calendar management' },
  { icon: Star, label: 'Customer visibility across all of Kerala' },
  { icon: HeadphonesIcon, label: 'Dedicated support for account and platform issues' }
];

/* ─── Component ─────────────────────────────────────────────────────── */
const VendorRegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isVendor, isCustomer } = useAuth();
  const [customerWarning, setCustomerWarning] = useState(false);

  const handleVendorCTA = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else if (isVendor) {
      navigate('/vendor/dashboard');
    } else if (isCustomer) {
      setCustomerWarning(true);
    } else {
      navigate('/register');
    }
  };

  const ctaLabel = isVendor
    ? 'Go to Vendor Dashboard'
    : isCustomer
    ? 'Create a Separate Vendor Account'
    : 'Create Vendor Account';

  return (
    <div className="min-h-screen bg-wed-cream/30">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wed-brown via-stone-800 to-stone-900 text-white">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=60')"
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-wed-gold/20 border border-wed-gold/40 text-wed-gold text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-wed-gold" />
            Vendor Partnership Programme
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Grow Your Wedding Business<br className="hidden sm:block" /> with WedPlan
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Join Kerala's premier wedding marketplace and connect with couples looking for trusted
            wedding professionals and services across all 14 districts.
          </p>

          {/* Customer warning */}
          {customerWarning && (
            <div className="max-w-lg mx-auto flex items-start gap-2 p-4 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                You are currently logged in as a <strong>Customer</strong>. To become a vendor,
                please{' '}
                <Link to="/register" className="underline font-semibold">
                  create a separate Vendor account
                </Link>
                . You cannot convert an existing customer account into a vendor account.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleVendorCTA}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-wed-gold hover:bg-wed-gold-dark text-white font-bold rounded-xl transition shadow-lg text-sm"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 border border-white/30 hover:border-white/60 text-white font-semibold rounded-xl transition text-sm"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Join ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">Why Partner With Us</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">Why Join WedPlan?</h2>
          <p className="text-sm text-wed-brown-muted max-w-xl mx-auto">
            Thousands of couples across Kerala plan their dream weddings on WedPlan every year.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-3 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-wed-gold/10 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-wed-gold-dark" />
              </div>
              <h3 className="font-serif font-bold text-wed-brown text-base">{title}</h3>
              <p className="text-xs text-wed-brown-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="bg-white border-y border-stone-200/80 py-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">How Does It Work?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, title, desc }, idx) => (
              <div key={num} className="relative text-center space-y-3">
                {/* connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-wed-gold/30" />
                )}
                <div className="w-14 h-14 rounded-full bg-wed-gold flex items-center justify-center mx-auto text-white font-bold text-lg shadow-md">
                  {num}
                </div>
                <h3 className="font-serif font-bold text-wed-brown text-sm leading-snug">{title}</h3>
                <p className="text-xs text-wed-brown-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vendor Pricing ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">Transparent Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">Vendor Pricing Plans</h2>
          <p className="text-sm text-wed-brown-muted max-w-xl mx-auto">
            Start for free and upgrade as your business grows. No hidden charges — pricing is communicated
            transparently before you go live.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pricingPlans.map(({ name, price, period, highlight, features }) => (
            <div
              key={name}
              className={`rounded-2xl p-7 border flex flex-col gap-5 transition ${
                highlight
                  ? 'bg-wed-brown text-white border-wed-brown shadow-xl scale-[1.03]'
                  : 'bg-white text-wed-brown border-stone-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              {highlight && (
                <span className="self-start px-2.5 py-0.5 rounded-full bg-wed-gold text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-stone-300' : 'text-wed-brown-muted'}`}>
                  {name}
                </p>
                <p className="text-3xl font-bold">{price}</p>
                <p className={`text-xs mt-0.5 ${highlight ? 'text-stone-400' : 'text-wed-brown-muted'}`}>{period}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${highlight ? 'text-wed-gold' : 'text-wed-gold-dark'}`} />
                    <span className={highlight ? 'text-stone-200' : 'text-wed-brown-muted'}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleVendorCTA}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition ${
                  highlight
                    ? 'bg-wed-gold hover:bg-wed-gold-dark text-white'
                    : 'border border-wed-gold text-wed-gold-dark hover:bg-wed-gold/10'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── How Customers Contact You ─────────────────────────────── */}
      <section className="bg-stone-50 border-y border-stone-200/80 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">Customer Journey</p>
            <h2 className="text-3xl font-serif font-bold text-wed-brown">How Customers Contact You</h2>
            <ul className="space-y-4">
              {[
                'Couples discover your profile and services through WedPlan search.',
                'They view your business details, photos, and transparent pricing.',
                'Interested customers submit a booking request directly to you.',
                'You accept or decline — and both parties receive instant status updates.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-wed-brown-muted leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-wed-gold text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=70"
              alt="Kerala wedding ceremony"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── WedPlan Support for Vendors ───────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-wed-gold-dark">Our Commitment</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wed-brown">How WedPlan Supports Vendors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-wed-gold/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-wed-gold-dark" />
              </div>
              <p className="text-xs text-wed-brown-muted leading-relaxed pt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-wed-gold to-wed-gold-dark text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Ready to Grow Your Wedding Business?
          </h2>
          <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Become a WedPlan partner today. Join hundreds of trusted vendors across Kerala who
            are growing their wedding business with us.
          </p>

          {customerWarning && (
            <div className="max-w-lg mx-auto flex items-start gap-2 p-4 rounded-xl bg-white/10 border border-white/30 text-white/90 text-xs text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                You are logged in as a <strong>Customer</strong>. Please{' '}
                <Link to="/register" className="underline font-semibold">
                  create a separate Vendor account
                </Link>{' '}
                to list your services on WedPlan.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleVendorCTA}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-wed-gold-dark font-bold rounded-xl transition hover:bg-stone-100 shadow-lg text-sm"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="px-10 py-4 border border-white/40 hover:border-white text-white font-semibold rounded-xl transition text-sm"
            >
              Explore WedPlan
            </Link>
          </div>
          <p className="text-xs text-white/60">
            Already a vendor?{' '}
            <Link to="/login" className="underline">
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default VendorRegisterPage;
