"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const errorHandler_1 = require("../middleware/errorHandler");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // max 5 files per upload
    },
    fileFilter: (req, file, cb) => {
        // Allow images and PDFs
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only images and PDFs are allowed'), false);
        }
    }
});
// Upload endpoint for note attachments
router.post('/', auth_middleware_1.authenticate, upload.array('files', 5), async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            throw new errorHandler_1.AppError('No files uploaded', 400);
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
    }
    catch (err) {
        next(err);
    }
});
// Get file
router.get('/:filename', (req, res, next) => {
    try {
        const filePath = path.join(UPLOAD_DIR, req.params.filename);
        if (!fs.existsSync(filePath)) {
            throw new errorHandler_1.AppError('File not found', 404);
        }
        res.sendFile(filePath);
    }
    catch (err) {
        next(err);
    }
});
// Delete file
router.delete('/:filename', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        const filePath = path.join(UPLOAD_DIR, req.params.filename);
        if (!fs.existsSync(filePath)) {
            throw new errorHandler_1.AppError('File not found', 404);
        }
        fs.unlinkSync(filePath);
        res.json({
            status: 'success',
            message: 'File deleted successfully'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
