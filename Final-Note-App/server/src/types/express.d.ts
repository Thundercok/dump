import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
 