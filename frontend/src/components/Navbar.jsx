import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Utensils,
  Sparkles,
  Camera,
  CalendarHeart,
  Package,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, switchDemoRole, isAuthenticated, isCustomer, isVendor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isVendor) return '/vendor/dashboard';
    return '/customer/dashboard';
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition py-1 relative ${
      isActive
        ? 'text-wed-gold-dark font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-wed-gold'
        : 'text-wed-brown hover:text-wed-gold'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-wed-ivory/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition">
      {/* Top Demo Bar / Quick Role Switcher for instant evaluator testing */}
      <div className="bg-wed-brown text-wed-ivory text-xs py-1.5 px-4 hidden md:block border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300">
              WedPlan Kerala Wedding Marketplace Demo — Switch persona:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => switchDemoRole('customer')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                isCustomer ? 'bg-wed-gold text-white' : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Customer (Anjali)
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={() => switchDemoRole('vendor')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                isVendor ? 'bg-wed-gold text-white' : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Vendor (Bolgatty Palace)
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={() => switchDemoRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                isAdmin ? 'bg-wed-gold text-white' : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Platform Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-wed-gold flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-serif font-extrabold text-2xl tracking-tight text-wed-brown">
                Wed<span className="text-wed-gold">Plan</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-wed-gold-dark font-semibold">
                Kerala Weddings
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <NavLink to="/services" className={navLinkClasses}>
                <span className="flex items-center gap-1">
                  Explore Services
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </NavLink>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-64 pt-2 shadow-2xl z-50">
                  <div className="bg-white rounded-2xl p-2 border border-stone-200/90 shadow-xl space-y-1">
                    <Link
                      to="/halls"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-wed-cream/70 text-xs font-semibold text-wed-brown hover:text-wed-gold-dark transition"
                    >
                      <Building2 className="w-4 h-4 text-wed-gold" />
                      Wedding Halls & Banquets
                    </Link>
                    <Link
                      to="/catering"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-wed-cream/70 text-xs font-semibold text-wed-brown hover:text-wed-gold-dark transition"
                    >
                      <Utensils className="w-4 h-4 text-wed-gold" />
                      Kerala Sadya & Catering
                    </Link>
                    <Link
                      to="/decoration"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-wed-cream/70 text-xs font-semibold text-wed-brown hover:text-wed-gold-dark transition"
                    >
                      <Sparkles className="w-4 h-4 text-wed-gold" />
                      Stage & Mandapam Decor
                    </Link>
                    <Link
                      to="/photography"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-wed-cream/70 text-xs font-semibold text-wed-brown hover:text-wed-gold-dark transition"
                    >
                      <Camera className="w-4 h-4 text-wed-gold" />
                      Photography & Cinema
                    </Link>
                    <Link
                      to="/event-management"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-wed-cream/70 text-xs font-semibold text-wed-brown hover:text-wed-gold-dark transition"
                    >
                      <CalendarHeart className="w-4 h-4 text-wed-gold" />
                      Event Management
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/packages" className={navLinkClasses}>
              Packages
            </NavLink>

            <NavLink to="/vendor/register" className={navLinkClasses}>
              <span className="flex items-center gap-1.5 text-wed-gold-dark font-medium">
                <Briefcase className="w-3.5 h-3.5" />
                Become a Vendor
              </span>
            </NavLink>
          </nav>

          {/* User Section / Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-wed-gold/15 text-wed-gold-dark hover:bg-wed-gold hover:text-white font-semibold text-xs transition border border-wed-gold/30"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {user.name?.split(' ')[0]} ({user.role})
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-wed-brown-muted hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-wed-brown hover:text-wed-gold-dark transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-wed-gold hover:bg-wed-gold-dark rounded-xl transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-wed-brown hover:bg-stone-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-4 shadow-xl">
          {/* Quick Demo Switcher on mobile */}
          <div className="bg-wed-cream p-3 rounded-xl mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-wed-brown-muted block mb-2">
              Demo Quick Test Persona:
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  switchDemoRole('customer');
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-semibold py-1 bg-white border border-stone-200 rounded text-center"
              >
                Customer
              </button>
              <button
                onClick={() => {
                  switchDemoRole('vendor');
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-semibold py-1 bg-white border border-stone-200 rounded text-center"
              >
                Vendor
              </button>
              <button
                onClick={() => {
                  switchDemoRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-semibold py-1 bg-white border border-stone-200 rounded text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3 font-medium text-sm text-wed-brown">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-wed-gold"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-wed-gold"
            >
              Explore All Services
            </Link>
            <div className="pl-4 space-y-2 text-xs text-wed-brown-light border-l-2 border-wed-gold/40">
              <Link to="/halls" onClick={() => setMobileMenuOpen(false)} className="block py-0.5">
                • Wedding Halls
              </Link>
              <Link to="/catering" onClick={() => setMobileMenuOpen(false)} className="block py-0.5">
                • Catering & Sadya
              </Link>
              <Link to="/decoration" onClick={() => setMobileMenuOpen(false)} className="block py-0.5">
                • Stage Decoration
              </Link>
              <Link to="/photography" onClick={() => setMobileMenuOpen(false)} className="block py-0.5">
                • Photography
              </Link>
              <Link to="/event-management" onClick={() => setMobileMenuOpen(false)} className="block py-0.5">
                • Event Management
              </Link>
            </div>
            <Link
              to="/packages"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-wed-gold"
            >
              Wedding Packages
            </Link>
            <Link
              to="/vendor/register"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-wed-gold-dark font-semibold"
            >
              Become a Vendor
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-wed-gold text-white font-semibold text-sm"
                >
                  Go to {user.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs text-rose-600 font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-stone-300 rounded-xl text-sm font-semibold text-wed-brown"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-wed-gold text-white rounded-xl text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

