import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KERALA_DISTRICTS } from '../../utils/formatters';

const CustomerProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    district: user?.district || 'Ernakulam (Kochi)'
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">My Profile</h1>
        <p className="text-xs text-wed-brown-muted mt-1">
          Manage your personal details and primary Kerala district preference.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-stone-400">Email cannot be modified directly.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">Contact Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">Primary Kerala District</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wed-gold hover:bg-wed-gold-dark text-white font-semibold rounded-xl text-xs transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;

