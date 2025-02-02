"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.uploadMultipleImages = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const errorHandler_1 = require("./errorHandler");
// Configure multer for storing uploaded files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});
// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new errorHandler_1.AppError('Only image files are allowed!', 400), false);
    }
};
// Configure upload settings
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
// Middleware for handling single image upload
exports.uploadSingleImage = upload.single('image');
// Middleware for handling multiple image uploads
exports.uploadMultipleImages = upload.array('images', 10); // Maximum 10 images
// Error handler for multer errors
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            next(new errorHandler_1.AppError('File size too large. Maximum size is 5MB', 400));
        }
        else if (error.code === 'LIMIT_FILE_COUNT') {
            next(new errorHandler_1.AppError('Too many files. Maximum is 10 files', 400));
        }
        else {
            next(new errorHandler_1.AppError(error.message, 400));
        }
    }
    else {
        next(error);
    }
};
exports.handleMulterError = handleMulterError;
