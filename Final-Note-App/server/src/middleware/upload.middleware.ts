import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './errorHandler';

// Configure multer for storing uploaded files
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// Configure upload settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for handling single image upload
export const uploadSingleImage = upload.single('image');

// Middleware for handling multiple image uploads
export const uploadMultipleImages = upload.array('images', 10); // Maximum 10 images

// Error handler for multer errors
export const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('File size too large. Maximum size is 5MB', 400));
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      next(new AppError('Too many files. Maximum is 10 files', 400));
    } else {
      next(new AppError(error.message, 400));
    }
  } else {
    next(error);
  }
}; 
 