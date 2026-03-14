"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status = 500, code) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    // Default error status and message
    let status = 500;
    let message = 'Internal Server Error';
    // Handle specific error types
    if (err instanceof AppError) {
        status = err.status;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    // Handle database errors
    if ('code' in err && err.code === 'ER_DUP_ENTRY') {
        status = 409;
        message = 'Duplicate entry found';
    }
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err
        })
    });
};
exports.errorHandler = errorHandler;
