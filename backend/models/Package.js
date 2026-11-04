import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    packageName: {
      type: String,
      required: [true, 'Please provide package name'],
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide package description']
    },
    includedServices: [
      {
        category: { type: String, required: true },
        item: { type: String, required: true }
      }
    ],
    price: {
      type: Number,
      required: [true, 'Please provide package price'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      default: '1 Full Day'
    },
    district: {
      type: String,
      default: 'Ernakulam'
    },
    images: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: ''
    },
    highlights: {
      type: [String],
      default: []
    },
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
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.name = ret.packageName;
        ret.includes = ret.includedServices;
        if (!ret.image && ret.images && ret.images.length > 0) {
          ret.image = ret.images[0];
        }
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;

