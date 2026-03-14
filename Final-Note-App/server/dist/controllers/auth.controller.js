"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const email_service_1 = require("../services/email.service");
const errorHandler_1 = require("../middleware/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel = new user_model_1.UserModel();
class AuthController {
    static createToken(payload) {
        const options = {
            expiresIn: '24h'
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'your-secret-key', options);
    }
    static async register(req, res) {
        try {
            const { email, password, displayName, skipVerification } = req.body;
            // Check if user already exists
            const existingUser = await user_model_1.UserModel.findByEmail(email);
            if (existingUser) {
                throw new errorHandler_1.AppError('Email already registered', 400);
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            // Determine if email verification is required
            // By default we'll require verification unless skipVerification is explicitly set to true
            // In development mode, we can make verification optional for testing ease
            const isDev = process.env.NODE_ENV === 'development';
            const requireVerification = !(isDev && skipVerification === true);
            const activationToken = requireVerification ? (0, uuid_1.v4)() : undefined;
            // Create user
            const user = await user_model_1.UserModel.create({
                email,
                password: hashedPassword,
                displayName,
                role: 'user',
                isVerified: !requireVerification, // Only mark as verified if we're skipping verification
                activationToken,
                isActivated: !requireVerification
            });
            // Generate token
            const payload = {
                id: Number(user.id), // Ensure id is a number
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                isVerified: user.isVerified
            };
            // If email verification is required, send activation email
            if (requireVerification && activationToken) {
                try {
                    await email_service_1.emailService.sendActivationEmail(email, activationToken);
                }
                catch (error) {
                    console.error('Failed to send activation email:', error);
                    // Don't fail registration if email sending fails
                }
            }
            const token = AuthController.createToken(payload);
            res.status(201).json({
                status: 'success',
                message: requireVerification ?
                    'Registration successful! Please check your email to verify your account.' :
                    'Registration successful!',
                data: {
                    token,
                    user: payload,
                    requireVerification,
                    ...(isDev && requireVerification && activationToken ? { activationToken } : {})
                }
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                res.status(error.status).json({
                    status: 'error',
                    message: error.message
                });
            }
            else {
                console.error('Registration error:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Registration failed due to an internal server error'
                });
            }
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            // Special case for demo user
            if (email === 'demo@example.com' && password === 'demo123') {
                console.log('[AuthController.login] Demo user login attempt');
                // Check if demo user exists, create if not
                try {
                    const demoUser = await user_model_1.UserModel.findByEmail('demo@example.com');
                    if (!demoUser) {
                        console.log('[AuthController.login] Demo user not found, creating...');
                        const bcrypt = require('bcryptjs');
                        const hash = await bcrypt.hash('demo123', 10);
                        // Use direct database query to set the ID to 1
                        await user_model_1.UserModel.create({
                            email: 'demo@example.com',
                            password: hash,
                            displayName: 'Demo User',
                            role: 'user',
                            isVerified: true,
                            isActivated: true
                        });
                        // Force update the ID to 1 if needed
                        try {
                            await require('../config/database').db.execute("UPDATE users SET id = 1 WHERE email = 'demo@example.com' AND id != 1");
                        }
                        catch (updateErr) {
                            console.error('Error setting demo user ID to 1:', updateErr);
                        }
                        console.log('[AuthController.login] Demo user created');
                    }
                    else {
                        console.log('[AuthController.login] Demo user found:', demoUser.id);
                    }
                }
                catch (err) {
                    console.error('[AuthController.login] Error ensuring demo user exists:', err);
                }
                const token = jsonwebtoken_1.default.sign({
                    id: 1, // Force ID to be 1 (number)
                    email: 'demo@example.com',
                    displayName: 'Demo User',
                    role: 'user',
                    isVerified: true
                }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
                return res.json({
                    status: 'success',
                    data: {
                        token,
                        user: {
                            id: 1, // Force ID to be 1 (number)
                            email: 'demo@example.com',
                            displayName: 'Demo User',
                            role: 'user',
                            isVerified: true
                        }
                    }
                });
            }
            // Check if user exists
            const user = await user_model_1.UserModel.findByEmail(email);
            if (!user) {
                throw new errorHandler_1.AppError('Invalid email or password', 401);
            }
            // Check password
            const isPasswordValid = await user_model_1.UserModel.verifyPassword(user, password);
            if (!isPasswordValid) {
                throw new errorHandler_1.AppError('Invalid email or password', 401);
            }
            // Generate token
            const payload = {
                id: Number(user.id), // Ensure id is a number
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                isVerified: user.isVerified
            };
            const token = AuthController.createToken(payload);
            res.status(200).json({
                status: 'success',
                data: {
                    token,
                    user: payload
                }
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                res.status(error.status).json({
                    status: 'error',
                    message: error.message
                });
            }
            else {
                console.error('Login error:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Login failed due to an internal server error'
                });
            }
        }
    }
    static async activate(req, res, next) {
        try {
            const { token } = req.params;
            const user = await user_model_1.UserModel.findByActivationToken(token);
            if (!user) {
                throw new errorHandler_1.AppError('Invalid or expired activation token', 400);
            }
            // Update user
            await user_model_1.UserModel.update(user.id, {
                isVerified: true,
                isActivated: true,
                activationToken: null
            });
            res.json({
                status: 'success',
                message: 'Account activated successfully. You can now log in.'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            // If the email is not registered, return 'User not found'
            const user = await user_model_1.UserModel.findByEmail(email);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            // If the email is registered, proceed with password reset
            const resetToken = (0, uuid_1.v4)();
            const resetTokenExpires = new Date();
            resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
            // Update user with reset token
            await user_model_1.UserModel.update(user.id, {
                resetToken,
                resetTokenExpires
            });
            // Send reset email
            try {
                await email_service_1.emailService.sendPasswordResetEmail(email, resetToken);
            }
            catch (error) {
                console.error('Failed to send password reset email:', error);
                // Don't fail the request if email sending fails
            }
            res.json({
                status: 'success',
                message: 'Password reset instructions sent to your email'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            const user = await user_model_1.UserModel.findByResetToken(token);
            if (!user) {
                throw new errorHandler_1.AppError('Invalid or expired reset token', 400);
            }
            // Update password
            const password = await bcryptjs_1.default.hash(newPassword, 10);
            await user_model_1.UserModel.update(user.id, { password });
            // Clear reset token
            await user_model_1.UserModel.update(user.id, {
                resetToken: null,
                resetTokenExpires: null
            });
            res.json({
                status: 'success',
                message: 'Password reset successful'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        var _a;
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const user = await user_model_1.UserModel.findById(Number(userId));
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            // Verify current password
            const isValid = await user_model_1.UserModel.verifyPassword(user, currentPassword);
            if (!isValid) {
                throw new errorHandler_1.AppError('Current password is incorrect', 401);
            }
            // Update password
            const password = await bcryptjs_1.default.hash(newPassword, 10);
            await user_model_1.UserModel.update(user.id, { password });
            res.json({
                status: 'success',
                message: 'Password changed successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCurrentUser(req, res, next) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const user = await user_model_1.UserModel.findById(Number(userId));
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
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
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePreferences(req, res, next) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { theme, fontSize, noteColor, viewMode } = req.body;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const user = await user_model_1.UserModel.findById(Number(userId));
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            await user_model_1.UserModel.updatePreferences(user.id, {
                theme,
                fontSize,
                noteColor,
                viewMode
            });
            res.json({
                status: 'success',
                message: 'Preferences updated successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async resendVerification(req, res, next) {
        try {
            const { email } = req.body;
            // Find user by email
            const user = await user_model_1.UserModel.findByEmail(email);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            if (user.isVerified) {
                throw new errorHandler_1.AppError('Email is already verified', 400);
            }
            // Generate new activation token
            const activationToken = (0, uuid_1.v4)();
            await user_model_1.UserModel.update(user.id, { activationToken });
            // Resend activation email
            await email_service_1.emailService.sendActivationEmail(email, activationToken);
            res.json({
                status: 'success',
                message: 'Verification email has been resent. Please check your inbox.'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async validateToken(req, res, next) {
        try {
            // If the request reaches here, it means the token is valid
            // (because it passed through the auth middleware)
            res.json({
                status: 'success',
                message: 'Token is valid'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { displayName, email, preferences, avatar } = req.body;
            const user = await user_model_1.UserModel.findById(Number(userId));
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            // Only update fields that are provided
            const updateData = {};
            if (displayName)
                updateData.displayName = displayName;
            if (email)
                updateData.email = email;
            if (preferences)
                updateData.preferences = preferences;
            if (avatar)
                updateData.avatar = avatar;
            await user_model_1.UserModel.update(user.id, updateData);
            // Fetch the updated user
            const updatedUser = await user_model_1.UserModel.findById(Number(userId));
            res.json({
                status: 'success',
                message: 'Profile updated successfully',
                data: { user: updatedUser }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
