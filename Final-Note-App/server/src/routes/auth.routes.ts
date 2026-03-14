import { Router, RequestHandler } from 'express';
import { body } from 'express-validator';
import { validate, validateEmail, validatePassword, validateDisplayName } from '../middleware/validation.middleware';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequestHandler } from '../types';
import { validateRegistration, validateLogin, validatePasswordReset } from '../middleware/validation';
import multer from 'multer';
import path from 'path';
import { UserModel } from '../models/user.model';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/avatars'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = require('crypto').randomBytes(16).toString('hex') + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
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
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('displayName')
      .isLength({ min: 2 })
      .withMessage('Display name must be at least 2 characters long')
  ]) as unknown as RequestHandler,
  AuthController.register as RequestHandler
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Please provide a password')
  ]) as unknown as RequestHandler,
  AuthController.login as RequestHandler
);

// Activate account
router.get(
  '/activate/:token',
  AuthController.activate as RequestHandler
);

// Request password reset
router.post(
  '/forgot-password',
  AuthController.requestPasswordReset as RequestHandler
);

// Reset password
router.post(
  '/reset-password/:token',
  validatePasswordReset as unknown as RequestHandler[],
  AuthController.resetPassword as RequestHandler
);

// Change password (requires authentication)
router.post(
  '/change-password',
  authenticate as RequestHandler,
  validate([
    body('currentPassword').exists().withMessage('Current password is required'),
    validatePassword('newPassword')
  ]) as unknown as RequestHandler,
  AuthController.changePassword as unknown as RequestHandler
);

// Get current user
router.get('/me', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
  const user = await UserModel.findById(req.user.id);
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
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
router.put(
  '/preferences',
  authenticate as RequestHandler,
  validate([
    body('theme').isIn(['light', 'dark']).optional(),
    body('fontSize').isInt({ min: 8, max: 32 }).optional(),
    body('noteColor').matches(/^#[0-9A-F]{6}$/i).optional()
  ]) as unknown as RequestHandler,
  AuthController.updatePreferences as unknown as RequestHandler
);

// Resend verification email
router.post('/resend-verification', 
  validateEmail('email') as unknown as RequestHandler,
  AuthController.resendVerification as RequestHandler
);

// Validate token
router.get('/validate-token', 
  authenticate as RequestHandler,
  AuthController.validateToken as RequestHandler
);

// Update user profile
router.put(
  '/profile',
  authenticate as RequestHandler,
  AuthController.updateProfile as RequestHandler
);

// Avatar upload route
router.post(
  '/avatar',
  authenticate as RequestHandler,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ status: 'error', message: 'Authentication required' });
      if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });
      // Save avatar path relative to /uploads/avatars
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      await AuthController.updateProfile({
        user: { id: userId },
        body: { avatar: avatarUrl },
      } as any, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export default router; 
 