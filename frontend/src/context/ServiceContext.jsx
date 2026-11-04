import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { serviceService } from '../services/serviceService';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBackendServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [remoteServices, remotePackages] = await Promise.all([
        serviceService.getAllServices({ limit: 'all' }),
        serviceService.getAllPackages()
      ]);

      const normalizedServices = (remoteServices || []).map((s) => {
        // Extract array of URL strings from images (which may contain { url, publicId, isPrimary } or strings)
        const imagesList = Array.isArray(s.images)
          ? s.images.map((img) => (typeof img === 'string' ? img : (img?.url || img?.secure_url || ''))).filter(Boolean)
          : [];

        // Determine primary image URL
        let primaryImage = '';
        if (Array.isArray(s.images) && s.images.length > 0) {
          const primaryObj = s.images.find((img) => typeof img === 'object' && img?.isPrimary);
          if (primaryObj) {
            primaryImage = primaryObj.url || primaryObj.secure_url || '';
          } else {
            primaryImage = typeof s.images[0] === 'string' ? s.images[0] : (s.images[0]?.url || s.images[0]?.secure_url || '');
          }
        }
        if (!primaryImage) {
          primaryImage = typeof s.image === 'string' ? s.image : (s.image?.url || '');
        }
        if (!primaryImage && imagesList.length > 0) {
          primaryImage = imagesList[0];
        }

        const gallery = imagesList.length > 0 ? imagesList : (primaryImage ? [primaryImage] : []);

        const hasCapacity = s.hasGuestCapacity === true ||
          (s.hasGuestCapacity === undefined && Boolean(s.guestCapacity && s.guestCapacity > 0));
        const maxCapacity = hasCapacity ? Number(s.maxGuestCapacity || s.guestCapacity || s.capacity || 0) : 0;

        return {
          ...s,
          id: s._id || s.id,
          name: s.serviceName || s.name,
          hasGuestCapacity: hasCapacity,
          maxGuestCapacity: maxCapacity,
          capacity: maxCapacity,
          guestCapacity: maxCapacity,
          facilities: s.features || s.facilities || [],
          gallery,
          images: imagesList.length > 0 ? imagesList : (primaryImage ? [primaryImage] : []),
          rawImages: s.images || [],
          image: primaryImage,
          status: s.isActive ? 'active' : 'inactive',
          vendorId: s.vendor?._id || s.vendor || s.vendorId,
          vendorName: s.vendorProfile?.businessName || s.vendorName || s.vendor?.name || 'Wedding Vendor',
          vendorPhone: s.vendorProfile?.phone || s.vendor?.phone || s.vendorPhone || ''
        };
      });

      const normalizedPackages = (remotePackages || []).map((p) => ({
        ...p,
        id: p._id || p.id,
        name: p.packageName || p.name,
        includes: p.includedServices || p.includes || []
      }));

      setServices(normalizedServices);
      setPackages(normalizedPackages);
    } catch (err) {
      console.error('Failed to load services/packages from backend:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackendServices();
  }, [fetchBackendServices]);

  const addService = async (newService) => {
    const created = await serviceService.createService(newService);
    await fetchBackendServices();
    return created;
  };

  const updateService = async (id, updatedFields) => {
    const updated = await serviceService.updateService(id, updatedFields);
    await fetchBackendServices();
    return updated;
  };

  const deleteService = async (id) => {
    const result = await serviceService.deleteService(id);
    await fetchBackendServices();
    return result;
  };

  const addPackage = (newPackage) => {
    const item = {
      ...newPackage,
      id: 'pkg-' + Date.now(),
      rating: 5.0,
      reviewCount: 1
    };
    setPackages((prev) => [item, ...prev]);
    return item;
  };

  const updatePackage = (id, updatedFields) => {
    setPackages((prev) => prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updatedFields } : p)));
  };

  const deletePackage = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id && p._id !== id));
  };

  const getServiceById = (id) => {
    return services.find((s) => s.id === id || s._id === id);
  };

  const getPackageById = (id) => {
    return packages.find((p) => p.id === id || p._id === id);
  };

  const filterServices = ({
    category = 'all',
    district = 'all',
    minPrice = 0,
    maxPrice = Infinity,
    minCapacity = 0,
    minRating = 0,
    searchQuery = ''
  }) => {
    return services.filter((service) => {
      // Category filter
      if (category !== 'all' && service.category?.toLowerCase() !== category.toLowerCase()) return false;

      // District filter (handles Ernakulam vs Ernakulam (Kochi) seamlessly)
      if (district && district !== 'all') {
        const cleanFilter = district.split('(')[0].trim().toLowerCase();
        const cleanService = (service.district || '').split('(')[0].trim().toLowerCase();
        if (!cleanService.includes(cleanFilter) && !cleanFilter.includes(cleanService)) {
          return false;
        }
      }

      // Price filter
      if (service.price < minPrice || (maxPrice && service.price > maxPrice)) return false;

      // Capacity filter for halls
      if (minCapacity && service.capacity && service.capacity < minCapacity) return false;

      // Rating filter
      if (minRating && service.rating < minRating) return false;

      // Search query (name, location, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (service.name || service.serviceName || '').toLowerCase().includes(q);
        const matchesLoc = service.location?.toLowerCase().includes(q);
        const matchesDistrict = service.district?.toLowerCase().includes(q);
        const matchesDesc = service.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesDistrict && !matchesDesc) return false;
      }

      return true;
    });
  };

  const value = {
    services,
    packages,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    addPackage,
    updatePackage,
    deletePackage,
    getServiceById,
    getPackageById,
    filterServices,
    refreshServices: fetchBackendServices
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export const useServices = () => useContext(ServiceContext);
