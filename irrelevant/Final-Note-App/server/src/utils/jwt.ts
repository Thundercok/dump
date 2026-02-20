import jwt, { SignOptions } from 'jsonwebtoken';
import { UserPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h'; // Fixed value for type safety

const signOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
};

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const verifyToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const decodeToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.decode(token) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}; 
