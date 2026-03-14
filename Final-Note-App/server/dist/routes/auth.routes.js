"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_1 = require("../middleware/validation");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const user_model_1 = require("../models/user.model");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../../uploads/avatars'));
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const uniqueName = require('crypto').randomBytes(16).toString('hex') + ext;
        cb(null, uniqueName);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});
// Register
router.post('/register', (0, validation_middleware_1.validate)([
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('displayName')
        .isLength({ min: 2 })
        .withMessage('Display name must be at least 2 characters long')
]), auth_controller_1.AuthController.register);
// Login
router.post('/login', (0, validation_middleware_1.validate)([
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Please provide a password')
]), auth_controller_1.AuthController.login);
// Activate account
router.get('/activate/:token', auth_controller_1.AuthController.activate);
// Request password reset
router.post('/forgot-password', auth_controller_1.AuthController.requestPasswordReset);
// Reset password
router.post('/reset-password/:token', validation_1.validatePasswordReset, auth_controller_1.AuthController.resetPassword);
// Change password (requires authentication)
router.post('/change-password', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)([
    (0, express_validator_1.body)('currentPassword').exists().withMessage('Current password is required'),
    (0, validation_middleware_1.validatePassword)('newPassword')
]), auth_controller_1.AuthController.changePassword);
// Get current user
router.get('/me', auth_middleware_1.authenticate, async (req, res) => {
    if (!req.user)
        return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    const user = await user_model_1.UserModel.findById(req.user.id);
    if (!user)
        return res.status(404).json({ status: 'error', message: 'User not found' });
    res.json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                isVerified: user.isVerified
            }
        }
    });
});
// Update user preferences
router.put('/preferences', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)([
    (0, express_validator_1.body)('theme').isIn(['light', 'dark']).optional(),
    (0, express_validator_1.body)('fontSize').isInt({ min: 8, max: 32 }).optional(),
    (0, express_validator_1.body)('noteColor').matches(/^#[0-9A-F]{6}$/i).optional()
]), auth_controller_1.AuthController.updatePreferences);
// Resend verification email
router.post('/resend-verification', (0, validation_middleware_1.validateEmail)('email'), auth_controller_1.AuthController.resendVerification);
// Validate token
router.get('/validate-token', auth_middleware_1.authenticate, auth_controller_1.AuthController.validateToken);
// Update user profile
router.put('/profile', auth_middleware_1.authenticate, auth_controller_1.AuthController.updateProfile);
// Avatar upload route
router.post('/avatar', auth_middleware_1.authenticate, upload.single('avatar'), async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Authentication required' });
        if (!req.file)
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        // Save avatar path relative to /uploads/avatars
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        await auth_controller_1.AuthController.updateProfile({
            user: { id: userId },
            body: { avatar: avatarUrl },
        }, res, next);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
