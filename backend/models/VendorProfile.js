import mongoose from 'mongoose';
import { KERALA_DISTRICTS } from '../utils/districts.js';

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: [true, 'Please provide business name'],
      trim: true
    },
    ownerName: {
      type: String,
      required: [true, 'Please provide owner name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a vendor category'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a business description']
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone']
    },
    email: {
      type: String,
      required: [true, 'Please provide business email'],
      lowercase: true,
      trim: true
    },
    district: {
      type: String,
      required: [true, 'Please select a Kerala district']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    address: {
      type: String,
      required: [true, 'Please provide full address']
    },
    experience: {
      type: Number,
      default: 0
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
    },
    portfolioImages: {
      type: [String],
      default: []
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.status = ret.verificationStatus;
        ret.yearsExperience = ret.experience;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
export default VendorProfile;

