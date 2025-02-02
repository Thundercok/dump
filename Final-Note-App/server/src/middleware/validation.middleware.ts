import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map((err: any) => err.msg);
    next(new AppError(errorMessages.join(', '), 400));
  };
};

// Common validation chains
export const validateEmail = (field: string = 'email'): ValidationChain => {
  return body(field)
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();
};

export const validatePassword = (field: string = 'password'): ValidationChain => {
  return body(field)
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
};

export const validateDisplayName = (field: string = 'displayName'): ValidationChain => {
  return body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters long')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Display name can only contain letters, numbers, and spaces');
};

export const validateNoteTitle = (field: string = 'title'): ValidationChain => {
  return body(field)
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters long');
};

export const validateLabelName = (field: string = 'name'): ValidationChain => {
  return body(field)
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Label name must be between 1 and 50 characters long')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Label name can only contain letters, numbers, spaces, and hyphens');
}; 
 