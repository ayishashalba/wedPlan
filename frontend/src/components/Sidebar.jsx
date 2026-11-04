import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  User,
  LogOut,
  ShoppingBag,
  PlusCircle,
  Package,
  Layers,
  Store,
  Users,
  Settings,
  ShieldCheck,
  Building,
  CheckCircle,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role = 'customer' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
      isActive
        ? 'bg-wed-gold text-white shadow-md'
        : 'text-wed-brown-light hover:bg-stone-100 hover:text-wed-brown'
    }`;

  const renderNavLinks = () => {
    if (role === 'customer') {
      return (
        <>
          <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-wed-brown-muted">
            Customer Menu
          </div>
          <NavLink to="/customer/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Overview
          </NavLink>
          <NavLink to="/customer/bookings" className={linkClass}>
            <CalendarCheck2 className="w-4 h-4" />
            My Bookings
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            <ShoppingBag className="w-4 h-4" />
            Browse Services
          </NavLink>
          <NavLink to="/packages" className={linkClass}>
            <Package className="w-4 h-4" />
            Wedding Packages
          </NavLink>
          <NavLink to="/customer/profile" className={linkClass}>
            <User className="w-4 h-4" />
            My Profile
          </NavLink>
        </>
      );
    }

    if (role === 'vendor') {
      return (
        <>
          <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-wed-brown-muted">
            Vendor Portal
          </div>
          <NavLink to="/vendor/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink to="/vendor/services" className={linkClass}>
            <Layers className="w-4 h-4" />
            Manage Services
          </NavLink>
          <NavLink to="/vendor/services/add" className={linkClass}>
            <PlusCircle className="w-4 h-4" />
            Add New Service
          </NavLink>
          <NavLink to="/vendor/packages" className={linkClass}>
            <Package className="w-4 h-4" />
            Manage Packages
          </NavLink>
          <NavLink to="/vendor/bookings" className={linkClass}>
            <CalendarCheck2 className="w-4 h-4" />
            Booking Requests
          </NavLink>
          <NavLink to="/vendor/profile" className={linkClass}>
            <Store className="w-4 h-4" />
            Business Profile
          </NavLink>
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-wed-brown-muted">
            Admin Administration
          </div>
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" />
            Overview Analytics
          </NavLink>
          <NavLink to="/admin/vendors" className={linkClass}>
            <ShieldCheck className="w-4 h-4" />
            Vendor Approvals
          </NavLink>
          <NavLink to="/admin/customers" className={linkClass}>
            <Users className="w-4 h-4" />
            Customer Management
          </NavLink>
          <NavLink to="/admin/services" className={linkClass}>
            <Layers className="w-4 h-4" />
            Service Listings
          </NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>
            <CalendarCheck2 className="w-4 h-4" />
            All Bookings
          </NavLink>
          <NavLink to="/admin/settings" className={linkClass}>
            <Settings className="w-4 h-4" />
            Admin Settings
          </NavLink>
        </>
      );
    }

    return null;
  };

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-stone-200/80 p-5 flex flex-col justify-between min-h-[calc(100vh-80px)]">
      <div className="space-y-6">
        {/* User Mini Profile */}
        <div className="bg-wed-cream/50 p-4 rounded-2xl border border-stone-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-wed-gold text-white flex items-center justify-center font-bold font-serif text-base">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-serif font-bold text-sm text-wed-brown truncate">
              {user?.businessName || user?.name || 'WedPlan User'}
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-wed-gold-dark block">
              {role} Account
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5 flex flex-col">
          {renderNavLinks()}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-6 border-t border-stone-100 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Account
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

