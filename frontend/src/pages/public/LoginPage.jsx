import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../utils/mockData';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const errorTimerRef = useRef(null);

  const from = location.state?.from?.pathname || '/customer/dashboard';

  // Show an error message that auto-dismisses after 5 seconds
  const showError = (msg) => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setError(msg);
    errorTimerRef.current = setTimeout(() => setError(''), 5000);
  };

  // Clear timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please provide both email and password');
      return;
    }

    setSubmitting(true);
    setError('');
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') navigate('/admin/dashboard');
        else if (res.user.role === 'vendor') navigate('/vendor/dashboard');
        else navigate(from === '/login' ? '/customer/dashboard' : from);
      }
    } catch (err) {
      showError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'customer') {
      setEmail(DEMO_USERS.customer.email);
      setPassword('customer123');
    } else if (role === 'vendor') {
      setEmail(DEMO_USERS.vendor.email);
      setPassword('vendor123');
    } else if (role === 'admin') {
      setEmail(DEMO_USERS.admin.email);
      setPassword('admin123');
    }
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-luxury">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-wed-gold flex items-center justify-center text-white shadow-md mx-auto mb-3">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-wed-brown">
            Welcome Back
          </h2>
          <p className="text-xs text-wed-brown-muted mt-1">
            Access your bookings, quotes, and wedding management
          </p>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="mb-6 p-3 bg-wed-cream/60 rounded-2xl border border-stone-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-wed-brown-muted block mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-wed-gold" />
            Quick Demo Autofill Credentials:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className="py-1 px-2 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-wed-brown hover:border-wed-gold transition"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('vendor')}
              className="py-1 px-2 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-wed-brown hover:border-wed-gold transition"
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-1 px-2 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-wed-brown hover:border-wed-gold transition"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-wed-brown">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-wed-brown">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-wed-gold-dark hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-wed-gold hover:bg-wed-gold-dark text-white font-semibold rounded-xl transition shadow-md text-sm mt-4 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center space-y-3">
          <p className="text-xs text-wed-brown-muted">
            New to WedPlan?{' '}
            <Link to="/register" className="font-semibold text-wed-gold-dark hover:underline">
              Register an Account
            </Link>
          </p>
          <div>
            <Link
              to="/admin/login"
              className="text-[11px] text-stone-400 hover:text-wed-brown transition"
            >
              Administrator Access Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-serif font-bold text-lg text-wed-brown">Reset Password</h4>
            <p className="text-xs text-wed-brown-muted leading-relaxed">
              In this preview mode, you can use any of the predefined demo accounts with passwords like <code>customer123</code>, <code>vendor123</code>, or <code>admin123</code>.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-wed-gold text-white rounded-xl text-xs font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

