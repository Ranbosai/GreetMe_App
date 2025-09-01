import { Router, Request, Response } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail } from '../utils/email';

const router = Router();

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  const { name, telephone, email, nickname, password } = req.body;

  // Validation
  if (!name || !telephone || !email || !nickname || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(telephone)) {
    return res.status(400).json({ error: 'Invalid telephone number format.' });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if telephone or email already exists
    const checkQuery = 'SELECT id, email, telephone FROM users WHERE telephone = $1 OR email = $2';
    const existingUser = await pool.query(checkQuery, [telephone, email]);
    
    if (existingUser.rowCount && existingUser.rowCount > 0) {
      const user = existingUser.rows[0];
      if (user.email === email) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
      if (user.telephone === telephone) {
        return res.status(400).json({ error: 'Telephone number already exists.' });
      }
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, telephone, email, nickname, password_hash, is_verified, verification_token) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, name, email
    `;
    
    const result = await pool.query(insertQuery, [
      name.trim(),
      telephone.trim(),
      email.toLowerCase().trim(),
      nickname.trim(),
      passwordHash,
      false,
      verificationToken
    ]);

    const newUser = result.rows[0];

    // Send verification email
    sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification link.',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Email verification endpoint
router.get('/verify', async (req: Request, res: Response) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ error: 'Missing verification token or email.' });
  }

  try {
    // Find user with matching email and verification token
    const query = `
      UPDATE users 
      SET is_verified = true, verification_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE email = $1 AND verification_token = $2 AND is_verified = false
      RETURNING id, name, email
    `;
    
    const result = await pool.query(query, [email, token]);

    if (result.rowCount === 0) {
      return res.status(400).json({ 
        error: 'Invalid verification token or email, or account already verified.' 
      });
    }

    const user = result.rows[0];

    // Send welcome email
    sendWelcomeEmail(user.email, user.name);

    res.json({ 
      message: 'Thank you for confirming your registration',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Email verification failed. Please try again.' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email.toLowerCase().trim()]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({ 
        error: 'Please verify your email address before logging in.' 
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update last login time
    await pool.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // In a production app, you would generate a JWT token here
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: user.nickname
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get user profile endpoint (for future use)
router.get('/profile/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = 'SELECT id, name, email, nickname, created_at FROM users WHERE id = $1 AND is_verified = true';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];
    res.json({ user });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

export default router;
