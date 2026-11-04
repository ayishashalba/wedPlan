import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

// Setup local fallback directory if needed
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage for piping to Cloudinary stream
const storage = multer.memoryStorage();

// File filter for validating image extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// Helper to upload buffer to Cloudinary with local persistent fallback
export const uploadBufferToCloudinary = (buffer, folder = 'wedplan', ext = '.jpg', req = null) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      // Local storage fallback: save actual file buffer so each image gets its own real image file!
      try {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const fileExt = ext.startsWith('.') ? ext : `.${ext}`;
        const uniqueName = `service_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExt}`;
        const filePath = path.join(uploadsDir, uniqueName);
        fs.writeFileSync(filePath, buffer);

        const host = req ? `${req.protocol}://${req.get('host')}` : 'http://localhost:5000';
        const fileUrl = `${host}/uploads/${uniqueName}`;
        const publicId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        return resolve({
          secure_url: fileUrl,
          url: fileUrl,
          public_id: publicId,
          publicId
        });
      } catch (err) {
        return reject(err);
      }
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          url: result.secure_url,
          public_id: result.public_id,
          publicId: result.public_id
        });
      }
    );

    stream.end(buffer);
  });
};

