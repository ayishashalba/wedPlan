import React from 'react';

const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();

  const styles = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    completed: 'bg-blue-50 text-blue-800 border-blue-200',
    rejected: 'bg-rose-50 text-rose-800 border-rose-200',
    cancelled: 'bg-stone-100 text-stone-700 border-stone-200',
    inactive: 'bg-stone-100 text-stone-700 border-stone-200'
  };

  const labels = {
    pending: 'Pending Verification',
    approved: 'Verified & Approved',
    confirmed: 'Confirmed Booking',
    active: 'Active Listing',
    completed: 'Completed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    inactive: 'Deactivated'
  };

  const appliedClass = styles[norm] || 'bg-stone-50 text-stone-700 border-stone-200';
  const label = labels[norm] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${appliedClass}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {label}
    </span>
  );
};

export default StatusBadge;

