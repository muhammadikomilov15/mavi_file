const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mavi_secret_key_super_secure_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc Register a new customer
// @route POST /api/auth/register
const register = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.registerUser(req, res);
  }

  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone number, and password.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'customer'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.warn('[Register DB Fallback]:', error.message);
    return memoryStore.registerUser(req, res);
  }
};

// @desc Login customer or admin
// @route POST /api/auth/login
const login = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.loginUser(req, res);
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Check memory store for admin login fallback
      return memoryStore.loginUser(req, res);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled. Please contact support.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.warn('[Login DB Fallback]:', error.message);
    return memoryStore.loginUser(req, res);
  }
};

// @desc Get current authenticated user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  if (!isDBConnected()) {
    const user = memoryStore.getUserById(req.user._id) || req.user;
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      }
    });
  }

  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('wishlist');

    if (!user) {
      const memUser = memoryStore.getUserById(req.user._id);
      return res.status(200).json({ success: true, user: memUser || req.user });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    const user = memoryStore.getUserById(req.user._id) || req.user;
    res.status(200).json({ success: true, user });
  }
};

// @desc Update user profile & addresses
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, addresses } = req.body;
    if (!isDBConnected()) {
      const user = memoryStore.getUserById(req.user._id);
      if (user) {
        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (addresses) user.addresses = addresses;
      }
      return res.status(200).json({ success: true, user: user || req.user });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (addresses && Array.isArray(addresses)) user.addresses = addresses;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle wishlist item
// @route POST /api/auth/wishlist/toggle
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    if (!isDBConnected()) {
      const user = memoryStore.getUserById(req.user._id);
      if (user) {
        user.wishlist = user.wishlist || [];
        const idx = user.wishlist.indexOf(productId);
        let isAdded = false;
        if (idx > -1) {
          user.wishlist.splice(idx, 1);
        } else {
          user.wishlist.push(productId);
          isAdded = true;
        }
        return res.status(200).json({ success: true, isAdded, wishlist: user.wishlist });
      }
      return res.status(200).json({ success: true, isAdded: true, wishlist: [productId] });
    }

    const user = await User.findById(req.user._id);
    const index = user.wishlist.findIndex(id => id.toString() === productId);

    let isAdded = false;
    if (index > -1) {
      user.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();
    const populated = await User.findById(user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      isAdded,
      wishlist: populated ? populated.wishlist : user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  toggleWishlist
};
