import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vendorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProfile'
    },
    vendorName: {
      type: String,
      default: ''
    },
    serviceName: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true,
      lowercase: true
    },
    categoryLabel: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide service description']
    },
    district: {
      type: String,
      required: [true, 'Please provide district']
    },
    city: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    priceType: {
      type: String,
      enum: ['per-event', 'per-person', 'starting-from', 'per day', 'per plate'],
      default: 'per-event'
    },
    priceUnit: {
      type: String,
      default: 'per day'
    },
    hasGuestCapacity: {
      type: Boolean,
      default: false
    },
    maxGuestCapacity: {
      type: Number,
      default: 0
    },
    guestCapacity: {
      type: Number,
      default: 0
    },
    features: {
      type: [String],
      default: []
    },
    images: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    image: {
      type: String,
      default: ''
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
      }
    ],
    rating: {
      type: Number,
      default: 5.0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDemo: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.name = ret.serviceName;
        ret.hasGuestCapacity =
          ret.hasGuestCapacity !== undefined
            ? Boolean(ret.hasGuestCapacity)
            : Number(ret.guestCapacity || ret.maxGuestCapacity) > 0;
        ret.maxGuestCapacity = ret.hasGuestCapacity
          ? Number(ret.maxGuestCapacity || ret.guestCapacity || 0)
          : 0;
        ret.capacity = ret.maxGuestCapacity;
        ret.guestCapacity = ret.maxGuestCapacity;
        ret.facilities = ret.features;

        // Extract clean array of string URLs for gallery
        if (Array.isArray(ret.images) && ret.images.length > 0) {
          ret.gallery = ret.images
            .map((img) => (typeof img === 'string' ? img : img?.url || ''))
            .filter(Boolean);
          const primaryObj = ret.images.find(
            (img) => typeof img === 'object' && img.isPrimary
          );
          if (primaryObj?.url) {
            ret.image = primaryObj.url;
          } else if (!ret.image && ret.gallery.length > 0) {
            ret.image = ret.gallery[0];
          }
        } else {
          ret.gallery = ret.image ? [ret.image] : [];
        }

        ret.status = ret.isActive ? 'active' : 'inactive';
        ret.vendorId = ret.vendor;
        ret.isDemo = Boolean(ret.isDemo);
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Index for search & filter optimization
serviceSchema.index({ serviceName: 'text', description: 'text', location: 'text' });
serviceSchema.index({ category: 1, district: 1, price: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

