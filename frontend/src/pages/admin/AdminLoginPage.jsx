import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@wedplan.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const errorTimerRef = useRef(null);

  // Show an error message that auto-dismisses after 5 seconds
  const showError = (msg) => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setError(msg);
    errorTimerRef.current = setTimeout(() => setError(''), 5000);
  };

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please provide both administrator email and password');
      return;
    }

    setSubmitting(true);
    setError('');
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);

    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        if (res.user.role !== 'admin') {
          await logout();
          showError('Access denied: Administrator privileges required.');
          return;
        }
        navigate('/admin/dashboard');
      }
    } catch (err) {
      showError(err.message || 'Unauthorized access. Valid admin credentials required.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-wed-gold flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            WedPlan Control Portal
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Kerala State Administration & Vendor Verification System
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wedplan.com"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-700 bg-stone-800 text-white focus:outline-none focus:ring-2 focus:ring-wed-gold/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-stone-700 bg-stone-800 text-white focus:outline-none focus:ring-2 focus:ring-wed-gold/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-wed-gold hover:bg-wed-gold-dark text-white font-bold rounded-xl transition shadow-md text-xs uppercase tracking-wider disabled:opacity-50 mt-4"
          >
            {submitting ? 'Verifying Access...' : 'Sign In to Administration'}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-800 text-center">
          <Link to="/" className="text-xs text-stone-400 hover:text-white transition">
            ← Return to WedPlan Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
