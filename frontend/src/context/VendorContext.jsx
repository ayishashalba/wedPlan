import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { vendorService } from '../services/vendorService';
import { useAuth } from './AuthContext';

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync data from backend when admin is logged in
  const fetchAdminData = useCallback(async () => {
    if (!isAdmin) {
      setVendors([]);
      setCustomers([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [remoteVendors, remoteCustomers] = await Promise.all([
        adminService.getAllVendors(),
        adminService.getAllCustomers()
      ]);

      const normalizedVendors = (remoteVendors || []).map((v) => ({
        ...v,
        id: v._id || v.id,
        status: v.verificationStatus || v.status,
        yearsExperience: v.experience !== undefined ? v.experience : (v.yearsExperience || 0),
        servicesCount: v.servicesCount || 0
      }));

      const normalizedCustomers = (remoteCustomers || []).map((c) => ({
        ...c,
        id: c._id || c.id,
        status: c.isActive ? 'active' : 'inactive',
        totalBookings: c.totalBookings || 0
      }));

      setVendors(normalizedVendors);
      setCustomers(normalizedCustomers);
    } catch (err) {
      console.error('Failed to load admin vendor/customer data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setVendors([]);
      setCustomers([]);
    }
  }, [isAdmin, fetchAdminData]);

  const registerVendor = async (vendorData) => {
    const remoteVendor = await vendorService.registerVendor(vendorData);
    if (isAdmin) {
      await fetchAdminData();
    }
    return remoteVendor;
  };

  const approveVendor = async (vendorId) => {
    await adminService.approveVendor(vendorId);
    setVendors((prev) =>
      prev.map((v) =>
        (v.id === vendorId || v._id === vendorId)
          ? { ...v, status: 'approved', verificationStatus: 'approved' }
          : v
      )
    );
  };

  const rejectVendor = async (vendorId, reason = '') => {
    await adminService.rejectVendor(vendorId, reason);
    setVendors((prev) =>
      prev.map((v) =>
        (v.id === vendorId || v._id === vendorId)
          ? { ...v, status: 'rejected', verificationStatus: 'rejected', rejectionReason: reason }
          : v
      )
    );
  };

  const updateVendorProfile = async (vendorId, data) => {
    const updated = await vendorService.updateVendorProfile(data);
    if (isAdmin) {
      await fetchAdminData();
    }
    return updated;
  };

  const toggleCustomerStatus = async (customerId) => {
    const target = customers.find((c) => c.id === customerId || c._id === customerId);
    if (!target) return;
    const newIsActive = target.status !== 'active';
    await adminService.updateUserStatus(target._id || target.id, newIsActive);
    setCustomers((prev) =>
      prev.map((c) =>
        (c.id === customerId || c._id === customerId)
          ? { ...c, status: newIsActive ? 'active' : 'inactive', isActive: newIsActive }
          : c
      )
    );
  };

  const getVendorById = (vendorId) => {
    if (!vendorId) return null;
    return vendors.find((v) => (v.id === vendorId || v._id === vendorId || v.user?._id === vendorId || v.user === vendorId));
  };

  const pendingVendors = vendors.filter((v) => (v.status || v.verificationStatus) === 'pending');
  const approvedVendors = vendors.filter((v) => (v.status || v.verificationStatus) === 'approved');
  const rejectedVendors = vendors.filter((v) => (v.status || v.verificationStatus) === 'rejected');

  const value = {
    vendors,
    customers,
    loading,
    error,
    pendingVendors,
    approvedVendors,
    rejectedVendors,
    registerVendor,
    approveVendor,
    rejectVendor,
    updateVendorProfile,
    toggleCustomerStatus,
    getVendorById,
    refreshAdminData: fetchAdminData
  };

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};

export const useVendors = () => useContext(VendorContext);
