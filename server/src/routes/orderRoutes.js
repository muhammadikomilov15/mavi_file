const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  retryTelegramNotification
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth middleware for guest checkout or authenticated customer checkout
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mavi_secret_key_super_secure_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Guest order
      req.user = null;
    }
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.post('/:id/retry-telegram', protect, authorize('admin'), retryTelegramNotification);

module.exports = router;
