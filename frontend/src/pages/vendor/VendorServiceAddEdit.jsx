import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import { vendorService } from '../../services/vendorService';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/ServiceContext';
import { KERALA_DISTRICTS } from '../../utils/formatters';
import ImageUploadGrid from '../../components/ImageUploadGrid';

/* ── Helpers ──────────────────────────────────────────────────────── */
/**
 * Convert a saved images array (strings or objects) into the shape
 * that ImageUploadGrid expects: { id, preview, url, publicId, file? }
 */
const normalizeExistingImages = (images = [], fallbackImage = '') => {
  const list = images.length > 0 ? images : fallbackImage ? [fallbackImage] : [];
  return list.map((item, idx) => {
    const url = typeof item === 'string' ? item : item?.url || item?.secure_url || '';
    const publicId = typeof item === 'object' ? item?.publicId || item?.public_id || '' : '';
    return {
      id: `existing-${idx}-${url.slice(-16)}`,
      preview: url,
      url,
      publicId,
      file: null // no File — already uploaded
    };
  });
};

const CATEGORY_LABEL_MAP = {
  hall: 'Wedding Hall',
  catering: 'Catering Service',
  decoration: 'Stage & Floral Decor',
  photography: 'Photography & Cinema',
  'event-management': 'Event Management'
};

