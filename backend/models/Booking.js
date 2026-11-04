import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceName: {
      type: String,
      default: ''
    },
    serviceCategory: {
      type: String,
      default: ''
    },
    vendorName: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: ''
    },
    customerEmail: {
      type: String,
      default: ''
    },
    customerPhone: {
      type: String,
      default: ''
    },
    packageName: {
      type: String,
      default: ''
    },
    eventType: {
      type: String,
      required: [true, 'Please specify event type'],
      trim: true
    },
    eventDate: {
      type: String,
      required: [true, 'Please provide event date (YYYY-MM-DD)']
    },
    eventTime: {
      type: String,
      default: 'Full Day'
    },
    guestCount: {
      type: Number,
      required: [true, 'Please specify guest count'],
      min: [1, 'Guest count must be at least 1']
    },
    eventLocation: {
      type: String,
      required: [true, 'Please provide event venue location']
    },
    requirements: {
      type: String,
      default: ''
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total booking amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    },
    vendorResponse: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.bookingId || ret._id;
        ret._id = ret._id;
        ret.price = ret.totalAmount;
        ret.location = ret.eventLocation;
        ret.additionalRequirements = ret.requirements;
        ret.customerId = ret.customer;
        ret.vendorId = ret.vendor;
        ret.serviceId = ret.service;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Database-level partial compound unique index for preventing double-booking on same date
// Only applies when status is 'confirmed'
bookingSchema.index(
  { service: 1, eventDate: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'confirmed' }
  }
);

// Indexes for querying customer and vendor bookings efficiently
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ vendor: 1, status: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

