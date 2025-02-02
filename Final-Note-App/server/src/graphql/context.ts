import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createLoaders } from './dataloaders';
import { GraphQLError } from 'graphql';

// Interface for the user object in context
interface User {
  id: number;
  email: string;
  username?: string;
}

// Interface for the context object
export interface Context {
  req: Request;
  res: Response;
  user: User | null;
  loaders: ReturnType<typeof createLoaders>;
}

// Function to create context for each GraphQL request
export const createContext = async ({ req, res }: { req: Request; res: Response }): Promise<Context> => {
  // Initialize data loaders
  const loaders = createLoaders();
  
  // Get token from request header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split('Bearer ')[1];
  
  // If no token, return context without user
  if (!token) {
    return { req, res, user: null, loaders };
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
    
    // Extract user info from token payload
    const user: User = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username
    };
    
    return { req, res, user, loaders };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { req, res, user: null, loaders };
  }
}; 
