import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-wed-brown text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-wed-gold flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Wed<span className="text-wed-gold">Plan</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Kerala's dedicated multi-vendor marketplace connecting couples with premier convention centres, authentic Sadya caterers, stage artisans, and wedding cinematographers across all 14 districts.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span>Registered & Verified Kerala Vendor Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/halls" className="hover:text-wed-gold transition">Wedding Halls & Banquets</Link>
              </li>
              <li>
                <Link to="/catering" className="hover:text-wed-gold transition">Kerala Sadya & Catering</Link>
              </li>
              <li>
                <Link to="/decoration" className="hover:text-wed-gold transition">Mandapam & Stage Decor</Link>
              </li>
              <li>
                <Link to="/photography" className="hover:text-wed-gold transition">Candid Cinema & Photo</Link>
              </li>
              <li>
                <Link to="/event-management" className="hover:text-wed-gold transition">Event Management</Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-wed-gold transition">All-in-One Packages</Link>
              </li>
            </ul>
          </div>

          {/* Coverage Districts */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Key Hubs</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>• Ernakulam (Kochi & Fort Kochi)</li>
              <li>• Thiruvananthapuram (Kowdiar)</li>
              <li>• Kozhikode (Beach & Calicut)</li>
              <li>• Thrissur (Cultural Capital)</li>
              <li>• Kottayam & Alappuzha (Backwaters)</li>
              <li>• Palakkad & Kannur</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Contact WedPlan</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-wed-gold flex-shrink-0 mt-0.5" />
                <span>Panampilly Nagar, Kochi, Kerala 682036</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-wed-gold flex-shrink-0" />
                <span>+91 94000 88220 (Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-wed-gold flex-shrink-0" />
                <span>support@wedplan.kerala.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-wed-gold flex-shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} WedPlan Kerala. All rights reserved. Crafted for Indian Weddings.</p>
          <div className="flex items-center gap-6">
            <Link to="/vendor/register" className="text-wed-gold hover:underline">
              Register as Vendor
            </Link>
            <Link to="/admin/login" className="text-stone-400 hover:text-white">
              Admin Portal
            </Link>
            <Link to="/login" className="text-stone-400 hover:text-white">
              Customer Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

