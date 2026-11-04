/**
 * ImageUploadGrid
 * ───────────────
 * Drag-and-drop + click-to-browse multiple image uploader.
 *
 * Props:
 *   images          – array of { preview: string, file?: File, url?: string, id: string }
 *   onChange        – (nextImages) => void
 *   maxImages       – max allowed (default 5)
 *   uploading       – boolean  (parent sets true while uploading)
 *   uploadError     – string | null
 *   disabled        – boolean
 */
import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, X, ImageIcon, Star } from 'lucide-react';

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ImageUploadGrid = ({
  images = [],
  onChange,
  maxImages = 5,
  uploading = false,
  uploadError = null,
  disabled = false
}) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  /* ── Validation ───────────────────────────────────────────────── */
  const validateFiles = useCallback(
    (files) => {
      const errors = [];
      const remaining = maxImages - images.length;
      if (files.length > remaining) {
        errors.push(
          `You can only add ${remaining} more image${remaining !== 1 ? 's' : ''} (maximum ${maxImages}).`
        );
        // Still try to take valid ones up to the limit
        files = files.slice(0, remaining);
      }

      const valid = [];
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          errors.push(`"${file.name}" is not a supported image type (JPG, PNG, WEBP only).`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          errors.push(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB} MB size limit.`);
          continue;
        }
        valid.push(file);
      }

      return { valid, errors };
    },
    [images.length, maxImages]
  );

  /* ── Add files ────────────────────────────────────────────────── */
  const addFiles = useCallback(
    (rawFiles) => {
      setValidationError('');
      const fileArray = Array.from(rawFiles);
      const { valid, errors } = validateFiles(fileArray);

      if (errors.length) {
        setValidationError(errors.join(' '));
      }

      if (!valid.length) return;

      const newEntries = valid.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        url: null // set after upload
      }));

      onChange([...images, ...newEntries]);
    },
    [images, onChange, validateFiles]
  );

  /* ── Remove ───────────────────────────────────────────────────── */
  const removeImage = (id) => {
    const removed = images.find((img) => img.id === id);
    if (removed?.preview && removed.file) {
      URL.revokeObjectURL(removed.preview); // free memory for local previews
    }
    onChange(images.filter((img) => img.id !== id));
    setValidationError('');
  };

  /* ── Drag events ──────────────────────────────────────────────── */
  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled && images.length < maxImages) setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className="space-y-3">
      {/* ── Counter ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-wed-brown">
          Service Images
        </span>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            images.length >= maxImages
              ? 'bg-rose-100 text-rose-600'
              : 'bg-wed-gold/15 text-wed-gold-dark'
          }`}
        >
          {images.length} of {maxImages} images selected
        </span>
      </div>

      {/* ── Validation / upload error ─────────────────────────────── */}
      {(validationError || uploadError) && (
        <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {validationError || uploadError}
        </p>
      )}

      {/* ── Drop zone (only shown when more can be added) ─────────── */}
      {canAddMore && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition select-none ${
            dragOver
              ? 'border-wed-gold bg-wed-gold/10'
              : 'border-stone-300 bg-wed-cream/40 hover:border-wed-gold hover:bg-wed-gold/5'
          }`}
        >
          <UploadCloud
            className={`w-9 h-9 transition ${dragOver ? 'text-wed-gold' : 'text-stone-400'}`}
          />
          <div className="text-center space-y-0.5">
            <p className="text-xs font-semibold text-wed-brown">
              Drag &amp; drop images here, or{' '}
              <span className="text-wed-gold-dark underline">browse files</span>
            </p>
            <p className="text-[11px] text-wed-brown-muted">
              JPG, JPEG, PNG, WEBP · Max {MAX_FILE_SIZE_MB} MB per image ·{' '}
              {maxImages - images.length} slot
              {maxImages - images.length !== 1 ? 's' : ''} remaining
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
            disabled={disabled}
          />
        </div>
      )}

      {/* ── Preview grid ─────────────────────────────────────────── */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group aspect-square">
              <img
                src={img.preview || img.url}
                alt={`Service image ${idx + 1}`}
                className="w-full h-full object-cover rounded-xl border border-stone-200 bg-stone-100"
                draggable={false}
              />

              {/* Primary badge */}
              {idx === 0 && (
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-wed-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  Main
                </div>
              )}

              {/* Uploading overlay */}
              {uploading && img.file && !img.url && (
                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Remove button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md z-10"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Add-more tile (when grid isn't full and drop zone is closed) */}
          {!canAddMore && images.length < maxImages && (
            /* this branch is never reached because canAddMore covers it */
            null
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !canAddMore && (
        <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border border-dashed border-stone-300 text-stone-400">
          <ImageIcon className="w-8 h-8" />
          <p className="text-xs">No images selected</p>
        </div>
      )}

      {/* Add more button when grid is partially filled */}
      {images.length > 0 && images.length < maxImages && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-semibold text-wed-gold-dark hover:underline flex items-center gap-1 mt-1"
          disabled={disabled}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Add more images ({maxImages - images.length} remaining)
        </button>
      )}
    </div>
  );
};

export default ImageUploadGrid;

