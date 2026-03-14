"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLabelName = exports.validateNoteTitle = exports.validateDisplayName = exports.validatePassword = exports.validateEmail = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorMessages = errors.array().map((err) => err.msg);
        next(new errorHandler_1.AppError(errorMessages.join(', '), 400));
    };
};
exports.validate = validate;
// Common validation chains
const validateEmail = (field = 'email') => {
    return (0, express_validator_1.body)(field)
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail();
};
exports.validateEmail = validateEmail;
const validatePassword = (field = 'password') => {
    return (0, express_validator_1.body)(field)
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
};
exports.validatePassword = validatePassword;
const validateDisplayName = (field = 'displayName') => {
    return (0, express_validator_1.body)(field)
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Display name must be between 2 and 50 characters long')
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage('Display name can only contain letters, numbers, and spaces');
};
exports.validateDisplayName = validateDisplayName;
const validateNoteTitle = (field = 'title') => {
    return (0, express_validator_1.body)(field)
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters long');
};
exports.validateNoteTitle = validateNoteTitle;
const validateLabelName = (field = 'name') => {
    return (0, express_validator_1.body)(field)
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Label name must be between 1 and 50 characters long')
        .matches(/^[a-zA-Z0-9\s-]+$/)
        .withMessage('Label name can only contain letters, numbers, spaces, and hyphens');
};
exports.validateLabelName = validateLabelName;
