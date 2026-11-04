import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  danger = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            danger ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-wed-brown-muted leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-medium text-wed-brown hover:bg-stone-50 transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-5 py-2 text-sm font-medium rounded-xl text-white transition shadow-sm ${
            danger
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-wed-gold hover:bg-wed-gold-dark'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;

