import express from 'express';
import path from 'path';
import { upload, uploadBufferToCloudinary } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const folder = req.body.folder || 'wedplan/services';
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder, ext, req);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url || result.url,
        public_id: result.public_id || result.publicId
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload multiple portfolio/hall images to Cloudinary (up to 10 images)
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded'
      });
    }

    const folder = req.body.folder || 'wedplan/services';
    const uploadPromises = req.files.map((file) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      return uploadBufferToCloudinary(file.buffer, folder, ext, req);
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((r) => r.secure_url || r.url);

    res.status(200).json({
      success: true,
      count: urls.length,
      message: `${urls.length} images uploaded successfully`,
      data: {
        urls,
        results: results.map((r) => ({
          secure_url: r.secure_url || r.url,
          url: r.secure_url || r.url,
          public_id: r.public_id || r.publicId
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

