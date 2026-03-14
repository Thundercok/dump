import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Create a connection pool
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'noteapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await db.query('SELECT 1 + 1 AS result');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Continuing with limited functionality - some features may not work');
    // Don't throw the error so the application can continue
  }
};

// Schema definition with ALL tables
const SCHEMA_SQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  is_activated BOOLEAN DEFAULT FALSE,
  activation_token VARCHAR(255) NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires DATETIME NULL,
  avatar VARCHAR(255) NULL,
  preferences JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster lookups (drop first in case it exists)
DROP INDEX IF EXISTS idx_notes_user_id ON notes;
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_label (name, owner_id),
  INDEX idx_labels_owner (owner_id)
);

-- Create note_labels table
CREATE TABLE IF NOT EXISTS note_labels (
  note_id INT NOT NULL,
  label_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (note_id, label_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

-- Create note images table
CREATE TABLE IF NOT EXISTS note_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  INDEX idx_note_images_note (note_id)
);

-- Create note shares table for collaboration
CREATE TABLE IF NOT EXISTS note_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id INT NOT NULL,
  user_id INT NOT NULL,
  permission ENUM('read', 'write') NOT NULL DEFAULT 'read',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_share (note_id, user_id),
  INDEX idx_note_shares_note (note_id),
  INDEX idx_note_shares_user (user_id)
);

-- Insert default demo user if not exists
INSERT INTO users (id, email, display_name, password, role, is_verified, is_activated) 
VALUES (1, 'demo@example.com', 'Demo User', '$2a$10$demopasswordhashfordemouserdemo123', 'user', 1, 1)
ON DUPLICATE KEY UPDATE id=id;
`;

// Initialize database schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Initializing database schema...');
    
    // Split by semicolon to get individual statements
    const statements = SCHEMA_SQL
      .split(';')
      .filter((statement: string) => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim().length > 0) {
        try {
          await db.query(statement);
        } catch (err) {
          console.error('Error executing statement:', statement, err);
          // Continue with other statements
        }
      }
    }
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    console.log('Continuing with limited functionality - some features may not work');
    // Don't throw an error so the application can continue
  }
};

// Create demo records for testing
export const createDemoRecords = async (): Promise<void> => {
  try {
    console.log('Creating demo records...');
    
    // Force create demo user with ID 1 if it doesn't exist
    try {
      // First check if users table exists
      const [tables]: [any[], any] = await db.query(
        "SHOW TABLES LIKE 'users'"
      );
      
      if (tables.length === 0) {
        console.log('Users table does not exist, skipping demo creation');
        return;
      }
      
      // Try to directly insert or update the demo user with ID=1
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('demo123', 10);
      
      await db.query(`
        INSERT INTO users (id, email, display_name, password, role, is_verified, is_activated) 
        VALUES (1, 'demo@example.com', 'Demo User', ?, 'user', 1, 1)
        ON DUPLICATE KEY UPDATE 
          display_name = VALUES(display_name),
          password = VALUES(password),
          is_verified = 1,
          is_activated = 1
      `, [hash]);
      
      console.log('Demo user created or updated with id: 1');
      
      // Check if demo user has notes
      const [noteRows]: [any[], any] = await db.execute(
        "SELECT COUNT(*) as count FROM notes WHERE user_id = 1"
      );
      
      if (noteRows[0].count === 0) {
        // Create sample notes for the demo user
        await db.execute(
          "INSERT INTO notes (user_id, title, content, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW()), (?, ?, ?, ?, NOW(), NOW()), (?, ?, ?, ?, NOW(), NOW())",
          [
            1, 'Welcome to Note App', 'This is your first note!', 1,
            1, 'How to Use Labels', 'Labels help organize your notes.', 0,
            1, 'Note Taking Tips', 'Write concise, clear notes.', 0
          ]
        );
        
        console.log('Sample notes created for demo user');
        
        // Create sample labels for the demo user
        await db.execute(
          "INSERT IGNORE INTO labels (name, owner_id) VALUES (?, ?), (?, ?), (?, ?)",
          [
            'Important', 1,
            'Personal', 1,
            'Work', 1
          ]
        );
        
        console.log('Sample labels created for demo user');
      } else {
        console.log(`Demo user already has ${noteRows[0].count} notes`);
      }
    } catch (err) {
      console.error('Error creating/updating demo user:', err);
    }
  } catch (error) {
    console.error('Failed to create demo records:', error);
    // Don't throw error, just log it - we don't want to crash the server
  }
}; 
