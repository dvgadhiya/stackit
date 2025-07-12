import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import User from '../models/User.model.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// REGISTER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, passwordHash });

    // Create JWT payload
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // set true in production
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered and logged in',
      user: payload
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    // Check cookie first
    const token = req.cookies.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);

        return res.json({
          message: 'User logged in via cookie',
          user: decoded
        });
      } catch (err) {
        // Invalid token - proceed with normal login
      }
    }

    // Otherwise, check credentials
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const newToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.cookie('token', newToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: payload
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  });

  res.json({ message: 'Logged out successfully' });
}
