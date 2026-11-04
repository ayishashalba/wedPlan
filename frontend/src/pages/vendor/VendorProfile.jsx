import React, { useState, useEffect } from 'react';
import { Store, User, Mail, Phone, MapPin, CheckCircle, Save, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { vendorService } from '../../services/vendorService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { KERALA_DISTRICTS } from '../../utils/formatters';

const VendorProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [vendorStatus, setVendorStatus] = useState('pending');

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    address: '',
    yearsExperience: 0,
    description: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await vendorService.getVendorProfile();
        if (data) {
          setFormData({
            businessName: data.businessName || '',
            ownerName: data.ownerName || user?.name || '',
            email: data.email || user?.email || '',
            phone: data.phone || user?.phone || '',
            district: data.district || 'Ernakulam (Kochi)',
            city: data.city || 'Kochi',
            address: data.address || '',
            yearsExperience: data.experience !== undefined ? data.experience : (data.yearsExperience || 0),
            description: data.description || ''
          });
          setVendorStatus(data.verificationStatus || data.status || 'pending');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load your vendor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSaved(false);

    try {
      const updated = await vendorService.updateVendorProfile(formData);
      updateUserProfile({
        businessName: formData.businessName,
        name: formData.ownerName,
        phone: formData.phone,
        district: formData.district
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading vendor profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            Business Profile & Verification
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Update your commercial details, contact coordinates, and location in Kerala.
          </p>
        </div>
        <StatusBadge status={vendorStatus} />
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Business profile details saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-wed-brown">Business Legal / Trade Name</label>
              <div className="relative">
                <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wed-brown">Proprietor / Contact Person</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wed-brown">Years of Experience</label>
              <div className="relative">
                <Award className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wed-brown">Business Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wed-brown">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wed-brown">Kerala District</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wed-brown">City / Municipality</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-wed-brown">Full Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-wed-brown">Business Overview</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs p-3.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProfile;
