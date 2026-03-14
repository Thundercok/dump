const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

// Reference to users from auth.routes.js - in a real app, this would be a database
const users = require('./auth.routes').users || [
  {
    id: '1',
    email: 'demo@example.com',
    displayName: 'Demo User',
    password: '$2a$10$yVuJnav9qn8WQcSeyc98RehrelJcZasXOeEFXVSkiWFJm4Rupd6lS',
    role: 'user',
    preferences: {
      theme: 'light',
      fontSize: 14,
      noteColor: '#ffffff'
    },
    isVerified: true,
    isActivated: true
  }
];

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // Don't send password back to client
  const { password, ...userWithoutPassword } = user;
  
  res.json({
    status: 'success',
    data: { user: userWithoutPassword }
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  const { displayName, preferences } = req.body;

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    displayName: displayName || users[userIndex].displayName,
    preferences: preferences ? {
      ...users[userIndex].preferences,
      ...preferences
    } : users[userIndex].preferences
  };

  // Don't send password back
  const { password, ...updatedUser } = users[userIndex];

  res.json({
    status: 'success',
    data: { user: updatedUser },
    message: 'Profile updated successfully'
  });
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password and new password are required'
    });
  }

  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  try {
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].password);
    
    if (!isValidPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    users[userIndex].password = hashedPassword;

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
});

module.exports = router; 
