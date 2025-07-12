import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token from cookie
export const verifyToken = async (req, res, next) => {
  try {
    // Skip authentication for auth routes and root route
    if (req.path.startsWith('/api/auth') || req.path === '/') {
      return next();
    }

    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Optional: Fetch fresh user data from database to ensure user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found. Token invalid.' });
    }

    // Add user info to request
    req.userId = decoded.id;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
};

