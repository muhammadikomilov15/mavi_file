const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mavi_secret_key_super_secure_2026');
    let user = null;

    if (isDBConnected() && decoded.id && decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        user = null;
      }
    }

    // Fallback to memory store if not found in MongoDB
    if (!user) {
      user = memoryStore.getUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'User account has been deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token has expired.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'anonymous'}) is not permitted to perform this action.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
