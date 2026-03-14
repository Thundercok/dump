import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { UserPayload } from '../types';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

// Simple in-memory store for active notes (replaces Redis)
const activeNotes = new Map<string, string>();

export const setupWebSocket = (io: Server): void => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }

      const decoded = await verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Handle note editing
    socket.on('note:join', (noteId: string) => {
      socket.join(`note:${noteId}`);
    });

    socket.on('note:leave', (noteId: string) => {
      socket.leave(`note:${noteId}`);
    });

    socket.on('note:update', async ({ noteId, content, cursor }) => {
      // Store content in memory for conflict resolution (simplified)
      activeNotes.set(`note:${noteId}:content`, content);
      
      // Broadcast changes to all users in the note's room except sender
      socket.to(`note:${noteId}`).emit('note:updated', {
        noteId,
        content,
        cursor,
        userId: socket.userId
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}; 
