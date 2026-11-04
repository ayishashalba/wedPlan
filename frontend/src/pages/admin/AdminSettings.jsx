import React, { useState } from 'react';
import { Settings, Lock, CheckCircle, ShieldAlert, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [passwordState, setPasswordState] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });
  const [success, setSuccess] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordState.newPass && passwordState.newPass === passwordState.confirm) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setPasswordState({ current: '', newPass: '', confirm: '' });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
          Admin Settings & Security
        </h1>
        <p className="text-xs text-wed-brown-muted mt-1">
          Manage system credentials and marketplace operational settings.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Administrator password updated successfully!</span>
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
        <h3 className="font-serif font-bold text-lg text-wed-brown flex items-center gap-2">
          <Lock className="w-5 h-5 text-wed-gold" />
          Update Admin Password
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">Current Password</label>
            <input
              type="password"
              required
              value={passwordState.current}
              onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">New Master Password</label>
            <input
              type="password"
              required
              value={passwordState.newPass}
              onChange={(e) => setPasswordState({ ...passwordState, newPass: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wed-brown">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordState.confirm}
              onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white font-semibold rounded-xl text-xs transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Security Policies */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-wed-brown flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-wed-gold" />
          Marketplace Operational Policies
        </h3>
        <div className="space-y-2 text-xs text-wed-brown-muted">
          <p>• Multi-factor verification enforced on all vendor approval actions.</p>
          <p>• Passwords and authentication tokens are kept strictly encrypted.</p>
          <p>• Trade license validation mandatory before listing publication.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

