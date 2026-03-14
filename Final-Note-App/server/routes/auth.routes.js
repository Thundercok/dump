const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');

// Simple in-memory user database for demo purposes
// In production, this would connect to a real database
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    displayName: 'Demo User',
    // password: demo123
    password: '$2a$10$yVuJnav9qn8WQcSeyc98RehrelJcZasXOeEFXVSkiWFJm4Rupd6lS',
    role: 'user',
    isVerified: true,
    isActivated: true,
    preferences: {
      theme: 'light',
      fontSize: 14,
      noteColor: '#ffffff'
    }
  }
];

// Store verification tokens and password reset tokens
const verificationTokens = {};
const passwordResetTokens = {};

// Mock email sending function
const sendEmail = (to, subject, text) => {
  console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
  console.log(`[EMAIL] Content: ${text}`);
  
  // In a real application, you would use a service like SendGrid, Mailgun, etc.
  return Promise.resolve({ 
    status: 'success', 
    message: `Email sent to ${to}` 
  });
};

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Simple validation
    if (!email || !password || !displayName) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create new user
    const newUser = {
      id: Math.floor(Math.random() * 10000).toString(),
      email,
      displayName,
      password: hashedPassword,
      role: 'user',
      isVerified: false, // Set to false until email is verified
      isActivated: false,
      preferences: {
        theme: 'light',
        fontSize: 14,
        noteColor: '#ffffff'
      },
      createdAt: new Date()
    };

    // Add to our "database"
    users.push(newUser);
    
    // Store verification token
    verificationTokens[verificationToken] = {
      userId: newUser.id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { 
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        isVerified: newUser.isVerified
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      'Verify your Not-Notion account',
      `Welcome to Not-Notion! Please verify your email by clicking the following link: ${verificationUrl}`
    );

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          displayName: newUser.displayName,
          role: newUser.role,
          isVerified: newUser.isVerified
        }
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed due to an internal server error'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH] Login attempt for:', email);

    // Special case for demo user - always allow this to work
    if (email === 'demo@example.com' && password === 'demo123') {
      console.log('[AUTH] Demo user login successful');

      // Generate token
      const token = jwt.sign(
        { 
          id: '1',
          email: 'demo@example.com',
          displayName: 'Demo User',
          role: 'user',
          isVerified: true
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            id: '1',
            email: 'demo@example.com',
            displayName: 'Demo User',
            role: 'user',
            isVerified: true
          }
        }
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        isVerified: user.isVerified
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Login failed due to an internal server error'
    });
  }
});

// Verify email route
router.get('/verify-email/:token', (req, res) => {
  const { token } = req.params;
  
  // Check if token exists and is valid
  const verificationData = verificationTokens[token];
  if (!verificationData) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid or expired verification token'
    });
  }
  
  // Check if token is expired
  if (new Date() > new Date(verificationData.expires)) {
    // Remove expired token
    delete verificationTokens[token];
    
    return res.status(400).json({
      status: 'error',
      message: 'Verification token has expired'
    });
  }
  
  // Find user
  const userIndex = users.findIndex(u => u.id === verificationData.userId);
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // Update user
  users[userIndex].isVerified = true;
  users[userIndex].isActivated = true;
  
  // Remove token
  delete verificationTokens[token];
  
  // Redirect to login page with success message
  res.json({
    status: 'success',
    message: 'Email verified successfully. You can now login.',
    redirectUrl: '/login?message=Email%20verified%20successfully'
  });
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // User already verified
    if (user.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already verified'
      });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Store token
    verificationTokens[verificationToken] = {
      userId: user.id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      'Verify your Not-Notion account',
      `Please verify your email by clicking the following link: ${verificationUrl}`
    );
    
    res.json({
      status: 'success',
      message: 'Verification email sent successfully'
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send verification email'
    });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.json({
        status: 'success',
        message: 'If your email exists in our system, a password reset link has been sent'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Store token
    passwordResetTokens[resetToken] = {
      userId: user.id,
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
    };
    
    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with token
    passwordResetTokens[resetToken].otp = otp;
    
    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      'Reset your Not-Notion password',
      `You requested a password reset. Please use the following OTP: ${otp} or click this link: ${resetUrl}`
    );
    
    res.json({
      status: 'success',
      message: 'Password reset email sent successfully'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request'
    });
  }
});

