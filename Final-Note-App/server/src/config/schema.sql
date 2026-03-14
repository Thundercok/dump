-- Drop and recreate database
DROP DATABASE IF EXISTS noteapp;
CREATE DATABASE noteapp;
USE noteapp;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    is_activated BOOLEAN DEFAULT TRUE,
    activation_token VARCHAR(255) NULL,
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL,
    avatar VARCHAR(255) NULL,
    preferences JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create notes table if it doesn't exist
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_password_protected BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notes_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Note shares table for collaboration (replacing note_collaborators)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create labels table if it doesn't exist
CREATE TABLE IF NOT EXISTS labels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_label (name, owner_id),
    INDEX idx_labels_owner (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create note_labels table if it doesn't exist
CREATE TABLE IF NOT EXISTS note_labels (
    note_id INT NOT NULL,
    label_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id, label_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Note images table
CREATE TABLE IF NOT EXISTS note_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    INDEX idx_note_images_note (note_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert demo user if not exists
INSERT IGNORE INTO users (id, email, display_name, password, role, is_verified, is_activated) 
VALUES (1, 'demo@example.com', 'Demo User', '$2a$10$zzMiWTPKkXVmdMFmWB/W0.L33g7.J5Wp0QJeKZAJx9Z1brfJOq1Vi', 'user', TRUE, TRUE);

-- Insert another user for testing collaborations
INSERT IGNORE INTO users (id, email, display_name, password, role, is_verified, is_activated) 
VALUES (2, 'user2@example.com', 'User Two', '$2a$10$zzMiWTPKkXVmdMFmWB/W0.L33g7.J5Wp0QJeKZAJx9Z1brfJOq1Vi', 'user', TRUE, TRUE);

-- Insert sample notes for demo user
INSERT IGNORE INTO notes (id, user_id, title, content, is_pinned) 
VALUES 
(1, 1, 'Welcome to NoteApp', 'This is a sample note to help you get started. You can create, edit, and delete notes.', TRUE),
(2, 1, 'Features Available', 'Password protection and collaboration features are now available!', FALSE);

-- Insert sample labels for demo user
INSERT IGNORE INTO labels (id, name, owner_id) 
VALUES 
(1, 'Personal', 1),
(2, 'Work', 1),
(3, 'Important', 1);

-- Associate sample notes with labels
INSERT IGNORE INTO note_labels (note_id, label_id) 
VALUES 
(1, 1),
(1, 3),
(2, 2);
