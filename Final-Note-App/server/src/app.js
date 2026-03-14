const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('dotenv');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const { connectDB, pool, initSchema } = require('./config/database');
const path = require('path');

// Load environment variables
config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// API routes are directly at /, not at /api
// If we had note routes, we'd add them here:
// app.use('/notes', noteRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Welcome to Not-Notion API',
    version: '1.0.0'
  });
});

// API health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'success',
    timestamp: new Date(),
    database: pool.pool.config.connectionConfig ? 'connected' : 'disconnected'
  });
});

// Error handling
app.use('*', notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5500;
let server; // Declare server at module level

// Set up graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  if (server && typeof server.close === 'function') {
    server.close(() => {
      console.log('Server closed');
      pool.end().then(() => {
        console.log('Database pool closed');
        process.exit(0);
      }).catch(err => {
        console.error('Error closing database pool', err);
        process.exit(1);
      });
    });
  } else {
    console.log('Server not initialized or already closed');
    process.exit(0);
  }

  // Force close after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize database schema
    await initSchema();
    
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // --- SOCKET.IO COLLABORATION ---
    const { Server } = require('socket.io');
    const io = new Server(server, {
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      // Join a note room
      socket.on('join-note', ({ noteId, userId }) => {
        socket.join(`note-${noteId}`);
        socket.data.noteId = noteId;
        socket.data.userId = userId;
        // Optionally broadcast presence
        socket.to(`note-${noteId}`).emit('user-joined', { userId });
      });

      // Handle real-time note changes
      socket.on('note-changes', ({ noteId, content, userId }) => {
        // Broadcast to all other editors in the room
        socket.to(`note-${noteId}`).emit('note-changes', { noteId, content, userId });
      });

      // Leave room on disconnect
      socket.on('disconnect', () => {
        if (socket.data.noteId && socket.data.userId) {
          socket.to(`note-${socket.data.noteId}`).emit('user-left', { userId: socket.data.userId });
        }
      });
    });
    // --- END SOCKET.IO ---

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 
