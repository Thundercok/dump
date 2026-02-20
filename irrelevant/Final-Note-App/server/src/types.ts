import { Request, Response, NextFunction } from 'express';

export interface UserPayload {
  id: number;
  email: string;
  displayName: string;
  role: string;
  isVerified: boolean;
}

export interface User {
  id: number;
  email: string;
  displayName: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isActivated: boolean;
  activationToken?: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  preferences?: UserPreferences;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  viewMode?: 'grid' | 'list';
  theme?: 'light' | 'dark' | 'system';
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortDirection?: 'asc' | 'desc';
  [key: string]: any;
}

export interface UpdateUserDTO {
  displayName?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  isActivated?: boolean;
  activationToken?: string | null;
  resetToken?: string | null;
  resetTokenExpires?: Date | null;
  preferences?: UserPreferences;
  avatar?: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export type AuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;

export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  isPinned: boolean;
  isPasswordProtected?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaborator {
  userId: number;
  email: string;
  displayName: string;
  role: 'viewer' | 'editor';
}

export interface Label {
  id: number;
  name: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordProtectDTO {
  password: string | null;
}

export interface CollaboratorDTO {
  email: string;
  role: 'viewer' | 'editor';
}

export interface NoteWithMeta extends Note {
  labels?: string[];
  collaborators?: Collaborator[];
} 
