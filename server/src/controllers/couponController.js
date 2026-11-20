const Coupon = require('../models/Coupon');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

// @desc Validate coupon code for checkout
// @route POST /api/coupons/validate
const validateCoupon = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.validateCoupon(req, res);
  }

  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return memoryStore.validateCoupon(req, res);
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Coupon requires a minimum order of ${coupon.minOrderAmount.toLocaleString()} UZS`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (error) {
    console.warn('[Coupon DB Fallback]:', error.message);
    return memoryStore.validateCoupon(req, res);
  }
};

// @desc Get all coupons (Admin)
// @route GET /api/coupons
const getAllCoupons = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getAllCoupons(req, res);
  }

  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    return memoryStore.getAllCoupons(req, res);
  }
};

// @desc Create coupon (Admin)
// @route POST /api/coupons
const createCoupon = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.createCoupon(req, res);
  }

  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc Delete coupon (Admin)
// @route DELETE /api/coupons/:id
const deleteCoupon = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.deleteCoupon(req, res);
  }

  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Coupon removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon
};
