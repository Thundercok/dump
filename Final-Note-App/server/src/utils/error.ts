export class AppError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  sqlMessage?: string;

  constructor(message: string, sqlMessage?: string) {
    super(message, 500);
    this.sqlMessage = sqlMessage;
    Error.captureStackTrace(this, this.constructor);
  }
} 
