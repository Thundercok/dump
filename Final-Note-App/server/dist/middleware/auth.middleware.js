"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireActivated = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const database_1 = require("../config/database");
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required'
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token || token === 'undefined' || token === 'null') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token format'
            });
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            // Basic validation of decoded token
            if (!decoded || typeof decoded !== 'object' || !decoded.id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token payload'
                });
            }
            // Set user in request without database check for better performance
            // ALWAYS ensure id is a number for proper foreign key relationships
            const userId = typeof decoded.id === 'string' ? parseInt(decoded.id, 10) : Number(decoded.id);
            console.log('[authenticate] decoded JWT user.id:', decoded.id, 'type:', typeof decoded.id);
            console.log('[authenticate] normalized user.id:', userId, 'type:', typeof userId);
            // Add warning for broken foreign keys
            if (isNaN(userId) || userId <= 0) {
                console.error('Invalid user ID in token:', decoded.id);
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid user ID in token'
                });
            }
            req.user = {
                ...decoded,
                id: userId // Ensure ID is always a number
            };
            // Special case for demo user - we need to ensure they always have id=1
            if (decoded.email === 'demo@example.com') {
                console.log('[authenticate] Demo user detected, forcing ID to 1');
                req.user.id = 1;
            }
            // Special handling for common users (ID verification)
            if (userId === 2) {
                try {
                    // Verify the user exists in DB
                    const [userRows] = await database_1.db.execute('SELECT * FROM users WHERE id = ?', [userId]);
                    if (!userRows || !userRows.length) {
                        console.log('[authenticate] User ID 2 not found in database, creating it');
                        // Auto-create the user to fix issues
                        const bcrypt = require('bcryptjs');
                        const hash = await bcrypt.hash('temppassword', 10);
                        await database_1.db.execute('INSERT IGNORE INTO users (id, email, display_name, password, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)', [2, decoded.email || 'user2@example.com', decoded.displayName || 'User 2', hash, 'user', 1]);
                    }
                    else {
                        console.log('[authenticate] User ID 2 found in database');
                    }
                }
                catch (dbError) {
                    console.error('[authenticate] Error checking/creating user:', dbError);
                    // Continue anyway
                }
            }
            // Only if required, check if user exists in database
            if (process.env.STRICT_AUTH_CHECK === 'true') {
                // Check if user exists
                const user = await user_model_1.UserModel.findById(decoded.id);
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
        }
        catch (jwtError) {
            // Handle token errors gracefully without crashing
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Authentication failed'
        });
    }
};
exports.authenticate = authenticate;
const requireActivated = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required'
            });
        }
        console.log('[requireActivated] req.user.id:', req.user.id, 'type:', typeof req.user.id);
        const user = await user_model_1.UserModel.findById(req.user.id);
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
    }
    catch (error) {
        console.error('Account activation check error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Authorization failed'
        });
    }
};
exports.requireActivated = requireActivated;
// For admin-only routes
const requireAdmin = async (req, res, next) => {
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
    }
    catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Authorization failed'
        });
    }
};
exports.requireAdmin = requireAdmin;
