import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // loading = true while we validate the stored token on mount
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists in localStorage, validate it with the backend
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('wedplan_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Token invalid / expired — clear storage
          localStorage.removeItem('wedplan_token');
          localStorage.removeItem('wedplan_user');
        }
      } catch {
        localStorage.removeItem('wedplan_token');
        localStorage.removeItem('wedplan_user');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Always call the real backend — no demo fallbacks
      const res = await authService.login({ email, password });
      if (res && res.success && res.user && res.token) {
        localStorage.setItem('wedplan_token', res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      // Backend returned success=false with a message
      throw new Error(res?.message || 'Login failed');
    } catch (error) {
      // Re-throw so the calling component can display the backend's error message
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Always call the real backend — no demo fallbacks
      const res = await authService.register(userData);
      if (res && res.success && res.user && res.token) {
        localStorage.setItem('wedplan_token', res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Registration failed');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Network errors on logout are acceptable
    } finally {
      setUser(null);
      localStorage.removeItem('wedplan_token');
      localStorage.removeItem('wedplan_user');
    }
  };

  const updateUserProfile = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isVendor: user?.role === 'vendor',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