/* ── Component ────────────────────────────────────────────────────── */
const VendorServiceAddEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshServices } = useServices();

  const isEdit = Boolean(id);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    location: '',
    district: user?.vendorProfile?.district || 'Ernakulam (Kochi)',
    address: '',
    price: 150000,
    priceUnit: 'per day',
    hasGuestCapacity: true,
    maxGuestCapacity: 1000,
    description: '',
    facilitiesText: 'Central AC\nAmple Car Parking\nBridal Suite\nBackup Generator'
  });

  // Images in the unified { id, preview, url, file? } shape
  const [imageSlots, setImageSlots] = useState([]);

  /* ── Load service for edit ──────────────────────────────────────── */
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      setLoadingInitial(true);
      try {
        const service = await serviceService.getServiceById(id);
        if (service) {
          const hasCap = service.hasGuestCapacity === true ||
            (service.hasGuestCapacity === undefined && Boolean(service.guestCapacity && service.guestCapacity > 0));
          const maxCap = service.maxGuestCapacity || service.guestCapacity || service.capacity || 500;

          setFormData({
            name: service.serviceName || service.name || '',
            category: service.category || 'hall',
            categoryLabel: service.categoryLabel || 'Wedding Hall',
            location: service.location || '',
            district: service.district || 'Ernakulam (Kochi)',
            address: service.address || '',
            price: service.price || 0,
            priceUnit: service.priceUnit || 'per day',
            hasGuestCapacity: hasCap,
            maxGuestCapacity: hasCap ? maxCap : 500,
            description: service.description || '',
            facilitiesText: (service.features || service.facilities || []).join('\n')
          });
          setImageSlots(
            normalizeExistingImages(
              service.images || service.gallery || [],
              service.image || ''
            )
          );
        }
      } catch (err) {
        setErrorMessage('Failed to load service details for editing.');
      } finally {
        setLoadingInitial(false);
      }
    };
    load();
  }, [id, isEdit]);

  /* ── Submit ─────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setUploadError('');

    // Validation
    if (imageSlots.length === 0) {
      setErrorMessage('Please add at least one service image.');
      return;
    }

    setSubmitting(true);

    try {
      /* 1 ─ Upload any new (File-backed) images to backend/Cloudinary */
      const newFileSlots = imageSlots.filter((slot) => slot.file);
      let uploadedResults = [];

      if (newFileSlots.length > 0) {
        setUploading(true);
        try {
          uploadedResults = await vendorService.uploadImages(
            newFileSlots.map((s) => s.file)
          );
        } catch (upErr) {
          setUploadError(upErr.message || 'Image upload failed. Please try again.');
          setSubmitting(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      /* 2 ─ Build the final structured images array with individual URLs and publicIds */
      let uploadIdx = 0;
      const structuredImages = imageSlots.map((slot, index) => {
        let finalUrl = slot.url || slot.preview;
        let finalPublicId = slot.publicId || '';

        if (slot.file) {
          const upRes = uploadedResults[uploadIdx++];
          if (upRes) {
            finalUrl = upRes.url;
            finalPublicId = upRes.public_id;
          }
        }

        return {
          url: finalUrl,
          publicId: finalPublicId,
          isPrimary: index === 0
        };
      });

      const finalUrls = structuredImages.map((img) => img.url);

      /* 3 ─ Build service payload */
      const facilitiesArray = formData.facilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const hasCap = Boolean(formData.hasGuestCapacity);
      const maxCap = hasCap ? Math.max(1, Number(formData.maxGuestCapacity || 0)) : 0;

      const payload = {
        name: formData.name,
        serviceName: formData.name,
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        location: formData.location,
        district: formData.district,
        address: formData.address || `${formData.location}, ${formData.district}`,
        price: Number(formData.price),
        priceUnit: formData.priceUnit,
        hasGuestCapacity: hasCap,
        maxGuestCapacity: maxCap,
        capacity: maxCap,
        guestCapacity: maxCap,
        description: formData.description,
        features: facilitiesArray,
        facilities: facilitiesArray,
        image: finalUrls[0] || '', // primary / cover image
        images: structuredImages   // structured array preserved in MongoDB
      };

      /* 4 ─ Save to backend */
      if (isEdit) {
        await vendorService.updateVendorService(id, payload);
      } else {
        await vendorService.createVendorService(payload);
      }

      if (refreshServices) {
        await refreshServices();
      }

      navigate('/vendor/services');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save service. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading state ──────────────────────────────────────────────── */
  if (loadingInitial) {
    return (
      <div className="py-20 text-center text-xs text-wed-brown-muted">
        Loading service details...
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-wed-brown hover:text-wed-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
          {isEdit ? 'Edit Wedding Service Listing' : 'Add New Wedding Service Listing'}
        </h1>
        <p className="text-xs text-wed-brown-muted mt-1">
          Specify venue facilities, guest capacity, pricing structures, and photos for Kerala couples.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Service Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Service / Venue Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Lakeview Convention Centre"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none focus:ring-2 focus:ring-wed-gold/40"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    category: val,
                    categoryLabel: CATEGORY_LABEL_MAP[val] || val
                  });
                }}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              >
                <option value="hall">Wedding Hall / Convention Centre</option>
                <option value="catering">Catering Service / Kerala Sadya</option>
                <option value="decoration">Stage &amp; Floral Decoration</option>
                <option value="photography">Photography &amp; Cinematography</option>
                <option value="event-management">Event Management</option>
              </select>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Kerala District *
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>

            {/* Pricing Unit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Pricing Unit
              </label>
              <input
                type="text"
                value={formData.priceUnit}
                onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                placeholder="per day / per person / starting package"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                Location Area / Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Marine Drive, Kochi"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
              />
            </div>

            {/* Vendor-Controlled Guest Capacity (Yes/No choice) */}
            <div className="sm:col-span-2 p-5 rounded-2xl bg-wed-cream/40 border border-stone-200/90 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-wed-brown block">
                  Does this service have a guest capacity limit? *
                </label>
                <p className="text-[11px] text-wed-brown-muted mt-0.5">
                  Select whether couples must specify a guest count when booking this listing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 pt-1">
                <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-wed-brown">
                  <input
                    type="radio"
                    name="hasGuestCapacity"
                    checked={formData.hasGuestCapacity === true}
                    onChange={() => setFormData({ ...formData, hasGuestCapacity: true })}
                    className="w-4 h-4 text-wed-gold focus:ring-wed-gold border-stone-300"
                  />
                  <span>Yes, has guest capacity limit</span>
                </label>

                <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-wed-brown">
                  <input
                    type="radio"
                    name="hasGuestCapacity"
                    checked={formData.hasGuestCapacity === false}
                    onChange={() => setFormData({ ...formData, hasGuestCapacity: false })}
                    className="w-4 h-4 text-wed-gold focus:ring-wed-gold border-stone-300"
                  />
                  <span>No guest capacity limit (unrestricted / by agreement)</span>
                </label>
              </div>

              {formData.hasGuestCapacity && (
                <div className="pt-3 border-t border-stone-200/70 max-w-sm space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
                    Maximum Guest Capacity *
                  </label>
                  <input
                    type="number"
                    required={formData.hasGuestCapacity}
                    min="1"
                    step="1"
                    value={formData.maxGuestCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxGuestCapacity: Math.max(1, parseInt(e.target.value, 10) || 0)
                      })
                    }
                    placeholder="e.g. 500"
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-wed-gold/40 shadow-sm"
                  />
                  <p className="text-[11px] text-wed-brown-muted">
                    Bookings requesting more than this number of guests will be blocked with vendor contact options.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
              Service Description *
            </label>
            <textarea
              rows="4"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight architectural elegance, culinary variety, camera equipment, or special amenities..."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
            />
          </div>

          {/* Facilities */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-wed-brown">
              Facilities / Included Features (One per line)
            </label>
            <textarea
              rows="4"
              value={formData.facilitiesText}
              onChange={(e) => setFormData({ ...formData, facilitiesText: e.target.value })}
              placeholder="Centralized Air Conditioning&#10;500+ Car Parking&#10;In-house Genset"
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-wed-cream/30 focus:outline-none"
            />
          </div>

          {/* ── Image Upload ──────────────────────────────────────── */}
          <div className="pt-2">
            <ImageUploadGrid
              images={imageSlots}
              onChange={setImageSlots}
              maxImages={5}
              uploading={uploading}
              uploadError={uploadError}
              disabled={submitting}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
            <Link
              to="/vendor/services"
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-wed-brown hover:bg-stone-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-wed-gold hover:bg-wed-gold-dark text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {uploading
                ? 'Uploading Images...'
                : submitting
                ? 'Saving...'
                : isEdit
                ? 'Update Service'
                : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorServiceAddEdit;
