"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
const jwt_1 = require("../utils/jwt");
// Simple in-memory store for active notes (replaces Redis)
const activeNotes = new Map();
const setupWebSocket = (io) => {
    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                throw new Error('Authentication error');
            }
            const decoded = await (0, jwt_1.verifyToken)(token);
            socket.userId = decoded.id;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);
        // Join user's personal room
        socket.join(`user:${socket.userId}`);
        // Handle note editing
        socket.on('note:join', (noteId) => {
            socket.join(`note:${noteId}`);
        });
        socket.on('note:leave', (noteId) => {
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
exports.setupWebSocket = setupWebSocket;
