import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { AppError } from './errorHandler';
import { UserPayload, AuthRequest } from '../types';

export interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user?: UserPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Helper function to attempt to extract token from all possible sources
    const tryExtractToken = (): string | null => {
      // Try auth header (Bearer token)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token && token !== 'undefined' && token !== 'null') {
          return token;
        }
      }

      // Try custom header (for clients that have issues with Authorization header)
      const customToken = req.headers['x-auth-token'] as string;
      if (customToken && customToken !== 'undefined' && customToken !== 'null') {
        return customToken;
      }

      // Try cookie
      if (req.cookies && req.cookies.token) {
        return req.cookies.token;
      }

      // Try query parameter (not recommended for production, but helps debug)
      if (req.query && req.query.token) {
        return req.query.token as string;
      }

      return null;
    };

    // Get token from any available source
    const token = tryExtractToken();
    
    if (!token) {
      // Only return 401 for API endpoints, not for assets or static files
      if (req.path.startsWith('/api/') || req.path.startsWith('/auth/') || req.path.startsWith('/notes/')) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      } else {
        // For non-API requests, just continue without authentication
        return next();
      }
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as UserPayload;

      // Basic validation of decoded token
      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token format'
        });
      }

      // Set user in request without database check for better performance
      req.user = decoded;
      
      // Only if required, check if user exists in database
      if (process.env.STRICT_AUTH_CHECK === 'true') {
        // Check if user exists
        const user = await UserModel.findById(decoded.id);
        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: 'User not found'
          });
        }
        
        // Update user in request
        req.user = {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          isVerified: user.isVerified
        };
      }

      next();
    } catch (jwtError) {
      // Handle token errors gracefully without crashing
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

export const requireActivated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.isActivated === false) {
      return res.status(403).json({
        status: 'error',
        message: 'Account not activated'
      });
    }

    next();
  } catch (error) {
    console.error('Account activation check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authorization failed'
    });
  }
};

// For admin-only routes
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authorization failed'
    });
  }
}; 