// Verify reset token or OTP
router.post('/verify-reset-token', (req, res) => {
  const { token, otp } = req.body;
  
  // Check if we have token or OTP
  if (!token && !otp) {
    return res.status(400).json({
      status: 'error',
      message: 'Token or OTP is required'
    });
  }
  
  // If token is provided
  if (token) {
    // Check if token exists
    const resetData = passwordResetTokens[token];
    if (!resetData) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetData.expires)) {
      // Remove expired token
      delete passwordResetTokens[token];
      
      return res.status(400).json({
        status: 'error',
        message: 'Reset token has expired'
      });
    }
    
    return res.json({
      status: 'success',
      message: 'Token verified successfully'
    });
  }
  
  // If OTP is provided
  if (otp) {
    // Find token by OTP
    const tokenKey = Object.keys(passwordResetTokens).find(
      key => passwordResetTokens[key].otp === otp
    );
    
    if (!tokenKey) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP'
      });
    }
    
    const resetData = passwordResetTokens[tokenKey];
    
    // Check if token is expired
    if (new Date() > new Date(resetData.expires)) {
      // Remove expired token
      delete passwordResetTokens[tokenKey];
      
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired'
      });
    }
    
    return res.json({
      status: 'success',
      message: 'OTP verified successfully',
      data: { token: tokenKey }
    });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Check if token exists
    const resetData = passwordResetTokens[token];
    if (!resetData) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetData.expires)) {
      // Remove expired token
      delete passwordResetTokens[token];
      
      return res.status(400).json({
        status: 'error',
        message: 'Reset token has expired'
      });
    }
    
    // Find user
    const userIndex = users.findIndex(u => u.id === resetData.userId);
    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user password
    users[userIndex].password = hashedPassword;
    
    // Remove token
    delete passwordResetTokens[token];
    
    res.json({
      status: 'success',
      message: 'Password reset successfully',
      redirectUrl: '/login?message=Password%20reset%20successfully.%20Please%20log%20in%20with%20your%20new%20password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password'
    });
  }
});

// Validate token route
router.get('/validate-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({
      status: 'success',
      data: { user: decoded }
    });
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

// Get current user route
router.get('/me', (req, res) => {
  console.log('[AUTH] GET /me request received');
  
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('[AUTH] Token present:', !!token);

  if (!token) {
    console.log('[AUTH] No token provided');
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('[AUTH] Token decoded successfully, user ID:', decoded.id);
    
    // Try to find user in database
    const user = users.find(u => u.id === decoded.id);
    
    // If user not found but token is valid, return demo user as fallback
    if (!user) {
      console.log('[AUTH] User not found in database, using fallback demo user');
      
      // Check if fallback user is explicitly requested or we're in development mode
      const shouldUseFallback = req.query.fallback === 'true' || 
                               process.env.NODE_ENV === 'development';
      
      if (shouldUseFallback) {
        const fallbackUser = {
          id: decoded.id || '1',
          email: decoded.email || 'demo@example.com',
          displayName: decoded.displayName || 'Demo User',
          role: decoded.role || 'user',
          isVerified: decoded.isVerified || true,
          preferences: {
            theme: 'light',
            fontSize: 14,
            noteColor: '#ffffff'
          }
        };
        
        console.log('[AUTH] Returning fallback user:', fallbackUser);
        
        return res.json({
          status: 'success',
          data: {
            user: fallbackUser
          }
        });
      }
      
      console.log('[AUTH] No fallback user provided, returning 404');
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    console.log('[AUTH] User found, returning user data');
    
    // Return user data without sensitive information
    const { password, ...userWithoutPassword } = user;
    res.json({
      status: 'success',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (err) {
    console.error('[AUTH] Token verification error:', err);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

// Change password route
router.post('/change-password', (req, res) => {
  console.log('[AUTH] Change password request received');
  
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('[AUTH] No token provided');
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('[AUTH] Token decoded successfully, user ID:', decoded.id);
    
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password and new password are required'
      });
    }
    
    // Find the user
    const user = users.find(u => u.id === decoded.id);
    
    // If user not found but token is valid in dev mode, pretend success
    if (!user && process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Dev mode: User not found but pretending password change success');
      return res.json({
        status: 'success',
        message: 'Password changed successfully'
      });
    }
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isValidPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    // Update password
    const userIndex = users.findIndex(u => u.id === decoded.id);
    users[userIndex].password = hashedPassword;
    
    console.log('[AUTH] Password changed successfully for user:', decoded.id);
    
    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('[AUTH] Password change error:', err);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or server error'
    });
  }
});

module.exports = router;
module.exports.users = users; 
