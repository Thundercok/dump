"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get current user profile
router.get('/me', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        const user = await user_model_1.UserModel.findById(req.user.id);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
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
    }
    catch (err) {
        next(err);
    }
});
// Update user profile
router.put('/me', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        const { displayName, email } = req.body;
        const success = await user_model_1.UserModel.update(req.user.id, {
            displayName,
            email
        });
        if (!success) {
            throw new errorHandler_1.AppError('Failed to update user', 500);
        }
        const updatedUser = await user_model_1.UserModel.findById(req.user.id);
        if (!updatedUser) {
            throw new errorHandler_1.AppError('User not found after update', 404);
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
    }
    catch (err) {
        next(err);
    }
});
// Admin-only: List all users
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, async (req, res, next) => {
    try {
        const users = await user_model_1.UserModel.findAll();
        if (!users) {
            throw new errorHandler_1.AppError('No users found', 404);
        }
        // Remove sensitive data from all users
        const safeUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            isVerified: user.isVerified,
            isActivated: user.isActivated || false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        res.json({
            status: 'success',
            data: { users: safeUsers }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
