import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface UserPreferences {
  theme: string;
  fontSize: number;
  noteColor: string;
  viewMode: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  displayName: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isActivated?: boolean;
  activationToken?: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string | null;
}

export interface UserPayload {
  id: number;
  email: string;
  displayName: string;
  role: string;
  isVerified: boolean;
}

export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: UserPayload;
}

export type AuthRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> = (
  req: AuthRequest<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: number;
  name: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteShare {
  id: number;
  noteId: number;
  userId: number;
  permission: 'read' | 'write';
  createdAt: Date;
}

export interface DatabaseError extends Error {
  code?: string;
  sqlMessage?: string;
} 
