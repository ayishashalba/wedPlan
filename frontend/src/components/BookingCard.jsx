import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, FileText, Ban, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import StatusBadge from './StatusBadge';
import Modal from './Modal';
import ConfirmationDialog from './ConfirmationDialog';

const BookingCard = ({ booking, onCancel, onStatusUpdate, isVendor = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const canCancel = ['pending', 'confirmed'].includes(booking.status?.toLowerCase());

  const bookingRef = booking.bookingId || booking._id || booking.id;
  const bookingDbId = booking._id || booking.bookingId || booking.id;
  const bookingPrice = booking.totalAmount !== undefined ? booking.totalAmount : booking.price;
  const bookingLocation = booking.eventLocation || booking.location || 'Kerala, India';
  const customerDisplayName = booking.customerName || booking.customer?.name || '';
  const vendorDisplayName = booking.vendorName || booking.vendor?.name || '';
  const bookingRequirements = booking.requirements || booking.additionalRequirements || '';

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-3 py-1 bg-wed-cream text-wed-brown rounded-lg border border-wed-gold/20">
              {bookingRef}
            </span>
            <span className="text-xs text-wed-brown-muted">
              Booked on {formatDate(booking.createdAt)}
            </span>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 text-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block mb-1">
              Service / Package
            </span>
            <h4 className="font-serif font-bold text-base text-wed-brown line-clamp-1">
              {booking.serviceName}
            </h4>
            {vendorDisplayName && (
              <p className="text-xs text-wed-gold-dark mt-0.5 font-medium">
                Vendor: {vendorDisplayName}
              </p>
            )}
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block mb-1">
              Event Details
            </span>
            <div className="flex items-center gap-1.5 text-xs text-wed-brown mb-1">
              <Calendar className="w-3.5 h-3.5 text-wed-gold" />
              <span>{formatDate(booking.eventDate)} ({booking.eventTime || 'Full Day'})</span>
            </div>
            <p className="text-xs text-wed-brown-light font-medium">{booking.eventType}</p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block mb-1">
              Location & Guests
            </span>
            <div className="flex items-center gap-1.5 text-xs text-wed-brown mb-1">
              <MapPin className="w-3.5 h-3.5 text-wed-gold" />
              <span className="truncate">{bookingLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-wed-brown-light">
              <Users className="w-3.5 h-3.5 text-wed-gold" />
              <span>{booking.guestCount} Expected Guests</span>
            </div>
          </div>

          <div className="lg:text-right">
            <span className="text-[11px] uppercase tracking-wider text-wed-brown-muted block mb-1">
              Total Booking Value
            </span>
            <span className="text-xl font-bold font-serif text-wed-brown">
              {formatCurrency(bookingPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <div className="text-xs text-wed-brown-muted">
            {customerDisplayName && (
              <span>Customer: <strong>{customerDisplayName}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-wed-brown hover:bg-stone-50 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              View Details
            </button>

            {/* Vendor specific quick actions */}
            {isVendor && booking.status === 'pending' && onStatusUpdate && (
              <>
                <button
                  onClick={() => onStatusUpdate(bookingDbId, 'confirmed')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Accept Booking
                </button>
                <button
                  onClick={() => onStatusUpdate(bookingDbId, 'rejected')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
                >
                  Decline
                </button>
              </>
            )}

            {isVendor && booking.status === 'confirmed' && onStatusUpdate && (
              <button
                onClick={() => onStatusUpdate(bookingDbId, 'completed')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
              >
                Mark as Completed
              </button>
            )}

            {/* Customer Cancel Option */}
            {!isVendor && canCancel && onCancel && (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <Ban className="w-3.5 h-3.5" />
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Booking Details #${bookingRef}`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h4 className="font-serif font-bold text-lg text-wed-brown">{booking.serviceName}</h4>
              {vendorDisplayName && <p className="text-xs text-wed-brown-muted">Vendor: {vendorDisplayName}</p>}
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-wed-cream/40 p-4 rounded-xl">
            <div>
              <span className="text-xs text-wed-brown-muted block">Event Type</span>
              <p className="font-semibold text-wed-brown">{booking.eventType}</p>
            </div>
            <div>
              <span className="text-xs text-wed-brown-muted block">Event Date</span>
              <p className="font-semibold text-wed-brown">{formatDate(booking.eventDate)}</p>
            </div>
            <div>
              <span className="text-xs text-wed-brown-muted block">Muhurtham / Time</span>
              <p className="font-semibold text-wed-brown">{booking.eventTime || 'Full Day'}</p>
            </div>
            <div>
              <span className="text-xs text-wed-brown-muted block">Guest Count</span>
              <p className="font-semibold text-wed-brown">{booking.guestCount} Guests</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-wed-brown-muted block">Venue Location</span>
              <p className="font-semibold text-wed-brown">{bookingLocation}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-wed-brown-muted block">Total Agreed Price</span>
              <p className="font-semibold text-wed-gold-dark text-base">{formatCurrency(bookingPrice)}</p>
            </div>
          </div>

          {bookingRequirements && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-wed-brown mb-2">
                Customer Special Requests
              </h5>
              <p className="text-xs text-wed-brown-light bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                {bookingRequirements}
              </p>
            </div>
          )}

          {booking.vendorResponse && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-wed-brown mb-2">
                Vendor Response & Remarks
              </h5>
              <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                {booking.vendorResponse}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-wed-brown hover:bg-stone-50"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          onCancel(bookingDbId);
          setShowCancelDialog(false);
        }}
        title="Cancel Wedding Booking"
        message="Are you sure you want to cancel this booking inquiry? The vendor will be notified immediately."
        confirmText="Yes, Cancel Booking"
        danger={true}
      />
    </>
  );
};

export default BookingCard;
