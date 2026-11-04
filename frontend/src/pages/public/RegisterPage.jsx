import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Mail, Phone, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const formErrorTimerRef = useRef(null);

  // Show a form-level error that auto-dismisses after 5 seconds
  const showFormError = (msg) => {
    if (formErrorTimerRef.current) clearTimeout(formErrorTimerRef.current);
    setErrors((prev) => ({ ...prev, form: msg }));
    formErrorTimerRef.current = setTimeout(
      () => setErrors((prev) => ({ ...prev, form: '' })),
      5000
    );
  };

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (formErrorTimerRef.current) clearTimeout(formErrorTimerRef.current);
    };
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms & Conditions';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Clear any previous form error and its timer
    if (formErrorTimerRef.current) clearTimeout(formErrorTimerRef.current);
    setErrors((prev) => ({ ...prev, form: '' }));

    try {
      await register(formData);
      if (formData.role === 'vendor') {
        navigate('/vendor/register'); // Become a Vendor info page
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      showFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-luxury">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-wed-gold flex items-center justify-center text-white shadow-md mx-auto mb-3">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-wed-brown">
            Create Your WedPlan Account
          </h2>
          <p className="text-xs text-wed-brown-muted mt-1">
            Join Kerala's premier wedding planning network
          </p>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-wed-brown block">
              I want to register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition ${
                  formData.role === 'customer'
                    ? 'border-wed-gold bg-wed-gold/10 text-wed-gold-dark'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Customer / Couple
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'vendor' })}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition ${
                  formData.role === 'vendor'
                    ? 'border-wed-gold bg-wed-gold/10 text-wed-gold-dark'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Wedding Vendor
              </button>
            </div>
            {formData.role === 'vendor' && (
              <p className="text-[11px] text-wed-gold-dark pt-1">
                * Basic account will be registered first; full business listing details will follow on the vendor onboarding step.
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-wed-brown">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Pillai"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-wed-brown">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-wed-brown">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98460 00000"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-wed-brown">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-wed-brown">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 accent-wed-gold"
              />
              <span className="text-[11px] text-wed-brown-muted leading-relaxed">
                I agree to the WedPlan Terms of Service, Privacy Policy, and Kerala Wedding Booking Code.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-wed-gold hover:bg-wed-gold-dark text-white font-semibold rounded-xl transition shadow-md text-sm mt-4 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-wed-brown-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-wed-gold-dark hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

