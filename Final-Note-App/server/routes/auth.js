const express = require('express');
const router = express.Router();
const pool = require('../db'); // use MySQL pool

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // INSERT USER
    await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email already exists.' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Registration failed.' });
    }
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, userId: rows[0].id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
