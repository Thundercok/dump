"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status, code) {
        super(message);
        this.status = status;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class DatabaseError extends AppError {
    constructor(message, sqlMessage) {
        super(message, 500);
        this.sqlMessage = sqlMessage;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DatabaseError = DatabaseError;
