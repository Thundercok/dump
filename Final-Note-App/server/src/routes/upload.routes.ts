import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';

const router = Router();
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // max 5 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed') as any, false);
    }
  }
});

// Upload endpoint for note attachments
router.post('/', authenticate, upload.array('files', 5), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      throw new AppError('No files uploaded', 400);
    }
    
    const files = Array.isArray(req.files) ? req.files : [req.files];
    
    // Map files to response format
    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    }));
    
    res.json({
      status: 'success',
      data: { files: uploadedFiles }
    });
  } catch (err) {
    next(err);
  }
});

// Get file
router.get('/:filename', (req, res, next) => {
  try {
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      throw new AppError('File not found', 404);
    }
    
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

// Delete file
router.delete('/:filename', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      throw new AppError('File not found', 404);
    }
    
    fs.unlinkSync(filePath);
    
    res.json({
      status: 'success',
      message: 'File deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

export default router; 
