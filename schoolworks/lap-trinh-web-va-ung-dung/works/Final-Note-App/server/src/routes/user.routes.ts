import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import { RowDataPacket } from 'mysql2';
import { db } from '../config/database';

const router = Router();

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Create a safe user object without password
    const safeUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isVerified: user.isVerified,
      isActivated: user.isActivated || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json({
      status: 'success',
      data: { user: safeUser }
    });
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    
    const { displayName, email } = req.body;
    
    const success = await UserModel.update(req.user.id, {
      displayName,
      email
    });
    
    if (!success) {
      throw new AppError('Failed to update user', 500);
    }
    
    const updatedUser = await UserModel.findById(req.user.id);
    if (!updatedUser) {
      throw new AppError('User not found after update', 404);
    }
    
    // Create a safe user object without password
    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      isActivated: updatedUser.isActivated || false,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
    
    res.json({
      status: 'success',
      data: { user: safeUser }
    });
  } catch (err) {
    next(err);
  }
});

// Admin-only: List all users
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    // There is no findAll method, we need to implement this or use a different approach
    // Let's just get all users with a direct database query for now
    
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users');
    
    if (!rows || rows.length === 0) {
      throw new AppError('No users found', 404);
    }
    
    // Convert rows to users and remove sensitive data
    const safeUsers = rows.map((row: any) => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
      isVerified: row.is_verified,
      isActivated: row.is_activated || false,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json({
      status: 'success',
      data: { users: safeUsers }
    });
  } catch (err) {
    next(err);
  }
});

// Check if a user exists by email (public endpoint for sharing validation)
router.get('/exists', async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ exists: false, message: 'Email is required' });
    }
    const user = await UserModel.findByEmail(email);
    res.json({ exists: !!user });
  } catch (err) {
    next(err);
  }
});

export default router; 
