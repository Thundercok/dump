"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordReset = exports.validateLogin = exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array().map((err) => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg
            }))
        });
    }
    next();
};
exports.validateRegistration = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('displayName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Display name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage('Display name can only contain letters, numbers, and spaces'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('confirmPassword')
        .trim()
        .custom((value, { req }) => {
        if (!value) {
            throw new Error('Please confirm your password');
        }
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    validateRequest
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .exists()
        .withMessage('Password is required'),
    validateRequest
];
exports.validatePasswordReset = [
    (0, express_validator_1.body)('newPassword')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('confirmPassword')
        .trim()
        .custom((value, { req }) => {
        if (!value) {
            throw new Error('Please confirm your password');
        }
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    validateRequest
];
